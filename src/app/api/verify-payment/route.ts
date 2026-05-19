import { createAdminClient } from '@/utils/supabase/admin'
import { createShiprocketOrder } from '@/lib/shiprocket'
import { sendOrderConfirmation } from '@/lib/whatsapp'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_data,
    } = body

    const isCOD = order_data.payment_method === 'cod'

    // Step 1 — Verify Razorpay signature (prepaid only)
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      if (expectedSignature !== razorpay_signature) {
        console.error('[Muse & Mist] Signature mismatch:', {
          expected: expectedSignature,
          received: razorpay_signature,
        })
        return NextResponse.json(
          { error: 'Payment verification failed — signature mismatch' },
          { status: 400 }
        )
      }
    }

    // Step 2 — Save order to Supabase
    const supabase = createAdminClient()
    const orderStatus = isCOD ? 'pending' : 'paid'

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: order_data.user_id,
        payment_method: order_data.payment_method,
        subtotal: order_data.subtotal ?? 0,
        discount: order_data.discount ?? 0,
        delivery_charge: order_data.delivery_charge ?? 0,
        total: order_data.total ?? 0,
        total_amount: order_data.total ?? 0,
        items: order_data.items ?? [],
        shipping_address: order_data.shipping_address ?? {},
        status: orderStatus,
        razorpay_order_id: razorpay_order_id ?? null,
        razorpay_payment_id: razorpay_payment_id ?? null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('[Muse & Mist] Supabase order insert error:', {
        message: orderError.message,
        code: orderError.code,
        details: orderError.details,
        hint: orderError.hint,
      })
      throw orderError
    }

    // Step 3 — Insert into order_items table
    try {
      const orderItemsRows = order_data.items.map(
        (item: { id: string; quantity: number; final_price: number; mrp: number; price: number }) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.final_price ?? item.price,
          mrp: item.mrp ?? null,
        })
      )

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsRows)

      if (itemsError) {
        console.error('[OrderItems] Insert failed:', itemsError.message)
      } else {
        console.log('[OrderItems] Inserted', orderItemsRows.length, 'items ✓')
      }
    } catch (e: any) {
      console.error('[OrderItems] Error:', e.message)
    }

    // Step 4 — Mark early access discount as used
    try {
      const profile = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', order_data.user_id)
        .single()

      if (profile.data?.phone_number) {
        const rawPhone = profile.data.phone_number.replace(/\D/g, '')
        const normalizedPhone = rawPhone.startsWith('91')
          ? rawPhone
          : '91' + rawPhone

        const { data: muse } = await supabase
          .from('muses')
          .select('id, discount_used')
          .eq('phone', normalizedPhone)
          .eq('discount_used', false)
          .single()

        if (muse) {
          await supabase
            .from('muses')
            .update({ discount_used: true })
            .eq('id', muse.id)
          console.log('[Order] Early access discount marked as used ✓')
        }
      }
    } catch (e) {
      console.log('[Order] Early access check:', e)
    }

    // ═══════════════════════════════════════════
    // Run Shiprocket + WhatsApp + Stock BEFORE responding
    // (Vercel kills background tasks after response)
    // ═══════════════════════════════════════════

    // 1. Stock decrement (fastest, most critical)
    try {
      for (const item of order_data.items) {
        await supabase.rpc('decrement_stock', {
          product_id: item.id,
          quantity: item.quantity,
        })
      }
      console.log('[Stock] Decremented ✓')
    } catch (e: any) {
      console.error('[Stock] Failed:', e.message)
    }

    // 2. Shiprocket order creation
    let shiprocketOrderId: string | null = null
    let awbCode: string | null = null
    try {
      const nameParts = (order_data.shipping_address?.name ?? 'Customer')
        .trim().split(' ')
      const firstName = nameParts[0] ?? 'Customer'
      const lastName = nameParts.slice(1).join(' ') || 'Customer'

      const rawPhone = (order_data.shipping_address?.phone ?? '')
        .toString().replace(/\D/g, '').replace(/^91/, '')
      const shiprocketPhone = rawPhone.slice(-10) || '9000000000'

      const PRODUCT_TAX_CONFIG: Record<string, { gstRate: number; hsnCode: number }> = {
        'cleanse-clear-calm':    { gstRate: 5,  hsnCode: 34011190 },
        'barrier-repair':        { gstRate: 18, hsnCode: 33049990 },
        'reset-to-radiance':     { gstRate: 18, hsnCode: 33049990 },
        'invisible-glow-shield': { gstRate: 18, hsnCode: 33049990 },
        'smooth-and-spotless':   { gstRate: 18, hsnCode: 33049990 },
      }

      const productTotal = order_data.items.reduce(
        (sum: number, item: { final_price?: number; price: number; quantity: number }) =>
          sum + (item.final_price ?? item.price) * item.quantity,
        0
      )

      const shiprocketPayload = {
        order_id: `MM-${order.id.slice(0, 8).toUpperCase()}`,
        order_date: new Date().toISOString().split('T')[0],
        pickup_location: 'Home',
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: order_data.shipping_address?.address ?? '',
        billing_city: order_data.shipping_address?.city ?? '',
        billing_pincode: String(order_data.shipping_address?.pincode ?? ''),
        billing_state: order_data.shipping_address?.state ?? '',
        billing_country: 'India',
        billing_email: order_data.shipping_address?.email || 'support@museandmist.in',
        billing_phone: shiprocketPhone,
        shipping_is_billing: true,
        payment_method: isCOD ? 'COD' : 'Prepaid',
        sub_total: productTotal,
        discount: "0",
        shipping_charges: order_data.delivery_charge ?? 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: "0",
        length: 10,
        breadth: 10,
        height: 8,
        weight: 0.3,
        order_items: order_data.items.map((item: {
          name: string; slug: string; quantity: number;
          price: number; final_price?: number
        }) => {
          const taxConfig = PRODUCT_TAX_CONFIG[item.slug] ?? { gstRate: 18, hsnCode: 33049990 }
          return {
            name: item.name,
            sku: item.slug,
            units: item.quantity,
            selling_price: item.final_price ?? item.price,
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
        .update({
          shiprocket_order_id: shiprocketOrderId,
          awb_code: awbCode,
        })
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
        console.log('[Shiprocket] Failure logged ✓')
      } catch (logErr) {
        console.error('[Shiprocket] Could not log failure:', logErr)
      }
    }

    // 3. WhatsApp (non-critical — ok if it fails)
    try {
      const customerPhone = order_data.shipping_address?.phone || null
      const customerName = order_data.shipping_address?.name || 'Customer'
      if (customerPhone) {
        await sendOrderConfirmation({
          phone: customerPhone,
          name: customerName,
          orderId: order.id,
          total: order_data.total,
          paymentMethod: order_data.payment_method,
        })
        console.log('[WhatsApp] Sent ✓')
      }
    } catch (waErr: any) {
      console.error('[WhatsApp] FAILED:', waErr.message)
    }

    // NOW return response after everything is done
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
