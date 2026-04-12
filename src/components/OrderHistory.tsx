'use client'

import { motion } from 'framer-motion'
import { Package, ChevronRight } from 'lucide-react'
import Link from 'next/link'

type OrderSummary = {
  id: string
  status: string
  total: number
  payment_method: string
  created_at: string
  items: { name: string; quantity: number; price: number }[]
}

type Props = { orders: OrderSummary[] }

const statusConfig: Record<string, {
  label: string
  color: string
  bg: string
}> = {
  pending:   { label: 'Pending',   color: 'text-amber-600',  bg: 'bg-amber-100' },
  paid:      { label: 'Confirmed', color: 'text-blue-600',   bg: 'bg-blue-100' },
  shipped:   { label: 'Shipped',   color: 'text-purple-600', bg: 'bg-purple-100' },
  delivered: { label: 'Delivered', color: 'text-green-600',  bg: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-500',    bg: 'bg-red-100' },
  rto:       { label: 'Returned',  color: 'text-red-500',    bg: 'bg-red-100' },
}

export default function OrderHistory({ orders }: Props) {
  return (
    <div className="w-full mt-6">
      <h2 className="text-lg font-semibold text-[#1A237E] mb-4 text-center sm:text-left">
        Order History
      </h2>

      <div className="flex flex-col gap-3">
        {orders.map((order, index) => {
          const config = statusConfig[order.status] ?? statusConfig.pending
          const date = new Date(order.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
          const firstItem = order.items?.[0]
          const extraCount = (order.items?.length ?? 1) - 1

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <Link href={`/orders/${order.id}`}>
                <div className="flex items-center justify-between
                                p-4 bg-white rounded-2xl border
                                border-gray-100 shadow-sm
                                hover:border-[#DCD9F8]
                                hover:shadow-md transition-all group">
                  {/* Left — icon + details */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#DCEFFF] flex items-center justify-center flex-shrink-0">
                      <Package size={22} className="text-[#1A237E]" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#1A237E]">
                        {firstItem?.name ?? 'Order'}
                        {extraCount > 0 && (
                          <span className="text-xs text-gray-400 font-normal ml-1">
                            +{extraCount} more
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {date} · ₹{order.total} ·{' '}
                        <span className="capitalize">{order.payment_method}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right — status + arrow */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 group-hover:text-[#1A237E] transition-colors"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
