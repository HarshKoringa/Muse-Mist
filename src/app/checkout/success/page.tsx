'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackPurchase } from '@/lib/pixel'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  useEffect(() => {
    const raw = sessionStorage.getItem('pixel_purchase_data')
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      trackPurchase({
        orderId: data.order_id || orderId || 'unknown',
        total: data.total,
        items: data.items || [],
      })
    } catch {}
    sessionStorage.removeItem('pixel_purchase_data')
  }, [orderId])

  return (
    <main className="min-h-screen bg-[#DCEFFF] flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-lg
                   p-10 flex flex-col items-center gap-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle2 size={72} className="text-green-500" />
        </motion.div>

        <div>
          <h1 className="text-2xl font-semibold text-[#1A237E] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            Your Muse &amp; Mist order is confirmed and being
            prepared for dispatch from Jamnagar.
          </p>
          {orderId && (
            <p className="text-xs text-gray-400 mt-3 font-mono">
              Order ID: {orderId.slice(0, 8).toUpperCase()}
            </p>
          )}
        </div>

        <div className="w-full p-4 rounded-xl bg-[#DCEFFF] border border-[#DCD9F8] text-left">
          <p className="text-sm text-[#1A237E] font-medium mb-1">
            What happens next?
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            You&apos;ll receive a tracking link via WhatsApp/email
            once your order is picked up by our courier partner.
            Expected delivery: 4–6 business days.
          </p>
        </div>

        <div className="w-full p-4 rounded-xl bg-amber-50 border border-amber-200 text-left flex gap-3">
          <Clock size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium mb-1">
              48-hour return window
            </p>
            <p className="text-sm text-amber-700 leading-relaxed">
              If your order arrives damaged or incorrect, report it within 48 hours of delivery with an unboxing video.{' '}
              <Link href="/policies/returns" className="underline underline-offset-2 font-medium">
                View Policy →
              </Link>
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
          <Link
            href="/"
            className="w-full py-4 rounded-xl bg-[#1A237E] text-white
                       text-base font-semibold text-center
                       hover:opacity-90 transition-opacity
                       flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/profile"
            className="w-full py-4 rounded-xl border-2 border-[#1A237E]
                       text-[#1A237E] text-base font-semibold text-center
                       hover:bg-[#1A237E] hover:text-white transition-all"
          >
            View My Orders
          </Link>
        </div>
      </motion.div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
