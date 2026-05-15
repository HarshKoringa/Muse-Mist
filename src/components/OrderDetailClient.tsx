'use client'

import { motion } from 'framer-motion'
import {
  ArrowLeft, Package, MapPin,
  CreditCard, ExternalLink,
  CheckCircle2, Truck, Home,
  XCircle,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type OrderItem = {
  id: string
  name: string
  slug: string
  price: number
  quantity: number
  category: string
  image_url?: string | null
}

type ShippingAddress = {
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
}

type Order = {
  id: string
  user_id: string
  status: string
  total_amount: number
  payment_method: string
  subtotal: number
  discount: number
  delivery_charge: number
  total: number
  items: OrderItem[]
  shipping_address: ShippingAddress
  shiprocket_order_id: string | null
  awb_code: string | null
  razorpay_order_id: string | null
  created_at: string
}

type Props = { order: Order }

const timelineSteps = [
  {
    key: ['pending', 'paid', 'shipped', 'delivered'],
    icon: CheckCircle2,
    label: 'Order Confirmed',
    subLabel: 'Your order has been placed',
  },
  {
    key: ['shipped', 'delivered'],
    icon: Truck,
    label: 'Shipped',
    subLabel: 'On the way to you',
  },
  {
    key: ['delivered'],
    icon: Home,
    label: 'Delivered',
    subLabel: 'Delivered to your address',
  },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Confirmed', color: 'bg-blue-100 text-blue-700'   },
  paid:      { label: 'Paid',      color: 'bg-green-100 text-green-700' },
  shipped:   { label: 'Shipped',   color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700'    },
  rto:       { label: 'Returned',  color: 'bg-orange-100 text-orange-700' },
}

const gradientMap: Record<string, string> = {
  Sunscreen:   'from-[#DCEFFF] via-[#DCD9F8] to-white',
  Moisturiser: 'from-[#DCD9F8] via-[#DCEFFF] to-white',
  Serum:       'from-[#1A237E] via-[#3949AB] to-[#DCD9F8]',
  'Face Wash': 'from-[#DCEFFF] via-white to-[#DCD9F8]',
}

export default function OrderDetailClient({ order }: Props) {
  const router = useRouter()
  const config = statusConfig[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-700' }

  const discountPct = order.subtotal > 0
    ? Math.round((order.discount / order.subtotal) * 100)
    : 0

  const discountLabel = (() => {
    if (order.discount === 0) return null
    if (order.payment_method === 'cod') {
      return `Early Access Discount (${discountPct}%)`
    }
    if (discountPct > 5) {
      return `Discount Applied (${discountPct}%)`
    }
    return `Prepaid Discount (${discountPct}%)`
  })()
  const date = new Date(order.created_at).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const isCancelledOrRTO = ['cancelled', 'rto'].includes(order.status)

  return (
    <main className="min-h-screen bg-[#DCEFFF] px-4 pt-20 pb-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="cursor-pointer">
            <ArrowLeft size={22} className="text-[#1A237E]" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[#1A237E]">
              Order Details
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              #{order.id.slice(0, 8).toUpperCase()} · {date}
            </p>
          </div>
          <span className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-full ${config.color}`}>
            {config.label}
          </span>
        </div>

        {/* Tracking Timeline */}
        {!isCancelledOrRTO && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1A237E] opacity-40 mb-6">
              Tracking
            </p>

            <div className="flex flex-col gap-0">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = step.key.includes(order.status)
                const isLast = index === timelineSteps.length - 1

                return (
                  <div key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-[#1A237E]' : 'bg-gray-100'}`}>
                        <Icon size={18} className={isCompleted ? 'text-white' : 'text-gray-300'} />
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-[#1A237E] opacity-20' : 'bg-gray-100'}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-base font-semibold ${isCompleted ? 'text-[#1A237E]' : 'text-gray-300'}`}>
                        {step.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-400' : 'text-gray-200'}`}>
                        {step.subLabel}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Shiprocket tracking link */}
            {order.shiprocket_order_id && (
              order.awb_code ? (
                <a
                  href={`https://shiprocket.co/tracking/${order.awb_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between mt-4 p-4
                             rounded-xl bg-[#DCEFFF] border border-[#DCD9F8]
                             hover:bg-[#DCD9F8] transition-colors group"
                >
                  <div>
                    <p className="text-base font-semibold text-[#1A237E]">
                      Track on Shiprocket
                    </p>
                    <p className="text-xs text-gray-400">
                      AWB: {order.awb_code}
                    </p>
                  </div>
                  <ExternalLink size={18} className="text-[#1A237E] opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              ) : (
                <div className="flex items-center justify-between mt-4 p-4
                               rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-base font-semibold text-gray-400">
                      Tracking coming soon
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      AWB will be assigned once the shipment is picked up
                    </p>
                  </div>
                  <Truck size={18} className="text-gray-300 flex-shrink-0" />
                </div>
              )
            )}
          </motion.div>
        )}

        {/* Cancelled / RTO state */}
        {isCancelledOrRTO && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 rounded-2xl p-6 border border-red-100 flex items-center gap-4"
          >
            <XCircle size={32} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="text-base font-semibold text-red-500">
                {order.status === 'rto' ? 'Order Returned' : 'Order Cancelled'}
              </p>
              <p className="text-sm text-red-400 mt-0.5">
                {order.status === 'rto'
                  ? 'This order was returned to origin. Refund will be processed within 5–7 days.'
                  : 'This order was cancelled. Refund will be processed within 5–7 days.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1A237E] opacity-40 mb-4">
            Items Ordered
          </p>

          <div className="flex flex-col gap-4">
            {order.items?.map((item) => {
              const gradient = gradientMap[item.category] ?? 'from-[#DCD9F8] to-[#DCEFFF]'
              return (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#DCEFFF]">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-end p-1.5`}>
                        <span className="text-[7px] font-bold tracking-widest uppercase text-[#1A237E] opacity-30">
                          M&amp;M
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
                      {item.category}
                    </p>
                    <p className="text-base font-semibold text-[#1A237E]">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-base font-bold text-[#1A237E]">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Price Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1A237E] opacity-40 mb-4">
            Price Breakdown
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-base text-gray-500">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>

            {order.discount > 0 && discountLabel && (
              <div className="flex justify-between text-base text-green-600">
                <span style={{ fontFamily: 'var(--font-body)' }}>
                  {discountLabel}
                </span>
                <span>−₹{order.discount}</span>
              </div>
            )}

            <div className="flex justify-between text-base text-gray-500">
              <span>Delivery</span>
              <span>
                {order.delivery_charge === 0
                  ? <span className="text-green-500">Free</span>
                  : `₹${order.delivery_charge}`}
              </span>
            </div>

            <div className="flex justify-between text-lg font-bold text-[#1A237E] pt-3 mt-1 border-t border-gray-100">
              <span>
                {order.payment_method === 'cod'
                  ? 'Amount to Pay on Delivery'
                  : 'Total Paid'}
              </span>
              <span>₹{order.total}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <CreditCard size={14} className="text-gray-400" />
              <p className="text-xs text-gray-400">
                {order.payment_method === 'cod'
                  ? '📦 Cash on Delivery'
                  : '✓ Paid Online'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1A237E] opacity-40 mb-4">
            Delivery Address
          </p>

          <div className="flex gap-3">
            <MapPin size={18} className="text-[#1A237E] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-semibold text-[#1A237E]">
                {order.shipping_address?.name}
              </p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {order.shipping_address?.address},{' '}
                {order.shipping_address?.city},{' '}
                {order.shipping_address?.state} —{' '}
                {order.shipping_address?.pincode}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                📞 {order.shipping_address?.phone}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to shopping */}
        <Link
          href="/#products"
          className="w-full py-4 rounded-2xl bg-[#1A237E] text-white text-base font-semibold text-center hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>

      </div>
    </main>
  )
}
