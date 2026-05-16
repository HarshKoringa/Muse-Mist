import twilio from 'twilio'

export async function sendWhatsAppMessage({
  phone,
  templateSid,
  variables,
}: {
  phone: string
  templateSid: string
  variables: Record<string, string>
}) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )

  // Normalize phone to 10 digits then add +91
  const digits = phone.replace(/\D/g, '').replace(/^91/, '')
  const toPhone = `whatsapp:+91${digits.slice(-10)}`
  const fromPhone = process.env.TWILIO_WHATSAPP_FROM!

  const message = await client.messages.create({
    from: fromPhone,
    to: toPhone,
    contentSid: templateSid,
    contentVariables: JSON.stringify(variables),
  })

  console.log('[WhatsApp] Message sent:', message.sid, '→', toPhone)
  return message.sid
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
