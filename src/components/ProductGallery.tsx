'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  images: string[]
  alt: string
}

export default function ProductGallery({ images, alt }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="w-full">
      {/* Main image */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F9FAFB] mb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={images[activeIndex]}
              alt={`${alt} - ${activeIndex + 1}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={activeIndex === 0}
              unoptimized
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
              i === activeIndex
                ? 'border-[#1A237E] opacity-100'
                : 'border-transparent opacity-50 hover:opacity-75'
            }`}
          >
            <Image
              src={src}
              alt={`${alt} thumbnail ${i + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  )
}
