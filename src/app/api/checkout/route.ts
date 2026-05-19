import { getRazorpayInstance } from '@/lib/razorpay'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

const COD_CHARGE = 50
const PREPAID_DISCOUNT_PERCENT = 5

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, payment_method, user_id } = body

    if (!items?.length || !payment_method || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Subtotal = sum of launch-discounted prices (before checkout discount)
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )

    // Check if user has an unused early access discount
    let earlyAccessDiscount = 0
    try {
      const adminSupabase = createAdminClient()

      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user_id)
        .single()

      if (profile?.phone_number) {
        const rawPhone = profile.phone_number.replace(/\D/g, '')
        const normalizedPhone = rawPhone.startsWith('91')
          ? rawPhone
          : '91' + rawPhone

        const { data: muse } = await adminSupabase
          .from('muses')
          .select('id, discount_percent, discount_used')
          .eq('phone', normalizedPhone)
          .eq('discount_used', false)
          .single()

        if (muse) {
          earlyAccessDiscount = muse.discount_percent
          console.log('[Checkout] Early access discount found:', muse.discount_percent + '%')
        }
      }
    } catch (e) {
      console.log('[Checkout] No early access discount found')
    }

    // Determine discount percentage
    let discountPercent = 0
    let delivery_charge = 0

    if (payment_method === 'prepaid') {
      discountPercent = PREPAID_DISCOUNT_PERCENT + earlyAccessDiscount
      delivery_charge = 0
    } else {
      discountPercent = earlyAccessDiscount > 0 ? earlyAccessDiscount : 0
      delivery_charge = COD_CHARGE
    }

    // ═══════════════════════════════════════════════════
    // CORE CHANGE: Calculate discount PER ITEM, then sum
    // ═══════════════════════════════════════════════════
    const multiplier = (100 - discountPercent) / 100

    const itemsWithFinal = items.map(
      (item: { price: number; quantity: number }) => ({
        ...item,
        final_price: Math.round(item.price * multiplier),
      })
    )

    // Total = sum of per-item final prices (after discount)
    const discountedTotal = itemsWithFinal.reduce(
      (sum: number, item: { final_price: number; quantity: number }) =>
        sum + item.final_price * item.quantity,
      0
    )

    const discount = subtotal - discountedTotal
    const total = discountedTotal + delivery_charge

    // Create Razorpay order (prepaid only)
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
        },
      })
      razorpay_order_id = razorpayOrder.id
    }

    return NextResponse.json({
      razorpay_order_id,
      razorpay_key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subtotal,
      discount,
      delivery_charge,
      total,
      payment_method,
      is_early_access: earlyAccessDiscount > 0,
      early_access_percent: earlyAccessDiscount,
      prepaid_percent: payment_method === 'prepaid' ? PREPAID_DISCOUNT_PERCENT : 0,
      total_discount_percent: discountPercent,
      items_with_final: itemsWithFinal,
    })
  } catch (err) {
    console.error('[Muse & Mist] /api/checkout error:', err)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}
