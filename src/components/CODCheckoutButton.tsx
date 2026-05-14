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

      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
      const discount = Math.round(subtotal * (totalDiscountPercent / 100))
      // Use the exact total passed from cart (same value, avoids rounding drift)
      const total = displayAmount ?? (subtotal - discount + COD_CHARGE)

      sessionStorage.setItem('checkout_data', JSON.stringify({
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          slug: i.slug,
          price: i.price,
          quantity: i.quantity,
          category: i.category,
          image_url: i.image_url ?? null,
          stock_count: i.stock_count,
        })),
        payment_method: 'cod',
        user_id: user.id,
        subtotal,
        discount,
        delivery_charge: COD_CHARGE,
        total,
        is_early_access: isEarlyAccess,
        total_discount_percent: totalDiscountPercent,
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
