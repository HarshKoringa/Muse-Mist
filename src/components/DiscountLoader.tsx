'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const steps = [
  { label: 'Checking your profile...', icon: '✦', color: '#1A237E' },
  { label: 'Unlocking your discount...', icon: '🎉', color: '#7C3AED' },
  { label: 'Calculating best price...', icon: '◈', color: '#1A237E' },
  { label: 'Your deal is ready!', icon: '✓', color: '#16A34A' },
]

export default function DiscountLoader() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timings = [400, 800, 1200]
    const timers = timings.map((delay, i) =>
      setTimeout(() => setCurrentStep(i + 1), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-sm
                    border border-gray-100 p-8 mt-4
                    flex flex-col items-center justify-center
                    gap-6 min-h-[320px]">

      {/* Animated orb */}
      <div className="relative flex items-center justify-center">

        {/* Outer pulse ring */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.05, 0.15],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-24 h-24 rounded-full bg-[#DCD9F8]"
        />

        {/* Middle ring */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
          className="absolute w-16 h-16 rounded-full bg-[#DCD9F8]"
        />

        {/* Center orb */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-12 h-12 rounded-full
                     bg-gradient-to-br from-[#1A237E] to-[#DCD9F8]
                     flex items-center justify-center shadow-lg"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStep}
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
              transition={{ duration: 0.25 }}
              className="text-lg"
            >
              {steps[Math.min(currentStep, steps.length - 1)].icon}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Step text */}
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-xl font-light text-[#1A237E]"
          >
            {steps[Math.min(currentStep, steps.length - 1)].label}
          </motion.p>
        </AnimatePresence>
        <p
          style={{ fontFamily: 'var(--font-body)' }}
          className="text-xs text-gray-400 mt-1"
        >
          Finding you the best price
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: currentStep >= i ? 24 : 8,
              backgroundColor: currentStep >= i ? '#1A237E' : '#E5E7EB',
            }}
            transition={{ duration: 0.3 }}
            className="h-2 rounded-full"
          />
        ))}
      </div>

      {/* Floating ingredient tags */}
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {['Niacinamide', 'Ceramides', 'Vitamin C'].map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.6, 0.4, 0.6],
              scale: [0.8, 1, 1, 1],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{ fontFamily: 'var(--font-body)' }}
            className="text-[10px] px-2.5 py-1 rounded-full
                       bg-[#DCEFFF] text-[#1A237E] font-medium
                       border border-[#DCD9F8]"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
  )
}
