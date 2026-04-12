import { getShiprocketToken } from '@/lib/shiprocket'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test 1: Auth
    console.log('[Test] SHIPROCKET_EMAIL:', process.env.SHIPROCKET_EMAIL)
    console.log('[Test] SHIPROCKET_PASSWORD length:', process.env.SHIPROCKET_PASSWORD?.length)

    const token = await getShiprocketToken()
    console.log('[Test] Token obtained:', token.substring(0, 20) + '...')

    // Test 2: Create a test order
    const res = await fetch(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: `MM-TEST-${Date.now()}`,
          order_date: new Date().toISOString().split('T')[0],
          pickup_location: 'Home',
          billing_customer_name: 'Test',
          billing_last_name: 'Customer',
          billing_address: '123 Test Street, MG Road',
          billing_city: 'Bangalore',
          billing_pincode: '560001',
          billing_state: 'Karnataka',
          billing_country: 'India',
          billing_email: 'test@museandmist.in',
          billing_phone: '9000000000',
          shipping_is_billing: true,
          payment_method: 'Prepaid',
          sub_total: 849,
          length: 10,
          breadth: 10,
          height: 8,
          weight: 0.3,
          order_items: [
            {
              name: 'Invisible Glow Shield',
              sku: 'invisible-glow-shield',
              units: 1,
              selling_price: 849,
            },
          ],
        }),
      }
    )

    const data = await res.json()
    console.log('[Test] Shiprocket full response:', JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      token_obtained: true,
      shiprocket_response: data,
    })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[Test] Error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
