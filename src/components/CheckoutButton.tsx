'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type Props = {
  paymentMethod: 'prepaid' | 'cod'
  displayAmount?: number
  totalDiscountPercent?: number
  isEarlyAccess?: boolean
}

export default function CheckoutButton({
  paymentMethod,
  displayAmount,
  totalDiscountPercent = 5,
  isEarlyAccess = false,
}: Props) {
  const [loading, setLoading] = useState(false)
  const items = useCartStore((state) => state.items)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          payment_method: paymentMethod,
          user_id: user.id,
        }),
      })

      const checkoutRes = await res.json()
      if (!res.ok) throw new Error(checkoutRes.error ?? 'Checkout failed')

      sessionStorage.setItem('checkout_data', JSON.stringify({
        items: checkoutRes.verified_items,
        payment_method: paymentMethod,
        user_id: user.id,
        subtotal: checkoutRes.subtotal,
        discount: checkoutRes.discount,
        delivery_charge: checkoutRes.delivery_charge,
        total: checkoutRes.total,
        is_early_access: checkoutRes.is_early_access,
        total_discount_percent: checkoutRes.total_discount_percent,
      }))

      router.push(`/checkout/address?method=${paymentMethod}`)
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
      className={`w-full py-4 rounded-xl text-base font-semibold
                  flex items-center justify-center gap-2
                  transition-opacity
                  ${loading || items.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#1A237E] text-white hover:opacity-90 cursor-pointer'
                  }`}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Processing...
        </>
      ) : (
        'Continue to Address →'
      )}
    </button>
  )
}
