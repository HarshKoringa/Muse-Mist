import { createAdminClient } from '@/utils/supabase/admin'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createShiprocketOrder } from '@/lib/shiprocket'
import { sendOrderConfirmation } from '@/lib/whatsapp'
import { rateLimit } from '@/lib/rateLimit'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const COD_CHARGE = 50
const PREPAID_DISCOUNT_PERCENT = 5
const MAX_QUANTITY_PER_ITEM = 10

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_data,
    } = body

    // ══════════════════════════════════════════════════════
    // STEP 1: Authenticate the caller
    // ══════════════════════════════════════════════════════
    const serverSupabase = await createServerClient()
    const { data: { user: sessionUser } } = await serverSupabase.auth.getUser()

    if (!sessionUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (sessionUser.id !== order_data?.user_id) {
      console.error('[SECURITY] User ID spoofing attempt:', {
        session_user: sessionUser.id,
        claimed_user: order_data?.user_id,
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ══════════════════════════════════════════════════════
    // STEP 2: Rate limit — 5 verifications per minute per user
    // ══════════════════════════════════════════════════════
    const { allowed } = rateLimit(`verify:${sessionUser.id}`, 5, 60 * 1000)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait.' },
        { status: 429 }
      )
    }

    const supabase = createAdminClient()
    const isCOD = order_data.payment_method === 'cod'

    // ══════════════════════════════════════════════════════
    // STEP 3: Verify Razorpay signature (prepaid only)
    // ══════════════════════════════════════════════════════
    if (!isCOD) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { error: 'Missing payment data' },
          { status: 400 }
        )
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      if (expectedSignature !== razorpay_signature) {
        console.error('[SECURITY] Razorpay signature mismatch')
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 400 }
        )
      }
    }

    // ══════════════════════════════════════════════════════
    // STEP 4: Block replay attacks — same payment ID used twice
    // ══════════════════════════════════════════════════════
    if (razorpay_payment_id) {
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('razorpay_payment_id', razorpay_payment_id)
        .maybeSingle()

      if (existingOrder) {
        console.error('[SECURITY] Replay attack blocked:', razorpay_payment_id)
        return NextResponse.json(
          { error: 'This payment has already been processed' },
          { status: 409 }
        )
      }
    }

    // ══════════════════════════════════════════════════════
    // STEP 5: Verify user
    // ══════════════════════════════════════════════════════
    const userId = order_data.user_id
    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    // ══════════════════════════════════════════════════════
    // STEP 6: Extract item IDs + quantities — ignore ALL client prices
    // ══════════════════════════════════════════════════════
    const clientItems: { id: string; quantity: number }[] = (order_data.items || []).map(
      (item: { id: string; quantity: number }) => ({
        id: item.id,
        quantity: Math.min(MAX_QUANTITY_PER_ITEM, Math.max(1, Math.floor(Number(item.quantity) || 1))),
      })
    )

    if (!clientItems.length) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    // ══════════════════════════════════════════════════════
    // STEP 7: Fetch REAL product data from database
    // ══════════════════════════════════════════════════════
    const productIds = clientItems.map((i) => i.id)
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, name, slug, price, mrp, stock_count, is_active, image_url, size, category')
      .in('id', productIds)

    if (prodErr || !products?.length) {
      console.error('[SECURITY] Products not found:', productIds)
      return NextResponse.json({ error: 'Products not found' }, { status: 400 })
    }

    const productMap = new Map(products.map((p) => [p.id, p]))

    for (const item of clientItems) {
      const product = productMap.get(item.id)
      if (!product || !product.is_active) {
        return NextResponse.json(
          { error: `Product unavailable: ${item.id}` },
          { status: 400 }
        )
      }
      if (product.stock_count < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }
    }

    // ══════════════════════════════════════════════════════
    // STEP 8: Calculate early access discount from DB
    // ══════════════════════════════════════════════════════
    let earlyAccessDiscount = 0
    let isEarlyAccess = false

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', userId)
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
        }
      }
    } catch (e) {
      console.log('[Order] No early access discount')
    }

    // ══════════════════════════════════════════════════════
    // STEP 9: SERVER-SIDE price calculation — trust NO client data
    // ══════════════════════════════════════════════════════
    let discountPercent = 0
    let deliveryCharge = 0

    if (!isCOD) {
      discountPercent = PREPAID_DISCOUNT_PERCENT + earlyAccessDiscount
      deliveryCharge = 0
    } else {
      discountPercent = earlyAccessDiscount > 0 ? earlyAccessDiscount : 0
      deliveryCharge = COD_CHARGE
    }

    const multiplier = (100 - discountPercent) / 100

    const serverItems = clientItems.map((item) => {
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

    // ══════════════════════════════════════════════════════
    // STEP 10: Verify Razorpay payment amount (prepaid only)
    // ══════════════════════════════════════════════════════
    if (!isCOD && razorpay_order_id) {
      try {
        const { getRazorpayInstance } = await import('@/lib/razorpay')
        const razorpay = getRazorpayInstance()
        const rzpOrder = await razorpay.orders.fetch(razorpay_order_id)

        const paidAmountPaise = Number(rzpOrder.amount)
        const expectedAmountPaise = total * 100

        if (paidAmountPaise !== expectedAmountPaise) {
          console.error('[SECURITY] AMOUNT MISMATCH!', {
            paid: paidAmountPaise,
            expected: expectedAmountPaise,
            razorpay_order_id,
            user_id: userId,
          })
          return NextResponse.json(
            { error: 'Payment amount mismatch — order rejected' },
            { status: 400 }
          )
        }

        console.log('[Security] Razorpay amount verified ✓', total)
      } catch (rzpErr: any) {
        console.error('[Security] Razorpay verification failed:', rzpErr.message)
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 400 }
        )
      }
    }

    // ══════════════════════════════════════════════════════
    // STEP 11: Validate shipping address
    // ══════════════════════════════════════════════════════
    const address = order_data.shipping_address || {}

    if (!address.name || typeof address.name !== 'string' || address.name.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }

    const phone = String(address.phone || '').replace(/\D/g, '').slice(-10)
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    if (!address.address || typeof address.address !== 'string' || address.address.trim().length < 5) {
      return NextResponse.json({ error: 'Invalid street address' }, { status: 400 })
    }

    if (!address.city || typeof address.city !== 'string' || address.city.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid city' }, { status: 400 })
    }

    if (!address.state || typeof address.state !== 'string' || address.state.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid state' }, { status: 400 })
    }

    const pincode = String(address.pincode || '')
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: 'Invalid pincode — must be 6 digits' }, { status: 400 })
    }

    // ══════════════════════════════════════════════════════
    // STEP 12: Atomic stock decrement — BEFORE creating the order
    // Two simultaneous orders cannot both succeed if stock is 1
    // ══════════════════════════════════════════════════════
    for (const item of serverItems) {
      const { data: success, error: stockErr } = await supabase.rpc('decrement_stock', {
        product_id: item.id,
        quantity: item.quantity,
      })

      if (stockErr || success === false) {
        console.error('[Stock] Insufficient stock for:', item.name)

        // Rollback: re-increment any items already decremented in this loop
        for (const prevItem of serverItems) {
          if (prevItem.id === item.id) break
          await supabase.rpc('increment_stock', {
            product_id: prevItem.id,
            quantity: prevItem.quantity,
          })
        }

        return NextResponse.json(
          { error: `Sorry, ${item.name} is out of stock` },
          { status: 400 }
        )
      }
    }
    console.log('[Stock] Decremented ✓')

    // ══════════════════════════════════════════════════════
    // STEP 13: Save order with SERVER-CALCULATED values
    // ══════════════════════════════════════════════════════
    const orderStatus = isCOD ? 'pending' : 'paid'

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        payment_method: order_data.payment_method,
        subtotal: subtotal,
        discount: discount,
        delivery_charge: deliveryCharge,
        total: total,
        total_amount: total,
        items: serverItems,
        shipping_address: address,
        status: orderStatus,
        razorpay_order_id: razorpay_order_id ?? null,
        razorpay_payment_id: razorpay_payment_id ?? null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('[Order] Insert error:', orderError)
      throw orderError
    }

    // ══════════════════════════════════════════════════════
    // STEP 14: Insert order_items with SERVER prices
    // ══════════════════════════════════════════════════════
    try {
      const orderItemsRows = serverItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.final_price,
        mrp: item.mrp,
      }))

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItemsRows)

      if (itemsErr) {
        console.error('[OrderItems] Insert failed:', itemsErr.message)
      } else {
        console.log('[OrderItems] Inserted', orderItemsRows.length, 'items ✓')
      }
    } catch (e: any) {
      console.error('[OrderItems] Error:', e.message)
    }

    // ══════════════════════════════════════════════════════
    // STEP 15: Mark early access discount as used
    // ══════════════════════════════════════════════════════
    if (isEarlyAccess) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone_number')
          .eq('id', userId)
          .single()

        if (profile?.phone_number) {
          const rawPhone = profile.phone_number.replace(/\D/g, '')
          const normalizedPhone = rawPhone.startsWith('91')
            ? rawPhone
            : '91' + rawPhone

          await supabase
            .from('muses')
            .update({ discount_used: true })
            .eq('phone', normalizedPhone)
            .eq('discount_used', false)

          console.log('[Order] Early access discount marked as used ✓')
        }
      } catch (e) {
        console.log('[Order] Could not mark discount as used:', e)
      }
    }

    // ══════════════════════════════════════════════════════
    // STEP 16: Shiprocket order
    // ══════════════════════════════════════════════════════
    let shiprocketOrderId: string | null = null
    let awbCode: string | null = null

    try {
      const nameParts = (address.name ?? 'Customer').trim().split(' ')
      const firstName = nameParts[0] ?? 'Customer'
      const lastName = nameParts.slice(1).join(' ') || 'Customer'

      const rawPhone = (address.phone ?? '').toString().replace(/\D/g, '').replace(/^91/, '')
      const shiprocketPhone = rawPhone.slice(-10) || '9000000000'

      const PRODUCT_TAX_CONFIG: Record<string, { gstRate: number; hsnCode: number }> = {
        'cleanse-clear-calm':    { gstRate: 5,  hsnCode: 34011190 },
        'barrier-repair':        { gstRate: 18, hsnCode: 33049990 },
        'reset-to-radiance':     { gstRate: 18, hsnCode: 33049990 },
        'invisible-glow-shield': { gstRate: 18, hsnCode: 33049990 },
        'smooth-and-spotless':   { gstRate: 18, hsnCode: 33049990 },
      }

      const productTotal = serverItems.reduce(
        (sum, item) => sum + item.final_price * item.quantity, 0
      )

      const shiprocketPayload = {
        order_id: `MM-${order.id.slice(0, 8).toUpperCase()}`,
        order_date: new Date().toISOString().split('T')[0],
        pickup_location: 'Home',
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: address.address ?? '',
        billing_city: address.city ?? '',
        billing_pincode: String(address.pincode ?? ''),
        billing_state: address.state ?? '',
        billing_country: 'India',
        billing_email: address.email || 'support@museandmist.in',
        billing_phone: shiprocketPhone,
        shipping_is_billing: true,
        payment_method: isCOD ? 'COD' : 'Prepaid',
        sub_total: productTotal,
        discount: "0",
        shipping_charges: deliveryCharge,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: "0",
        length: 10,
        breadth: 10,
        height: 8,
        weight: 0.3,
        order_items: serverItems.map((item) => {
          const taxConfig = PRODUCT_TAX_CONFIG[item.slug] ?? { gstRate: 18, hsnCode: 33049990 }
          return {
            name: item.name,
            sku: item.slug,
            units: item.quantity,
            selling_price: item.final_price,
            discount: "0",
            tax: String(taxConfig.gstRate),
            hsn: taxConfig.hsnCode,
          }
        }),
      }

      console.log('[Shiprocket] FULL PAYLOAD:', JSON.stringify(shiprocketPayload, null, 2))

      const result = await createShiprocketOrder(
        shiprocketPayload as Parameters<typeof createShiprocketOrder>[0]
      )
      shiprocketOrderId = result.orderId
      awbCode = result.awbCode

      console.log('[Shiprocket] SUCCESS:', shiprocketOrderId)

      await supabase
        .from('orders')
        .update({ shiprocket_order_id: shiprocketOrderId, awb_code: awbCode })
        .eq('id', order.id)

      console.log('[Shiprocket] Saved to DB ✓')
    } catch (shipErr: any) {
      console.error('[Shiprocket] FAILED:', order.id, '|', shipErr.message)
      try {
        await supabase
          .from('shiprocket_failures')
          .insert({
            order_id: order.id,
            error_message: shipErr.message,
            payload: {},
            retry_count: 0,
            resolved: false,
          })
      } catch (logErr) {
        console.error('[Shiprocket] Could not log failure:', logErr)
      }
    }

    // ══════════════════════════════════════════════════════
    // STEP 17: WhatsApp notification
    // ══════════════════════════════════════════════════════
    try {
      const customerPhone = address.phone || null
      const customerName = address.name || 'Customer'
      if (customerPhone) {
        await sendOrderConfirmation({
          phone: customerPhone,
          name: customerName,
          orderId: order.id,
          total: total,
          paymentMethod: order_data.payment_method,
        })
        console.log('[WhatsApp] Sent ✓')
      }
    } catch (waErr: any) {
      console.error('[WhatsApp] FAILED:', waErr.message)
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      shiprocket_order_id: shiprocketOrderId,
    })

  } catch (err) {
    console.error('[Muse & Mist] /api/verify-payment error:', err)
    return NextResponse.json(
      { error: 'Order confirmation failed' },
      { status: 500 }
    )
  }
}
