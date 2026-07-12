'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2, Check, Lock } from 'lucide-react'
import Image from 'next/image'
import Script from 'next/script'
import { createClient } from '@/utils/supabase/client'
import { useCartStore } from '@/store/cartStore'
import { getDiscountInfo } from '@/app/actions/getDiscountInfo'
import { trackInitiateCheckout } from '@/lib/pixel'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { Razorpay: any }
}

const COD_CHARGE = 50
const RESEND_COOLDOWN = 30

function AddressForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)

  // ── Cart hydration guard (avoids redirecting on the empty-store flash) ──
  const [hydrated, setHydrated] = useState(() => useCartStore.persist.hasHydrated())
  useEffect(() => {
    if (hydrated) return
    return useCartStore.persist.onFinishHydration(() => setHydrated(true))
  }, [hydrated])

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.push('/')
    }
  }, [hydrated, items.length, router])

  // Fire InitiateCheckout once the address page is actually seen with items in cart
  const firedInitiateCheckout = useRef(false)
  useEffect(() => {
    if (!hydrated || firedInitiateCheckout.current || items.length === 0) return
    firedInitiateCheckout.current = true
    trackInitiateCheckout({
      slugs: items.map((item) => item.slug),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      numItems: items.reduce((sum, item) => sum + item.quantity, 0),
    })
  }, [hydrated, items])

  // ── Payment method ────────────────────────────────────────
  const initialMethod = searchParams.get('method') === 'cod' ? 'cod' : 'prepaid'
  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'cod'>(initialMethod)

  // ── Discount info (display only) ─────────────────────────
  const [prepaidDiscountPercent, setPrepaidDiscountPercent] = useState(5)
  const [earlyAccessPercent, setEarlyAccessPercent] = useState(0)
  const [totalPrepaidPercent, setTotalPrepaidPercent] = useState(5)
  const [codDiscountPercent, setCodDiscountPercent] = useState(0)
  const [isEarlyAccess, setIsEarlyAccess] = useState(false)

  const refreshDiscountInfo = useCallback(() => {
    getDiscountInfo().then((info) => {
      setPrepaidDiscountPercent(info.prepaidDiscountPercent)
      setEarlyAccessPercent(info.earlyAccessPercent)
      setTotalPrepaidPercent(info.totalPrepaidPercent)
      setCodDiscountPercent(info.codDiscountPercent)
      setIsEarlyAccess(info.isEarlyAccess)
    })
  }, [])

  useEffect(() => {
    refreshDiscountInfo()
  }, [refreshDiscountInfo])

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const prepaidDiscount = Math.round(subtotal * (totalPrepaidPercent / 100))
  const prepaidTotal = subtotal - prepaidDiscount
  const codDiscount = Math.round(subtotal * (codDiscountPercent / 100))
  const codTotal = subtotal - codDiscount + (items.length > 0 ? COD_CHARGE : 0)
  const displayTotal = paymentMethod === 'prepaid' ? prepaidTotal : codTotal

  // ── Phone verification ───────────────────────────────────
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [verified, setVerified] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (!otpSent || verified || resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [otpSent, verified, resendCooldown])

  // ── Address form ──────────────────────────────────────────
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pincode, setPincode] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [address, setAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [policyAgreed, setPolicyAgreed] = useState(false)

  const [submitError, setSubmitError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  // Prefill from an existing session (state A)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return

      if (user.phone) {
        const digits = user.phone.replace(/\D/g, '')
        const local = digits.startsWith('91') && digits.length > 10 ? digits.slice(2) : digits
        setPhone(local)
        setVerified(true)
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single()

      if (profile) {
        setName((prev) => prev || profile.full_name || '')
        setEmail((prev) => prev || profile.email || user.email || '')
      }
    })
  }, [])

  const handleSendOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError('Enter a valid 10-digit mobile number')
      return
    }
    setPhoneLoading(true)
    setPhoneError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({ phone: `+91${cleanPhone}` })

    if (error) {
      setPhoneError('Failed to send OTP. Please try again.')
      setPhoneLoading(false)
      return
    }

    setOtpSent(true)
    setResendCooldown(RESEND_COOLDOWN)
    setPhoneLoading(false)
  }

  const handleVerifyOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    setPhoneLoading(true)
    setPhoneError('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${cleanPhone}`,
      token: otp,
      type: 'sms',
    })

    if (error) {
      setPhoneError('Invalid OTP. Please try again.')
      setPhoneLoading(false)
      return
    }

    setVerified(true)
    setPhoneLoading(false)
    refreshDiscountInfo()

    if (data.user) {
      fetch('/api/update-profile-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: data.user.id, phone: `91${cleanPhone}` }),
      }).catch(() => {})
    }
  }

  // ── Pincode auto-fill ─────────────────────────────────────
  const handlePincodeChange = async (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6)
    setPincode(digits)
    if (digits.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${digits}`)
        const data = await res.json()
        if (data[0]?.Status === 'Success') {
          const info = data[0].PostOffice[0]
          setCity(info.District)
          setState(info.State)
        }
      } catch {
        // API failed — let user type manually
      }
    }
  }

  // ── Place order ───────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setSubmitError('')

    if (!verified) {
      setSubmitError('Please verify your phone number')
      return
    }
    if (!name.trim() || !pincode.trim() || !city.trim() || !state.trim() || !address.trim()) {
      setSubmitError('Please fill all required fields')
      return
    }
    if (!/^\d{6}$/.test(pincode)) {
      setSubmitError('Invalid pincode')
      return
    }
    if (!policyAgreed) {
      setSubmitError('Please agree to the return and refund policies to continue.')
      return
    }

    setSubmitLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSubmitError('Authentication error. Please verify your phone again.')
      setSubmitLoading(false)
      return
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10)

    const checkoutRes = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        payment_method: paymentMethod,
        user_id: user.id,
      }),
    })
    const checkoutData = await checkoutRes.json()

    if (!checkoutRes.ok) {
      setSubmitError(checkoutData.error || 'Checkout failed')
      setSubmitLoading(false)
      return
    }

    const shippingAddress = {
      name: name.trim(),
      phone: cleanPhone,
      email: email || '',
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      landmark: landmark?.trim() || '',
    }

    const savePixelData = (orderId: string) => {
      try {
        sessionStorage.setItem('order_result', JSON.stringify({
          order_id: orderId,
          total: checkoutData.total,
          items: (checkoutData.verified_items || []).map((i: { slug: string; quantity: number; final_price: number }) => ({
            slug: i.slug,
            quantity: i.quantity,
            final_price: i.final_price,
          })),
        }))
      } catch {}
    }

    if (paymentMethod === 'cod') {
      const orderRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: null,
          razorpay_payment_id: null,
          razorpay_signature: null,
          order_data: {
            user_id: user.id,
            payment_method: 'cod',
            items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
            shipping_address: shippingAddress,
          },
        }),
      })
      const orderData = await orderRes.json()

      if (orderRes.ok && orderData.success) {
        savePixelData(orderData.order_id)
        clearCart()
        router.push(`/checkout/success?order_id=${orderData.order_id}`)
      } else {
        setSubmitError(orderData.error || 'Order failed')
        setSubmitLoading(false)
      }
      return
    }

    // PREPAID — open Razorpay
    const options = {
      key: checkoutData.razorpay_key,
      amount: checkoutData.total * 100,
      currency: 'INR',
      name: 'Muse & Mist',
      description: 'Skincare Order',
      order_id: checkoutData.razorpay_order_id,
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_data: {
              user_id: user.id,
              payment_method: 'prepaid',
              items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
              shipping_address: shippingAddress,
            },
          }),
        })
        const verifyData = await verifyRes.json()

        if (verifyRes.ok && verifyData.success) {
          savePixelData(verifyData.order_id)
          clearCart()
          router.push(`/checkout/success?order_id=${verifyData.order_id}`)
        } else {
          setSubmitError(verifyData.error || 'Payment verification failed')
          setSubmitLoading(false)
        }
      },
      modal: {
        ondismiss: () => setSubmitLoading(false),
      },
      prefill: {
        name,
        contact: cleanPhone,
        email: email || '',
      },
      theme: { color: '#1A237E' },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', () => {
      setSubmitError('Payment failed. Please try again.')
      setSubmitLoading(false)
    })
    rzp.open()
  }

  if (!hydrated || items.length === 0) return null

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <main className="bg-[#DCEFFF] pb-32 lg:pb-16 lg:min-h-screen">
        {/* Mobile sticky header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 bg-[#DCEFFF]/95 backdrop-blur px-4 py-4 border-b border-black/5 lg:hidden">
          <button onClick={() => router.back()} className="cursor-pointer">
            <ArrowLeft size={22} className="text-[#1A237E]" />
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-semibold text-[#1A237E]">
            Your Order
          </h1>
        </div>

        <div className="max-w-5xl mx-auto px-4 pt-6 lg:pt-28 pb-6 lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 lg:items-start">
          {/* Left column — forms */}
          <div className="space-y-5">
            {/* Order summary — mobile only, top of page */}
            <OrderSummary
              className="lg:hidden"
              items={items}
              subtotal={subtotal}
              paymentMethod={paymentMethod}
              isEarlyAccess={isEarlyAccess}
              earlyAccessPercent={earlyAccessPercent}
              prepaidDiscountPercent={prepaidDiscountPercent}
              codDiscount={codDiscount}
              displayTotal={displayTotal}
            />

            {/* Phone verification */}
            <section className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
              <h2 style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-semibold text-[#1A237E] uppercase tracking-wide">
                Phone Verification
              </h2>

              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'var(--font-body)' }}>
                Mobile Number <span className="text-red-500">*</span>
              </label>

              {verified ? (
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={phone ? `${phone.slice(0, 5)} ${phone.slice(5)}` : ''}
                    disabled
                    style={{ fontSize: '16px', fontFamily: 'var(--font-body)' }}
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-gray-600 cursor-not-allowed border border-gray-200"
                  />
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium whitespace-nowrap">
                    <Check size={16} /> Verified
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <span className="px-3 text-gray-500 text-sm bg-gray-50 border-r border-gray-300 py-3">+91</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter mobile number"
                        style={{ fontSize: '16px', fontFamily: 'var(--font-body)' }}
                        className="flex-1 w-full px-3 py-3 outline-none text-base"
                        disabled={otpSent}
                      />
                    </div>
                    {!otpSent && (
                      <button
                        onClick={handleSendOTP}
                        disabled={phone.length !== 10 || phoneLoading}
                        style={{ fontFamily: 'var(--font-body)' }}
                        className="w-full sm:w-auto px-5 py-3 bg-[#1A237E] text-white rounded-xl text-sm font-medium disabled:opacity-50 whitespace-nowrap cursor-pointer"
                      >
                        {phoneLoading ? 'Sending...' : 'Send OTP'}
                      </button>
                    )}
                  </div>

                  {otpSent && (
                    <>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          style={{ fontSize: '16px', fontFamily: 'var(--font-body)' }}
                          className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-center tracking-widest"
                        />
                        <button
                          onClick={handleVerifyOTP}
                          disabled={otp.length !== 6 || phoneLoading}
                          style={{ fontFamily: 'var(--font-body)' }}
                          className="w-full sm:w-auto px-5 py-3 bg-[#1A237E] text-white rounded-xl text-sm font-medium disabled:opacity-50 whitespace-nowrap cursor-pointer"
                        >
                          {phoneLoading ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => { setOtpSent(false); setOtp(''); setPhoneError('') }}
                          style={{ fontFamily: 'var(--font-body)' }}
                          className="text-sm text-[#1A237E] underline cursor-pointer"
                        >
                          Change number
                        </button>
                        <button
                          onClick={handleSendOTP}
                          disabled={resendCooldown > 0 || phoneLoading}
                          style={{ fontFamily: 'var(--font-body)' }}
                          className="text-sm text-[#1A237E] underline disabled:opacity-40 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                        >
                          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
            </section>

            {/* Delivery address */}
            <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h2 style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-semibold text-[#1A237E] uppercase tracking-wide">
                Delivery Address
              </h2>

              <Field label="Full Name" required value={name} onChange={setName} />

              <div className="grid grid-cols-2 gap-3">
                <Field label="Pincode" required value={pincode} onChange={handlePincodeChange} maxLength={6} inputMode="numeric" />
                <Field label="City" required value={city} onChange={setCity} />
              </div>

              <Field label="State" required value={state} onChange={setState} />
              <Field label="Street Address" required value={address} onChange={setAddress} />
              <Field label="Landmark" value={landmark} onChange={setLandmark} />
              <Field label="Email" value={email} onChange={setEmail} type="email" />
            </section>

            {/* Payment method */}
            <section className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
              <h2 style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-semibold text-[#1A237E] uppercase tracking-wide">
                Payment Method
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentMethod('prepaid')}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'prepaid'
                      ? 'bg-[#1A237E] text-white border-[#1A237E]'
                      : 'bg-white text-[#0D1117] border-[#E5E7EB] hover:border-[#1A237E]'
                  }`}
                >
                  {paymentMethod === 'prepaid' && <Check size={13} />}
                  Prepaid
                </button>
                <button
                  onClick={() => setPaymentMethod('cod')}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'cod'
                      ? 'bg-[#1A237E] text-white border-[#1A237E]'
                      : 'bg-white text-[#0D1117] border-[#E5E7EB] hover:border-[#1A237E]'
                  }`}
                >
                  {paymentMethod === 'cod' && <Check size={13} />}
                  COD
                </button>
              </div>
              {paymentMethod === 'prepaid' ? (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <Check size={11} /> Extra {totalPrepaidPercent}% off + Free shipping
                </p>
              ) : (
                <p className="text-xs text-gray-500">+₹{COD_CHARGE} delivery charge</p>
              )}
            </section>

            {/* Policy checkbox */}
            <label className="flex items-start gap-3 cursor-pointer px-1">
              <input
                type="checkbox"
                checked={policyAgreed}
                onChange={(e) => setPolicyAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#1A237E] flex-shrink-0 cursor-pointer"
              />
              <span className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                I have read and agree to the{' '}
                <a href="/policies/returns" target="_blank" className="text-[#1A237E] underline underline-offset-2 font-medium">
                  Return Policy
                </a>{' '}
                and{' '}
                <a href="/policies/refunds" target="_blank" className="text-[#1A237E] underline underline-offset-2 font-medium">
                  Refund Policy
                </a>.
              </span>
            </label>

            {submitError && (
              <p className="text-sm text-red-500 px-1">{submitError}</p>
            )}

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <PlaceOrderButton loading={submitLoading} onClick={handlePlaceOrder} label={`Place Order — ₹${displayTotal.toLocaleString('en-IN')}`} />
              <SecureBadge />
            </div>
          </div>

          {/* Right column — order summary, desktop only */}
          <div className="hidden lg:block sticky top-28">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              paymentMethod={paymentMethod}
              isEarlyAccess={isEarlyAccess}
              earlyAccessPercent={earlyAccessPercent}
              prepaidDiscountPercent={prepaidDiscountPercent}
              codDiscount={codDiscount}
              displayTotal={displayTotal}
            />
          </div>
        </div>

        {/* Mobile sticky bottom CTA */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-[#E5E7EB] px-4 pt-3 pb-4">
          <PlaceOrderButton loading={submitLoading} onClick={handlePlaceOrder} label={`Place Order — ₹${displayTotal.toLocaleString('en-IN')}`} />
          <SecureBadge />
        </div>
      </main>
    </>
  )
}

function Field({
  label, value, onChange, required, type = 'text', maxLength, inputMode,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: string
  maxLength?: number
  inputMode?: 'numeric' | 'text'
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1A237E]" style={{ fontFamily: 'var(--font-body)' }}>
        {label} {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontSize: '16px', fontFamily: 'var(--font-body)' }}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 outline-none focus:border-[#1A237E] transition-colors"
      />
    </div>
  )
}

function OrderSummary({
  className = '', items, subtotal, paymentMethod, isEarlyAccess, earlyAccessPercent,
  prepaidDiscountPercent, codDiscount, displayTotal,
}: {
  className?: string
  items: { id: string; name: string; size?: string | null; image_url?: string | null; price: number; quantity: number }[]
  subtotal: number
  paymentMethod: 'prepaid' | 'cod'
  isEarlyAccess: boolean
  earlyAccessPercent: number
  prepaidDiscountPercent: number
  codDiscount: number
  displayTotal: number
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 space-y-4 ${className}`}>
      <h2 style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-semibold text-[#1A237E] uppercase tracking-wide">
        Order Summary
      </h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#DCEFFF]">
              {item.image_url && (
                <Image src={item.image_url} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0D1117] truncate" style={{ fontFamily: 'var(--font-body)' }}>
                {item.name}{item.size && <span className="text-gray-400"> · {item.size}</span>} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold text-[#1A237E] whitespace-nowrap" style={{ fontFamily: 'var(--font-body)' }}>
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#E5E7EB]" />

      <div className="space-y-1.5" style={{ fontFamily: 'var(--font-body)' }}>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {paymentMethod === 'prepaid' ? (
          <>
            {isEarlyAccess && earlyAccessPercent > 0 && (
              <div className="flex justify-between text-sm text-purple-600">
                <span>Early Access -{earlyAccessPercent}%</span>
                <span>−₹{Math.round((subtotal * earlyAccessPercent) / 100).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-green-600">
              <span>Prepaid -{prepaidDiscountPercent}%</span>
              <span>−₹{Math.round((subtotal * prepaidDiscountPercent) / 100).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Delivery</span>
              <span className="font-medium">Free</span>
            </div>
          </>
        ) : (
          <>
            {isEarlyAccess && codDiscount > 0 && (
              <div className="flex justify-between text-sm text-purple-600">
                <span>Early Access</span>
                <span>−₹{codDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery (COD)</span>
              <span>+₹{COD_CHARGE}</span>
            </div>
          </>
        )}

        <div className="h-px bg-[#E5E7EB] my-1" />

        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-[#0D1117]">Total</span>
          <span className="text-xl font-bold text-[#1A237E]">₹{displayTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  )
}

function PlaceOrderButton({ loading, onClick, label }: { loading: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
      className={`w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-opacity ${
        loading
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
        label
      )}
    </button>
  )
}

function SecureBadge() {
  return (
    <div className="flex items-center justify-center gap-2 mt-3 bg-[#F0EEFF] rounded-lg py-2 px-3">
      <Lock size={13} className="text-[#1A237E] shrink-0" />
      <span className="text-[11px] text-center leading-tight">
        <strong className="text-[#1A237E]">Secure checkout</strong>
        <span className="text-gray-400"> · </span>
        <span className="text-gray-500">Powered by </span>
        <strong className="text-[#1A237E]">Razorpay</strong>
        <span className="text-gray-500"> &amp; </span>
        <strong className="text-[#1A237E]">Shiprocket</strong>
      </span>
    </div>
  )
}

export default function AddressPage() {
  return (
    <Suspense>
      <AddressForm />
    </Suspense>
  )
}
