'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, CheckCircle2, Loader2 } from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  productName?: string
}

export default function EarlyAccessModal({ isOpen, onClose, productName }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [form, setForm] = useState({ name: '', phone: '' })
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')

    if (!form.name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
        }),
      })

      const data = await res.json()

      if (data.error) {
        if (data.code === 'already_registered') {
          setError("This number is already registered! You're on the list 🎉")
        } else {
          setError(data.error)
        }
        setLoading(false)
        return
      }

      setDiscountCode(data.discount_code)
      setStep('success')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep('form')
    setForm({ name: '', phone: '' })
    setError('')
    onClose()
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              {step === 'form' ? (
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={16} className="text-[#1A237E]" />
                        <p className="text-xs font-semibold tracking-widest uppercase text-[#1A237E] opacity-50">
                          Early Access
                        </p>
                      </div>
                      <h2 className="text-2xl font-semibold text-[#1A237E]">
                        Get 30% Off
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        {productName ? `Register to buy ${productName} at launch` : 'Be first. Pay less. Always.'}
                      </p>
                    </div>
                    <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer flex-shrink-0">
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Offer badge */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1A237E] to-[#3949AB] mb-6">
                    <p className="text-white text-base font-semibold">
                      🎉 30% off your first order
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      Discount auto-applies when we launch. No code needed.
                    </p>
                  </div>

                  {/* Form */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#1A237E] block mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Harsh Koringa"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={{ fontSize: '16px' }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 outline-none focus:border-[#1A237E] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#1A237E] block mb-1.5">
                        Mobile Number
                        <span className="text-red-400 ml-1">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 font-medium">
                          🇮🇳 +91
                        </div>
                        <input
                          type="tel"
                          placeholder="9000000000"
                          value={form.phone}
                          maxLength={10}
                          onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                          style={{ fontSize: '16px' }}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 outline-none focus:border-[#1A237E] transition-colors"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Required · Used to apply your discount at launch
                      </p>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">
                        {error}
                      </p>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`w-full py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-opacity ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1A237E] text-white hover:opacity-90 cursor-pointer'}`}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Securing your spot...
                        </>
                      ) : (
                        'Secure My 30% Off →'
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      No spam. Just your launch discount.
                    </p>
                  </div>
                </div>
              ) : (
                /* Success state */
                <div className="p-8 flex flex-col items-center text-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  >
                    <CheckCircle2 size={64} className="text-green-500" />
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-semibold text-[#1A237E] mb-2">
                      You&apos;re a Muse! 🎉
                    </h2>
                    <p className="text-base text-gray-500 leading-relaxed">
                      Welcome to the inner circle, {form.name.split(' ')[0]}.
                      Your 30% discount is locked in.
                    </p>
                  </div>

                  <div className="w-full p-5 rounded-2xl bg-gradient-to-br from-[#DCEFFF] to-[#DCD9F8] border border-[#DCD9F8]">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#1A237E] opacity-50 mb-1">
                      Your Discount Code
                    </p>
                    <p className="text-2xl font-bold text-[#1A237E] tracking-widest font-mono">
                      {discountCode}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      This auto-applies at checkout when we launch.
                      We&apos;ll WhatsApp you when we&apos;re live.
                    </p>
                  </div>

                  <div className="w-full p-4 rounded-xl bg-gray-50 text-left">
                    <p className="text-sm font-medium text-[#1A237E] mb-1">
                      What happens next?
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      When Muse &amp; Mist goes live, log in with this same phone number.
                      Your 30% discount will automatically apply on your first order.
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-4 rounded-2xl bg-[#1A237E] text-white text-base font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
