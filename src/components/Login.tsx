'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Step = 'phone' | 'otp'

export function Login() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()
  const handleSendOTP = async () => {
    setError('')
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
      })
      if (error) throw error
      setStep('otp')
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setError('')
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otp,
        type: 'sms',
      })
      if (error) throw error
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center px-4">

      {/* Ambient orb */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #DCD9F8, transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-display)' }}
          className="block text-center text-2xl font-light text-white mb-10"
        >
          Muse &amp; Mist
        </Link>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">

            {/* ── PHONE INPUT ── */}
          {step === 'phone' && (
            <div className="flex flex-col gap-5">
              <div className="mb-2">
                <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-light text-white">
                  Your number
                </h1>
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-white/40 font-light">
                  We&apos;ll send a 6-digit OTP
                </p>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center px-4 rounded-2xl bg-white/8 border border-white/10 text-white/60 text-base font-medium shrink-0">
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="9000000000"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => {
                    setError('')
                    setPhone(e.target.value.replace(/\D/g, ''))
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                  style={{ fontSize: '16px', fontFamily: 'var(--font-body)' }}
                  className="flex-1 px-4 py-4 rounded-2xl bg-white/8 border border-white/10 text-white placeholder-white/20 outline-none focus:border-[#DCD9F8]/50 transition-colors"
                />
              </div>

              {error && (
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-xl">
                  {error}
                </p>
              )}

              <button
                onClick={handleSendOTP}
                disabled={loading || phone.length !== 10}
                style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                className="w-full py-4 rounded-2xl bg-[#DCD9F8] text-[#1A237E] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Send OTP <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          )}

          {/* ── OTP VERIFICATION ── */}
          {step === 'otp' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => { setStep('phone'); setError(''); setOtp('') }}
                  className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-light text-white">
                    Enter OTP
                  </h1>
                  <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-white/40 font-light">
                    Sent to +91 {phone}
                  </p>
                </div>
              </div>

              <input
                type="tel"
                placeholder="000000"
                value={otp}
                maxLength={6}
                onChange={(e) => {
                  setError('')
                  setOtp(e.target.value.replace(/\D/g, ''))
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                style={{ fontSize: '16px', fontFamily: 'var(--font-body)' }}
                className="w-full px-4 py-4 rounded-2xl text-center text-2xl tracking-[0.5em] font-semibold bg-white/8 border border-white/10 text-white placeholder-white/20 outline-none focus:border-[#DCD9F8]/50 transition-colors"
              />

              {error && (
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-xl text-center">
                  {error}
                </p>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                className="w-full py-4 rounded-2xl bg-[#DCD9F8] text-[#1A237E] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Verify &amp; Sign In <ArrowRight size={18} /></>
                )}
              </button>

              <button
                onClick={handleSendOTP}
                disabled={loading}
                style={{ fontFamily: 'var(--font-body)' }}
                className="text-sm text-white/30 hover:text-white/60 transition-colors cursor-pointer text-center disabled:opacity-50"
              >
                Didn&apos;t receive it? Resend OTP
              </button>
            </div>
          )}
        </div>

        {/* Back to home */}
        <p
          style={{ fontFamily: 'var(--font-body)' }}
          className="text-center text-sm text-white/20 mt-6"
        >
          <Link href="/" className="hover:text-white/50 transition-colors">
            ← Back to Muse &amp; Mist
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
