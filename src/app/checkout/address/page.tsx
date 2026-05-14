'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useCartStore } from '@/store/cartStore'
import Script from 'next/script'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { Razorpay: any }
}

function AddressForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const method = searchParams.get('method') as 'prepaid' | 'cod'
  const clearCart = useCartStore((state) => state.clearCart)

  const [loading, setLoading] = useState(false)
  const [policyAgreed, setPolicyAgreed] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [orderSummary, setOrderSummary] = useState<{
    subtotal: number
    discount: number
    delivery: number
    total: number
  } | null>(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  useEffect(() => {
    const raw = sessionStorage.getItem('checkout_data')
    if (!raw) {
      router.push('/cart')
      return
    }
    const parsed = JSON.parse(raw)
    setCheckoutData(parsed)

    // Compute display-only order summary (server recalculates accurately)
    const subtotal: number = parsed.items.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s: number, i: any) => s + i.price * i.quantity,
      0
    )
    const discount = parsed.payment_method === 'prepaid'
      ? Math.round(subtotal * 0.05)
      : 0
    const delivery = parsed.payment_method === 'cod' ? 50 : 0
    setOrderSummary({ subtotal, discount, delivery, total: subtotal - discount + delivery })

    // Prefill name/email/phone from profile
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('profiles')
        .select('full_name, email, phone_number')
        .eq('id', user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile) {
            const phone = (profile.phone_number || '')
              .replace(/\D/g, '')
              .replace(/^91/, '')
            setForm(prev => ({
              ...prev,
              name: profile.full_name || '',
              email: profile.email || user.email || '',
              phone,
            }))
          }
        })
    })
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = (): boolean => {
    const required = ['name', 'phone', 'address', 'city', 'state', 'pincode'] as const
    for (const field of required) {
      if (!form[field].trim()) {
        alert(`Please fill in your ${field}`)
        return false
      }
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      alert('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9')
      return false
    }
    if (form.pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode')
      return false
    }
    if (!policyAgreed) {
      alert('Please agree to the return and refund policies to continue.')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm() || !checkoutData) return
    setLoading(true)

    try {
      // Call /api/checkout to get pricing + create Razorpay order if prepaid
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: checkoutData.items,
          payment_method: checkoutData.payment_method,
          user_id: checkoutData.user_id,
        }),
      })
      const checkoutRes = await res.json()
      if (checkoutRes.error) throw new Error(checkoutRes.error)

      if (checkoutData.payment_method === 'cod') {
        // COD — verify directly, no Razorpay
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: null,
            razorpay_payment_id: null,
            razorpay_signature: null,
            order_data: {
              ...checkoutRes,
              items: checkoutData.items,
              user_id: checkoutData.user_id,
              shipping_address: form,
            },
          }),
        })
        const verifyData = await verifyRes.json()
        if (verifyData.error) throw new Error(verifyData.error)

        sessionStorage.removeItem('checkout_data')
        clearCart()
        router.push(`/checkout/success?order_id=${verifyData.order_id}`)
        return
      }

      // PREPAID — open Razorpay now that address is collected
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const options = {
        key: checkoutRes.razorpay_key,
        amount: checkoutRes.total * 100,
        currency: 'INR',
        name: 'Muse & Mist',
        description: `${checkoutData.items.length} item${checkoutData.items.length > 1 ? 's' : ''}`,
        order_id: checkoutRes.razorpay_order_id,
        prefill: {
          name: form.name,
          email: form.email || user?.email || '',
          contact: '+91' + form.phone,
        },
        theme: { color: '#1A237E' },
        modal: {
          ondismiss: () => setLoading(false),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_data: {
                ...checkoutRes,
                items: checkoutData.items,
                user_id: checkoutData.user_id,
                shipping_address: form,
              },
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.error) {
            alert('Order confirmation failed. Please contact support.')
            return
          }
          sessionStorage.removeItem('checkout_data')
          clearCart()
          router.push(`/checkout/success?order_id=${verifyData.order_id}`)
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', () => {
        alert('Payment failed. Please try again.')
        setLoading(false)
      })
      razorpay.open()

    } catch (err) {
      console.error('Address submit error:', err)
      alert(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const fields: { name: keyof typeof form; label: string; type: string; required: boolean }[] = [
    { name: 'name',    label: 'Full Name',       type: 'text',  required: true  },
    { name: 'phone',   label: 'Mobile Number',   type: 'tel',   required: true  },
    { name: 'email',   label: 'Email Address',   type: 'email', required: false },
    { name: 'address', label: 'Street Address',  type: 'text',  required: true  },
    { name: 'city',    label: 'City',            type: 'text',  required: true  },
    { name: 'state',   label: 'State',           type: 'text',  required: true  },
    { name: 'pincode', label: 'Pincode',         type: 'text',  required: true  },
  ]

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <main className="min-h-screen bg-[#DCEFFF] px-4 pt-24 pb-12">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => router.back()} className="cursor-pointer">
              <ArrowLeft size={22} className="text-[#1A237E]" />
            </button>
            <div>
              <h1
                className="text-2xl font-semibold text-[#1A237E]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Delivery Address
              </h1>
              <p
                className="text-sm text-gray-400 mt-0.5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {method === 'prepaid'
                  ? 'Payment will open after address confirmation'
                  : 'Cash on Delivery · ₹50 delivery charge'}
              </p>
            </div>
          </div>

          {/* Order summary mini card */}
          {orderSummary && (
            <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Order Total
                  </p>
                  {orderSummary.discount > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-0.5">
                      You save ₹{orderSummary.discount.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl font-bold text-[#1A237E]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    ₹{orderSummary.total.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-gray-400">Incl. of all taxes</p>
                </div>
              </div>
            </div>
          )}

          {/* Address form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4"
          >
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium text-[#1A237E]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  style={{ fontSize: '16px', fontFamily: 'var(--font-body)' }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200
                             text-gray-700 outline-none
                             focus:border-[#1A237E] transition-colors"
                />
              </div>
            ))}

            {/* Policy checkbox */}
            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={policyAgreed}
                onChange={(e) => setPolicyAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#1A237E] flex-shrink-0 cursor-pointer"
              />
              <span
                className="text-sm text-gray-500 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                I have read and agree to the{' '}
                <a href="/policies/returns" target="_blank"
                   className="text-[#1A237E] underline underline-offset-2 font-medium">
                  Return Policy
                </a>
                {' '}and{' '}
                <a href="/policies/refunds" target="_blank"
                   className="text-[#1A237E] underline underline-offset-2 font-medium">
                  Refund Policy
                </a>.
                {' '}Returns must be reported within 48 hours of delivery with an unboxing video.
              </span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading || !policyAgreed}
              style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
              className={`w-full py-4 rounded-xl text-base font-semibold
                          flex items-center justify-center gap-2 mt-2
                          transition-opacity
                          ${loading || !policyAgreed
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#1A237E] text-white hover:opacity-90 cursor-pointer'
                          }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {method === 'prepaid' ? 'Opening payment...' : 'Placing order...'}
                </>
              ) : (
                method === 'prepaid'
                  ? 'Continue to Payment →'
                  : 'Place COD Order'
              )}
            </button>
          </motion.div>
        </div>
      </main>
    </>
  )
}

export default function AddressPage() {
  return (
    <Suspense>
      <AddressForm />
    </Suspense>
  )
}
