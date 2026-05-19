'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const COD_CHARGE = 50

type Props = {
  displayAmount?: number
  totalDiscountPercent?: number
  isEarlyAccess?: boolean
}

export default function CODCheckoutButton({
  displayAmount,
  totalDiscountPercent = 0,
  isEarlyAccess = false,
}: Props = {}) {
  const [loading, setLoading] = useState(false)
  const items = useCartStore((state) => state.items)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Call checkout API to get per-item final prices and discount percent
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, price: i.price, quantity: i.quantity })),
          payment_method: 'cod',
          user_id: user.id,
        }),
      })

      const checkoutRes = await res.json()
      if (!res.ok) throw new Error(checkoutRes.error ?? 'Checkout failed')

      const discountPercent = checkoutRes.total_discount_percent ?? 0
      const multiplier = (100 - discountPercent) / 100

      const itemsForStorage = items.map((i) => ({
        id: i.id,
        name: i.name,
        slug: i.slug,
        price: i.price,
        mrp: i.mrp ?? null,
        quantity: i.quantity,
        category: i.category,
        image_url: i.image_url ?? null,
        stock_count: i.stock_count,
        size: i.size ?? null,
        final_price: Math.round(i.price * multiplier),
      }))

      sessionStorage.setItem('checkout_data', JSON.stringify({
        items: itemsForStorage,
        payment_method: 'cod',
        user_id: user.id,
        subtotal: checkoutRes.subtotal,
        discount: checkoutRes.discount,
        delivery_charge: checkoutRes.delivery_charge,
        total: checkoutRes.total,
        is_early_access: checkoutRes.is_early_access,
        total_discount_percent: checkoutRes.total_discount_percent,
      }))

      router.push('/checkout/address?method=cod')
    } catch (err) {
      console.error('COD checkout error:', err)
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
