'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Step = 'method' | 'phone' | 'otp'

export function Login() {
  const [step, setStep] = useState<Step>('method')
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

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) {
      setError(error.message || 'Failed to sign in with Google')
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

          {/* ── METHOD SELECTION ── */}
          {step === 'method' && (
            <div className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <h1
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-3xl font-light text-white mb-1"
                >
                  Sign in
                </h1>
                <p
                  style={{ fontFamily: 'var(--font-body)' }}
                  className="text-sm text-white/40 font-light"
                >
                  Choose how you&apos;d like to continue
                </p>
              </div>

              {/* Phone OTP button */}
              <button
                onClick={() => setStep('phone')}
                style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#1A237E] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <span>Continue with Mobile</span>
                <ArrowRight size={18} className="ml-auto opacity-50" />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-white/30">
                  or
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Google button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/8 border border-white/10 text-white font-medium hover:bg-white/12 transition-colors cursor-pointer disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span>Continue with Google</span>
                <ArrowRight size={18} className="ml-auto opacity-50" />
              </button>

              {error && (
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-xl text-center">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* ── PHONE INPUT ── */}
          {step === 'phone' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => { setStep('method'); setError('') }}
                  className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-light text-white">
                    Your number
                  </h1>
                  <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-white/40 font-light">
                    We&apos;ll send a 6-digit OTP
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center px-4 rounded-2xl bg-white/8 border border-white/10 text-white/60 text-base font-medium shrink-0">
                  🇮🇳 +91
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
