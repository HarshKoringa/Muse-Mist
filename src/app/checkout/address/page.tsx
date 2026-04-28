'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

function AddressForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const method = searchParams.get('method') as 'prepaid' | 'cod'
  const clearCart = useCartStore((state) => state.clearCart)

  const [loading, setLoading] = useState(false)
  const [policyAgreed, setPolicyAgreed] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const required = ['name', 'phone', 'email', 'address', 'city', 'state', 'pincode'] as const
    for (const field of required) {
      if (!form[field].trim()) {
        alert(`Please fill in your ${field}`)
        return
      }
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      alert('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9')
      return
    }

    if (form.pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode')
      return
    }

    setLoading(true)

    try {
      if (method === 'prepaid') {
        const pending = JSON.parse(
          sessionStorage.getItem('pending_payment') || '{}'
        )

        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...pending,
            order_data: {
              ...pending.order_data,
              shipping_address: form,
            },
          }),
        })

        const data = await res.json()
        if (data.error) throw new Error(data.error)

        sessionStorage.removeItem('pending_payment')
        clearCart()
        router.push(`/checkout/success?order_id=${data.order_id}`)

      } else {
        const pending = JSON.parse(
          sessionStorage.getItem('pending_order') || '{}'
        )

        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: null,
            razorpay_payment_id: null,
            razorpay_signature: null,
            order_data: {
              ...pending,
              payment_method: 'cod',
              shipping_address: form,
            },
          }),
        })

        const data = await res.json()
        if (data.error) throw new Error(data.error)

        sessionStorage.removeItem('pending_order')
        clearCart()
        router.push(`/checkout/success?order_id=${data.order_id}`)
      }
    } catch (err) {
      console.error('Address submit error:', err)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const fields: { name: keyof typeof form; label: string; type: string }[] = [
    { name: 'name',    label: 'Full Name',       type: 'text'  },
    { name: 'phone',   label: 'Phone Number',    type: 'tel'   },
    { name: 'email',   label: 'Email Address',   type: 'email' },
    { name: 'address', label: 'Street Address',  type: 'text'  },
    { name: 'city',    label: 'City',            type: 'text'  },
    { name: 'state',   label: 'State',           type: 'text'  },
    { name: 'pincode', label: 'Pincode',         type: 'text'  },
  ]

  return (
    <main className="min-h-screen bg-[#DCEFFF] px-4 pt-20 pb-12">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="cursor-pointer">
            <ArrowLeft size={22} className="text-[#1A237E]" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[#1A237E]">
              Delivery Address
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {method === 'prepaid'
                ? '5% discount applied ✓'
                : 'Cash on Delivery · ₹50 delivery charge'}
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4"
        >
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A237E]">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200
                           text-base text-gray-700 outline-none
                           focus:border-[#1A237E] transition-colors"
                style={{ fontSize: '16px' }}
              />
            </div>
          ))}

          {/* Policy agreement checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={policyAgreed}
              onChange={(e) => setPolicyAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#1A237E] flex-shrink-0 cursor-pointer"
            />
            <span className="text-sm text-gray-500 leading-relaxed">
              I have read and agree to the{' '}
              <Link href="/policies/returns" target="_blank" className="text-[#1A237E] underline underline-offset-2">Return Policy</Link>
              {' '}and{' '}
              <Link href="/policies/refunds" target="_blank" className="text-[#1A237E] underline underline-offset-2">Refund Policy</Link>.
              I understand that returns must be reported within 48 hours of delivery with an unboxing video.
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={loading || !policyAgreed}
            className={`w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 mt-2 transition-opacity ${loading || !policyAgreed ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1A237E] text-white hover:opacity-90 cursor-pointer'}`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Confirming Order...
              </>
            ) : (
              method === 'prepaid'
                ? 'Confirm & Place Order'
                : 'Place COD Order'
            )}
          </button>
        </motion.div>
      </div>
    </main>
  )
}

export default function AddressPage() {
  return (
    <Suspense>
      <AddressForm />
    </Suspense>
  )
}
