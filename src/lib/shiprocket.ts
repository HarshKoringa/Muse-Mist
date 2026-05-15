const SHIPROCKET_BASE = 'https://apiv2.shiprocket.in/v1/external'

// Get fresh auth token — tokens expire every 24hrs
export async function getShiprocketToken(): Promise<string> {
  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })
  const data = await res.json()
  if (!data.token) throw new Error('Shiprocket auth failed')
  return data.token
}

export async function createShiprocketOrder(payload: {
  order_id: string
  order_date: string
  pickup_location: string
  billing_customer_name: string
  billing_last_name: string
  billing_address: string
  billing_city: string
  billing_pincode: string
  billing_state: string
  billing_country: string
  billing_email: string
  billing_phone: string
  shipping_is_billing: boolean
  payment_method: 'Prepaid' | 'COD'
  sub_total: number
  length: number
  breadth: number
  height: number
  weight: number
  order_items: {
    name: string
    sku: string
    units: number
    selling_price: number
  }[]
}): Promise<number> {
  const token = await getShiprocketToken()

  const res = await fetch(`${SHIPROCKET_BASE}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  console.log('[Shiprocket] Raw response:', JSON.stringify(data))

  if (data.errors || !data.order_id) {
    throw new Error(
      `Shiprocket order failed: ${JSON.stringify(data.errors || data)}`
    )
  }

  return data.order_id
}
