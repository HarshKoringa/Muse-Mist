export const FB_PIXEL_ID = '994809809938471'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fbq = (...args: any[]) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args)
  }
}

export const trackPageView = () => {
  fbq('track', 'PageView')
}

export const trackViewContent = (product: {
  name: string
  slug: string
  price: number
  category?: string
}) => {
  fbq('track', 'ViewContent', {
    content_name: product.name,
    content_ids: [product.slug],
    content_type: 'product',
    value: product.price,
    currency: 'INR',
  })
}

export const trackAddToCart = (product: {
  name: string
  slug: string
  price: number
  quantity: number
}) => {
  fbq('track', 'AddToCart', {
    content_name: product.name,
    content_ids: [product.slug],
    content_type: 'product',
    value: product.price * product.quantity,
    currency: 'INR',
  })
}

export const trackInitiateCheckout = (items: {
  slugs: string[]
  total: number
  numItems: number
}) => {
  fbq('track', 'InitiateCheckout', {
    content_ids: items.slugs,
    content_type: 'product',
    value: items.total,
    currency: 'INR',
    num_items: items.numItems,
  })
}

export const trackPurchase = (order: {
  orderId: string
  total: number
  items: { slug: string; quantity: number; price: number }[]
}) => {
  fbq('track', 'Purchase', {
    content_ids: order.items.map(i => i.slug),
    content_type: 'product',
    value: order.total,
    currency: 'INR',
    num_items: order.items.reduce((sum, i) => sum + i.quantity, 0),
    order_id: order.orderId,
  })
}
