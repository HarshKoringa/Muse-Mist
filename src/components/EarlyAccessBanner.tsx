'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import EarlyAccessModal from './EarlyAccessModal'

export default function EarlyAccessBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('banner-dismissed', 'true')
    window.dispatchEvent(new Event('banner-dismissed'))
  }

  if (dismissed) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full bg-[#1A237E] px-4 py-2.5 flex items-center justify-center gap-3 relative"
      >
        {/* Pulse dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-[#DCD9F8] animate-pulse flex-shrink-0 hidden sm:block" />

        {/* Text */}
        <p className="text-xs sm:text-sm text-white/80 font-medium text-center leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
          Launching soon —{' '}
          <button
            onClick={() => setIsOpen(true)}
            className="text-[#DCD9F8] font-semibold underline underline-offset-2 hover:text-white transition-colors cursor-pointer"
          >
            register for 30% off
          </button>
        </p>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </motion.div>

      <EarlyAccessModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
