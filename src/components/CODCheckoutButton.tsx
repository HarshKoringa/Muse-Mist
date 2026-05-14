'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type Props = {
  displayAmount?: number
}

export default function CODCheckoutButton({ displayAmount }: Props = {}) {
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
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            slug: i.slug,
            price: i.price,
            quantity: i.quantity,
          })),
          payment_method: 'cod',
          user_id: user.id,
        }),
      })

      const checkoutData = await res.json()
      if (checkoutData.error) throw new Error(checkoutData.error)

      sessionStorage.setItem('pending_order', JSON.stringify({
        ...checkoutData,
        items,
        user_id: user.id,
      }))
      router.push('/checkout/address?method=cod')

    } catch (err) {
      console.error('COD checkout error:', err)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      className={`w-full py-4 rounded-xl text-base font-semibold
                  flex items-center justify-center gap-2
                  transition-all border-2
                  ${loading || items.length === 0
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-white'
                    : 'border-[#1A237E] text-[#1A237E] bg-white hover:bg-[#1A237E] hover:text-white cursor-pointer'
                  }`}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Processing...
        </>
      ) : (
        displayAmount != null
          ? `Place COD Order · ₹${displayAmount.toLocaleString('en-IN')}`
          : 'Place COD Order'
      )}
    </button>
  )
}
