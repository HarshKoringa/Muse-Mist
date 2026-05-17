'use client'

import { Product } from '@/types/product'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import AddedToast from '@/components/AddedToast'

const gradientMap: Record<string, string> = {
  Sunscreen:   'from-[#DCEFFF] via-[#DCD9F8] to-white',
  Moisturiser: 'from-[#DCD9F8] via-[#DCEFFF] to-white',
  Serum:       'from-[#1A237E] via-[#3949AB] to-[#DCD9F8]',
  'Face Wash': 'from-[#DCEFFF] via-white to-[#DCD9F8]',
}

const subtitleMap: Record<string, string> = {
  'invisible-glow-shield': 'SPF 50+ PA+++ · Vitamin C · Fermented Rice Water',
  'barrier-repair':        'Ceramides · Hyaluronic Acid · Cica',
  'reset-to-radiance':     '15% Vitamin C · Amla · Orange Peel',
  'smooth-and-spotless':   '10% Niacinamide · 1% Alpha Arbutin · Cica',
  'cleanse-clear-calm':    'Salicylic Acid · Niacinamide · Zinc PCA',
}

type Props = { product: Product }

export default function PDPHero({ product }: Props) {
  const gradient = gradientMap[product.category] ?? 'from-[#DCD9F8] to-[#DCEFFF]'
  const subtitle = subtitleMap[product.slug] ?? ''
  const outOfStock = product.stock_count === 0
  const addItem = useCartStore((state) => state.addItem)
  const [showToast, setShowToast] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      mrp: product.mrp ?? null,
      category: product.category,
      stock_count: product.stock_count,
      image_url: product.image_url ?? null,
      size: product.size ?? null,
    })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  return (
    <>
      <section className="w-full">

        {/* Large image or gradient visual */}
        {product.image_url ? (
          <div className="w-full h-72 sm:h-96 relative overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            {/* Back button */}
            <Link
              href="/"
              className="absolute top-6 left-6 flex items-center gap-2 text-white
                         bg-black/30 hover:bg-black/50 transition-colors
                         rounded-full px-3 py-1.5 w-fit"
            >
              <ArrowLeft size={18} />
              <span className="text-base">Back</span>
            </Link>
            {/* Stock badge */}
            <div className="absolute top-6 right-6">
              {outOfStock ? (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-500">
                  Out of Stock
                </span>
              ) : product.stock_count <= 10 ? (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-600">
                  Only {product.stock_count} left
                </span>
              ) : null}
            </div>
          </div>
        ) : (
          <div className={`w-full h-72 sm:h-96 bg-gradient-to-br
                           ${gradient} relative flex flex-col
                           justify-between p-6`}>
            {/* Back button */}
            <Link
              href="/"
              className="flex items-center gap-2 text-[#1A237E]
                         opacity-50 hover:opacity-100
                         transition-opacity w-fit"
            >
              <ArrowLeft size={18} />
              <span className="text-base">Back</span>
            </Link>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase
                            text-[#1A237E] opacity-20 mb-1">
                Muse & Mist
              </p>
              <p className="text-xl font-semibold text-[#1A237E] opacity-50">
                {product.name}
              </p>
            </div>
            {/* Stock badge */}
            <div className="absolute top-6 right-6">
              {outOfStock ? (
                <span className="text-xs font-medium px-3 py-1 rounded-full
                                 bg-red-100 text-red-500">
                  Out of Stock
                </span>
              ) : product.stock_count <= 10 ? (
                <span className="text-xs font-medium px-3 py-1 rounded-full
                                 bg-amber-100 text-amber-600">
                  Only {product.stock_count} left
                </span>
              ) : null}
            </div>
          </div>
        )}

        {/* Product info card */}
        <div className="max-w-2xl mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category + name */}
            <div className="flex items-center gap-3 mb-1">
              <h1 style={{ fontFamily: 'var(--font-display)' }}
                  className="text-4xl font-light text-[#1A237E] leading-tight">
                {product.category}
              </h1>
              {product.size && (
                <span className="text-sm font-medium text-[#1A237E] bg-[#DCEFFF] border border-[#DCD9F8] px-3 py-1 rounded-full">
                  {product.size}
                </span>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-body)' }}
               className="text-sm text-[#1A237E]/60 font-medium tracking-wide mb-4">
              {product.name}
            </p>
            {subtitle && (
              <p className="text-sm font-medium text-[#1A237E]
                            opacity-50 mb-4">
                {subtitle}
              </p>
            )}
            <p className="text-base text-gray-500 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* How to use */}
            {product.how_to_use && (
              <div className="mb-8 p-4 rounded-xl bg-[#DCEFFF]
                              border border-[#DCD9F8]">
                <p className="text-xs font-semibold uppercase tracking-widest
                              text-[#1A237E] opacity-50 mb-2">
                  How to Use
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  {product.how_to_use}
                </p>
              </div>
            )}

            {/* Skin type */}
            {product.skin_type && (
              <p className="text-sm text-gray-400 mb-8">
                <span className="font-semibold text-[#1A237E] opacity-60">
                  Best for:
                </span>{' '}
                {product.skin_type}
              </p>
            )}

            {/* Price + CTA */}
            <div className="flex flex-col gap-4 pt-6
                            border-t border-gray-100">
              {/* Discount badge */}
              {product.discount_active && product.discount_percent && (
                <span className="inline-flex items-center text-xs font-bold
                                 px-3 py-1.5 rounded-full bg-red-500 text-white
                                 uppercase tracking-wide w-fit">
                  🎉 {product.discount_label ?? 'Sale'} · {product.discount_percent}% OFF
                </span>
              )}

              {/* Price row */}
              <div className="flex items-baseline gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl text-[#1A237E]/50">₹</span>
                  <span className="text-5xl font-bold text-[#1A237E]"
                        style={{ fontFamily: 'var(--font-body)' }}>
                    {Number(product.price).toLocaleString('en-IN')}
                  </span>
                </div>
                {product.discount_active && product.mrp && (
                  <div className="flex flex-col">
                    <span className="text-xl text-gray-400 line-through">
                      ₹{Number(product.mrp).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-green-600 font-semibold">
                      You save ₹{(Number(product.mrp) - Number(product.price)).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 -mt-2">Incl. of all taxes</p>

              {/* Offer pills */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold
                                 px-3 py-1.5 rounded-full
                                 bg-green-50 text-green-700 border border-green-200">
                  ✦ Extra 5% off on prepaid
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold
                                 px-3 py-1.5 rounded-full
                                 bg-blue-50 text-blue-700 border border-blue-200">
                  🚚 Free shipping on prepaid
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium
                                 px-3 py-1.5 rounded-full
                                 bg-gray-50 text-gray-500 border border-gray-200">
                  COD available (+₹50)
                </span>
              </div>

              <div className="flex gap-3">
                {/* Add to Cart */}
                <button
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-semibold transition-all ${outOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#DCD9F8] text-[#1A237E] hover:opacity-80 cursor-pointer'}`}
                >
                  <ShoppingBag size={20} />
                  {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>

                {/* Buy Now */}
                <button
                  disabled={outOfStock}
                  onClick={() => {
                    if (!outOfStock) {
                      handleAddToCart()
                      window.location.href = '/cart'
                    }
                  }}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-semibold transition-all ${outOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1A237E] text-white hover:opacity-90 cursor-pointer'}`}
                >
                  <Zap size={20} />
                  Buy Now
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                🔒 Secure checkout · Powered by Razorpay &amp; Shiprocket
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <AddedToast visible={showToast} productName={product.name} />
    </>
  )
}
