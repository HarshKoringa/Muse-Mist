import { getRazorpayInstance } from '@/lib/razorpay'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

const COD_CHARGE = 50
const PREPAID_DISCOUNT_PERCENT = 5

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, payment_method, user_id } = body

    // ── Validate input ───────────────────────────────────
    if (!items?.length || !payment_method || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['prepaid', 'cod'].includes(payment_method)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // ── Verify user exists ───────────────────────────────
    const { data: user, error: userErr } = await supabase.auth.admin.getUserById(user_id)
    if (userErr || !user) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 })
    }

    // ── Extract product IDs and quantities only — ignore client prices ───
    const itemRequests: { id: string; quantity: number }[] = items.map(
      (item: { id: string; quantity: number }) => ({
        id: item.id,
        quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      })
    )

    const productIds = itemRequests.map((i) => i.id)

    // ── Fetch REAL prices from database ──────────────────
    const { data: products, error: productsErr } = await supabase
      .from('products')
      .select('id, name, slug, price, mrp, stock_count, is_active, image_url, size, category')
      .in('id', productIds)

    if (productsErr || !products?.length) {
      return NextResponse.json(
        { error: 'Products not found' },
        { status: 400 }
      )
    }

    // ── Validate all products exist and are available ────
    const productMap = new Map(products.map((p) => [p.id, p]))

    for (const item of itemRequests) {
      const product = productMap.get(item.id)
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 400 }
        )
      }
      if (!product.is_active) {
        return NextResponse.json(
          { error: `Product unavailable: ${product.name}` },
          { status: 400 }
        )
      }
      if (product.stock_count < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock_count}` },
          { status: 400 }
        )
      }
    }

    // ── Check early access discount from DB ──────────────
    let earlyAccessDiscount = 0
    let isEarlyAccess = false

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user_id)
        .single()

      if (profile?.phone_number) {
        const rawPhone = profile.phone_number.replace(/\D/g, '')
        const normalizedPhone = rawPhone.startsWith('91')
          ? rawPhone
          : '91' + rawPhone

        const { data: muse } = await supabase
          .from('muses')
          .select('id, discount_percent, discount_used')
          .eq('phone', normalizedPhone)
          .eq('discount_used', false)
          .single()

        if (muse) {
          earlyAccessDiscount = muse.discount_percent
          isEarlyAccess = true
          console.log('[Checkout] Early access discount:', muse.discount_percent + '%')
        }
      }
    } catch (e) {
      console.log('[Checkout] No early access discount found')
    }

    // ── Calculate discount percentage ────────────────────
    let discountPercent = 0
    let deliveryCharge = 0

    if (payment_method === 'prepaid') {
      discountPercent = PREPAID_DISCOUNT_PERCENT + earlyAccessDiscount
      deliveryCharge = 0
    } else {
      discountPercent = earlyAccessDiscount > 0 ? earlyAccessDiscount : 0
      deliveryCharge = COD_CHARGE
    }

    // ── Calculate prices from DB data (PER ITEM) ─────────
    const multiplier = (100 - discountPercent) / 100

    const serverItems = itemRequests.map((item) => {
      const product = productMap.get(item.id)!
      const finalPrice = Math.round(product.price * multiplier)
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        mrp: product.mrp,
        quantity: item.quantity,
        final_price: finalPrice,
        image_url: product.image_url,
        size: product.size,
        category: product.category,
        stock_count: product.stock_count,
      }
    })

    const subtotal = serverItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    )
    const discountedTotal = serverItems.reduce(
      (sum, item) => sum + item.final_price * item.quantity, 0
    )
    const discount = subtotal - discountedTotal
    const total = discountedTotal + deliveryCharge

    // ── Create Razorpay order with SERVER-CALCULATED amount ──
    let razorpay_order_id = null

    if (payment_method === 'prepaid') {
      const razorpay = getRazorpayInstance()
      const razorpayOrder = await razorpay.orders.create({
        amount: total * 100,
        currency: 'INR',
        receipt: crypto.randomUUID().slice(0, 10),
        notes: {
          user_id,
          payment_method,
          items: JSON.stringify(
            itemRequests.map((i) => ({ id: i.id, qty: i.quantity }))
          ),
        },
      })
      razorpay_order_id = razorpayOrder.id
    }

    return NextResponse.json({
      razorpay_order_id,
      razorpay_key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subtotal,
      discount,
      delivery_charge: deliveryCharge,
      total,
      payment_method,
      is_early_access: isEarlyAccess,
      total_discount_percent: discountPercent,
      verified_items: serverItems,
    })
  } catch (err) {
    console.error('[Muse & Mist] /api/checkout error:', err)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}
