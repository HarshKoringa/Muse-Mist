import { createAdminClient } from '@/utils/supabase/admin'
import { createShiprocketOrder, getShiprocketToken } from '@/lib/shiprocket'
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

    // Step 1 — Verify Razorpay signature (prepaid only, skip for COD)
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

    // Step 2 — Save order to Supabase (admin client bypasses RLS)
    const supabase = createAdminClient()

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
        status: 'paid',
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

    // Step 3 — Mark early access discount as used if applicable
    if (order_data.is_early_access) {
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

          await supabase
            .from('muses')
            .update({ discount_used: true })
            .eq('phone', normalizedPhone)
            .eq('discount_used', false)

          console.log('[Order] Early access discount marked as used')
        }
      } catch (e) {
        console.log('[Order] Could not mark discount as used:', e)
      }
    }

    // Step 4 — Create Shiprocket shipment (non-blocking)

    try {
      const token = await getShiprocketToken()

      const nameParts = (order_data.shipping_address.name ?? 'Customer')
        .trim()
        .split(' ')
      const firstName = nameParts[0] ?? 'Customer'
      const lastName = nameParts.slice(1).join(' ') || 'Customer'

      await createShiprocketOrder(token, {
        order_id: `MM-${order.id.slice(0, 8).toUpperCase()}`,
        order_date: new Date().toISOString().split('T')[0],
        pickup_location: 'Home',
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: order_data.shipping_address.address,
        billing_city: order_data.shipping_address.city,
        billing_pincode: order_data.shipping_address.pincode,
        billing_state: order_data.shipping_address.state,
        billing_country: 'India',
        billing_email: order_data.shipping_address.email,
        billing_phone: order_data.shipping_address.phone,
        shipping_is_billing: true,
        payment_method: isCOD ? 'COD' : 'Prepaid',
        sub_total: order_data.total,
        length: 10,
        breadth: 10,
        height: 8,
        weight: 0.3,
        order_items: order_data.items.map((item: {
          name: string; slug: string; quantity: number; price: number
        }) => ({
          name: item.name,
          sku: item.slug,
          units: item.quantity,
          selling_price: item.price,
        })),
      })
    } catch (shipErr) {
      console.error('[Muse & Mist] Shiprocket order creation failed:', shipErr)
    }

    // Step 5 — Decrement stock
    for (const item of order_data.items) {
      await supabase.rpc('decrement_stock', {
        product_id: item.id,
        quantity: item.quantity,
      })
    }

    return NextResponse.json({ success: true, order_id: order.id })
  } catch (err) {
    console.error('[Muse & Mist] /api/verify-payment error:', err)
    return NextResponse.json(
      { error: 'Order confirmation failed' },
      { status: 500 }
    )
  }
}
