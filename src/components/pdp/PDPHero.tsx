'use client'

import { Product } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { motion } from 'framer-motion'
import { ShoppingBag, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
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
  const addItem = useCartStore((state) => state.addItem)
  const [showToast, setShowToast] = useState(false)
  const gradient = gradientMap[product.category] ?? 'from-[#DCD9F8] to-[#DCEFFF]'
  const subtitle = subtitleMap[product.slug] ?? ''
  const outOfStock = product.stock_count === 0

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      category: product.category,
      stock_count: product.stock_count,
    })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  return (
    <>
      <section className="w-full">

        {/* Large gradient visual */}
        <div className={`w-full h-72 sm:h-96 bg-gradient-to-br
                         ${gradient} relative flex flex-col
                         justify-between p-6`}>

          {/* Back button */}
          <Link
            href="/home-v1"
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

        {/* Product info card */}
        <div className="max-w-2xl mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category + name */}
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-semibold text-[#1A237E] mb-2">
              {product.name}
            </h1>
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
              <span className="text-3xl font-bold text-[#1A237E]">
                ₹{product.price}
              </span>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Add to Cart */}
                <button
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center
                              gap-2 py-4 rounded-2xl text-base font-semibold
                              transition-opacity
                              ${outOfStock
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#DCD9F8] text-[#1A237E] hover:opacity-80 cursor-pointer'
                              }`}
                >
                  <ShoppingBag size={20} />
                  {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>

                {/* Buy Now — Shiprocket stub */}
                <button
                  disabled={outOfStock}
                  onClick={() => {
                    // Phase 4 — Shiprocket Magic SDK fires here
                  }}
                  className={`flex-1 flex items-center justify-center
                              gap-2 py-4 rounded-2xl text-base font-semibold
                              transition-opacity
                              ${outOfStock
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#1A237E] text-white hover:opacity-90 cursor-pointer'
                              }`}
                >
                  <Zap size={20} />
                  Buy Now
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Free shipping on orders above ₹999 ·
                Secure checkout via Shiprocket
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <AddedToast visible={showToast} productName={product.name} />
    </>
  )
}
