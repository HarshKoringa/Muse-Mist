'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import EarlyAccessModal from './EarlyAccessModal'

type Props = {
  productName?: string
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
}

export default function EarlyAccessButton({
  productName,
  variant = 'primary',
  fullWidth = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const baseClass = `flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-base font-semibold transition-all cursor-pointer${fullWidth ? ' w-full' : ''}`
  const variantClass = variant === 'primary'
    ? 'bg-[#1A237E] text-white hover:opacity-90'
    : 'border-2 border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white'

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${baseClass} ${variantClass}`}
      >
        <Sparkles size={16} />
        Get Early Access · 30% Off
      </button>

      <EarlyAccessModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        productName={productName}
      />
    </>
  )
}
