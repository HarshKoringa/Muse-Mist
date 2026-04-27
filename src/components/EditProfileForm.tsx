'use client'

import { useState } from 'react'
import { Loader2, Check, Pencil, X } from 'lucide-react'
import { updateProfile } from '@/app/actions/updateProfile'
import { formatPhone } from '@/utils/formatPhone'

type Profile = {
  id: string
  full_name: string | null
  email: string | null
  phone_number: string | null
  avatar_url: string | null
}

type Props = {
  profile: Profile
  userEmail?: string | null
  userPhone?: string | null
}


export default function EditProfileForm({ profile, userEmail, userPhone }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    email: profile.email ?? userEmail ?? '',
  })
  // Local display state — updates immediately on save without waiting for server re-render
  const [displayName, setDisplayName] = useState(profile.full_name ?? '')
  const [displayEmail, setDisplayEmail] = useState(profile.email ?? userEmail ?? '')

  const handleSave = async () => {
    setError('')

    if (!form.full_name.trim()) {
      setError('Please enter your name')
      return
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      await updateProfile({
        full_name: form.full_name,
        email: form.email,
      })

      // Update local display state immediately
      setDisplayName(form.full_name.trim())
      setDisplayEmail(form.email.trim())

      setSuccess(true)
      setIsEditing(false)
      setTimeout(() => {
        setSuccess(false)
        window.location.href = '/profile'
      }, 800)
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setForm({
      full_name: profile.full_name ?? '',
      email: profile.email ?? userEmail ?? '',
    })
    setError('')
    setIsEditing(false)
  }

  const isPhoneUser = !profile.email && !userEmail
  const rawPhone = profile.phone_number || userPhone || ''

  return (
    <div className="w-full mt-6">

      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-base font-semibold text-[#1A237E]">
          Profile Details
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{ fontFamily: 'var(--font-body)' }}
            className="flex items-center gap-1.5 text-sm text-[#1A237E]/50 hover:text-[#1A237E] transition-colors cursor-pointer"
          >
            <Pencil size={14} />
            Edit
          </button>
        )}
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl mb-4">
          <Check size={16} />
          <span style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-medium">
            Profile updated successfully!
          </span>
        </div>
      )}

      {/* ── VIEW MODE ── */}
      {!isEditing && (
        <div className="flex flex-col gap-3">

          {/* Name */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#DCEFFF]/50 border border-[#DCD9F8]">
            <div>
              <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-[#1A237E]/40 uppercase tracking-widest mb-0.5">
                Full Name
              </p>
              <p style={{ fontFamily: 'var(--font-body)' }} className="text-base font-medium text-[#1A237E]">
                {displayName || (
                  <span className="text-[#1A237E]/30 font-normal italic">Not set</span>
                )}
              </p>
            </div>
            {!displayName && (
              <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-medium">
                Add name
              </span>
            )}
          </div>

          {/* Email */}
          <div className="p-4 rounded-2xl bg-[#DCEFFF]/50 border border-[#DCD9F8]">
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-[#1A237E]/40 uppercase tracking-widest mb-0.5">
              Email
            </p>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-base font-medium text-[#1A237E]">
              {displayEmail || (
                <span className="text-[#1A237E]/30 font-normal italic">Not set</span>
              )}
            </p>
          </div>

          {/* Phone */}
          {rawPhone && (
            <div className="p-4 rounded-2xl bg-[#DCEFFF]/50 border border-[#DCD9F8]">
              <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-[#1A237E]/40 uppercase tracking-widest mb-0.5">
                Mobile Number
              </p>
              <p style={{ fontFamily: 'var(--font-body)' }} className="text-base font-medium text-[#1A237E]">
                {formatPhone(rawPhone)}
              </p>
            </div>
          )}

          {/* Prompt for phone users with no name */}
          {isPhoneUser && !displayName && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <span className="text-lg shrink-0">👋</span>
              <div>
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-semibold text-amber-700 mb-0.5">
                  Complete your profile
                </p>
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-amber-600 leading-relaxed">
                  Add your name so we can personalise your Muse &amp; Mist experience.
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                  className="mt-2 text-sm font-semibold text-amber-700 underline underline-offset-2 cursor-pointer"
                >
                  Add details →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── EDIT MODE ── */}
      {isEditing && (
        <div className="flex flex-col gap-4">

          {/* Name */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-medium text-[#1A237E] block mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.full_name}
              onChange={(e) => { setError(''); setForm({ ...form, full_name: e.target.value }) }}
              style={{ fontSize: '16px', fontFamily: 'var(--font-body)' }}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#DCD9F8] text-[#1A237E] outline-none focus:border-[#1A237E] transition-colors bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-medium text-[#1A237E] block mb-1.5">
              Email Address
              <span style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-[#1A237E]/40 font-normal ml-2">(optional)</span>
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={form.email}
              onChange={(e) => { setError(''); setForm({ ...form, email: e.target.value }) }}
              style={{ fontSize: '16px', fontFamily: 'var(--font-body)' }}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#DCD9F8] text-[#1A237E] outline-none focus:border-[#1A237E] transition-colors bg-white"
            />
          </div>

          {/* Phone — read only */}
          {rawPhone && (
            <div>
              <label style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-medium text-[#1A237E]/50 block mb-1.5">
                Mobile Number
                <span className="text-xs font-normal ml-2">(cannot be changed)</span>
              </label>
              <div
                style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-[#1A237E]/40 bg-gray-50 cursor-not-allowed"
              >
                {formatPhone(rawPhone)}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
              className="flex-1 py-3 rounded-xl bg-[#1A237E] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
              className="px-5 py-3 rounded-xl border-2 border-[#DCD9F8] text-[#1A237E] font-medium hover:bg-[#DCEFFF] transition-colors cursor-pointer disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
