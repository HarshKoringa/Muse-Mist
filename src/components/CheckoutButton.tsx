'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { Loader2 } from 'lucide-react'

type Props = {
  paymentMethod: 'prepaid' | 'cod'
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

export default function CheckoutButton({ paymentMethod }: Props) {
  const [loading, setLoading] = useState(false)
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
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

      // Get user profile for prefill (best-effort)
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone_number')
        .eq('id', user.id)
        .maybeSingle()

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
          payment_method: paymentMethod,
          user_id: user.id,
        }),
      })

      const checkoutData = await res.json()
      if (checkoutData.error) throw new Error(checkoutData.error)

      // COD flow — no Razorpay needed
      if (paymentMethod === 'cod') {
        sessionStorage.setItem('pending_order', JSON.stringify({
          ...checkoutData,
          items,
          user_id: user.id,
        }))
        router.push('/checkout/address?method=cod')
        return
      }

      // Prepaid flow — open Razorpay modal
      const options = {
        key: checkoutData.razorpay_key,
        amount: checkoutData.total * 100,
        currency: 'INR',
        name: 'Muse & Mist',
        description: `Order (${items.length} item${items.length > 1 ? 's' : ''})`,
        order_id: checkoutData.razorpay_order_id,
        prefill: {
          name: profile?.full_name || '',
          email: profile?.email || user.email || '',
          contact: profile?.phone_number || '',
        },
        theme: {
          color: '#1A237E',
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          sessionStorage.setItem('pending_payment', JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_data: {
              ...checkoutData,
              items,
              user_id: user.id,
            },
          }))
          router.push('/checkout/address?method=prepaid')
        },
      }

      const razorpay = new window.Razorpay(options)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error)
        alert('Payment failed. Please try again.')
        setLoading(false)
      })
      razorpay.open()

    } catch (err) {
      console.error('Checkout error:', err)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
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
          'Proceed to Checkout'
        )}
      </button>
    </>
  )
}
