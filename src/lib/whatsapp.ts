export async function sendWhatsAppMessage({
  phone,
  templateSid,
  variables,
}: {
  phone: string
  templateSid: string
  variables: Record<string, string>
}) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromPhone = process.env.TWILIO_WHATSAPP_FROM

  if (!accountSid || !authToken || !fromPhone) {
    throw new Error(`Missing Twilio credentials: sid=${!!accountSid} token=${!!authToken} from=${!!fromPhone}`)
  }

  const digits = phone.replace(/\D/g, '').replace(/^91/, '')
  const toPhone = `whatsapp:+91${digits.slice(-10)}`

  console.log('[WhatsApp] Attempting:', {
    to: toPhone,
    from: fromPhone,
    templateSid,
    hasSid: true,
    hasToken: true,
  })

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`

  const body = new URLSearchParams({
    From: fromPhone,
    To: toPhone,
    ContentSid: templateSid,
    ContentVariables: JSON.stringify(variables),
  })

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(`Twilio API error: ${data.message || data.code || res.status}`)
  }

  console.log('[WhatsApp] Message sent:', data.sid, '→', toPhone)
  return data.sid
}

export async function sendOrderConfirmation({
  phone,
  name,
  orderId,
  total,
  paymentMethod,
}: {
  phone: string
  name: string
  orderId: string
  total: number
  paymentMethod: 'prepaid' | 'cod'
}) {
  const shortOrderId = `MM-${orderId.slice(0, 8).toUpperCase()}`
  const firstName = name.trim().split(' ')[0] || 'there'

  if (paymentMethod === 'cod') {
    // COD template
    return sendWhatsAppMessage({
      phone,
      templateSid: process.env.TWILIO_WHATSAPP_TEMPLATE_COD!,
      variables: {
        '1': firstName,
        '2': shortOrderId,
        '3': total.toLocaleString('en-IN'),
      },
    })
  } else {
    // Prepaid template
    return sendWhatsAppMessage({
      phone,
      templateSid: process.env.TWILIO_WHATSAPP_TEMPLATE_CONFIRMED!,
      variables: {
        '1': firstName,
        '2': shortOrderId,
        '3': total.toLocaleString('en-IN'),
        '4': 'Paid Online',
      },
    })
  }
}

export async function sendOrderShipped({
  phone,
  name,
  orderId,
  trackingUrl,
}: {
  phone: string
  name: string
  orderId: string
  trackingUrl: string
}) {
  const shortOrderId = `MM-${orderId.slice(0, 8).toUpperCase()}`
  const firstName = name.trim().split(' ')[0] || 'there'

  return sendWhatsAppMessage({
    phone,
    templateSid: process.env.TWILIO_WHATSAPP_TEMPLATE_SHIPPED!,
    variables: {
      '1': firstName,
      '2': shortOrderId,
      '3': trackingUrl,
    },
  })
}
