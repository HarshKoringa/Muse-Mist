'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Instagram } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/checkout')) return null

  return (
    <footer className="w-full bg-[#1A237E] border-t-2 border-white/10 px-6 sm:px-12 py-16">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-3 mb-1">
              <Image
                src="/logo.png"
                alt="Muse & Mist"
                width={40}
                height={40}
                className="object-contain"
              />
              <p style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-light text-white">
                Muse &amp; Mist
              </p>
            </div>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-[#DCD9F8]/40 leading-relaxed font-light mb-4">
              Hybrid Harmony Skincare.<br />
              Made in India, for India.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/museandmist.skin" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#DCD9F8] transition-colors">
                <Instagram size={18} />
              </a>

            </div>
          </div>

          {/* Shop */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs tracking-widest uppercase text-white/60 mb-6">
              Shop
            </p>
            <div className="flex flex-col gap-3">
              {['Invisible Glow Shield', 'Barrier Repair', 'Reset to Radiance', 'Smooth & Spotless', 'Cleanse, Clear & Calm'].map((product) => (
                <Link
                  key={product}
                  href={`/products/${product.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  style={{ fontFamily: 'var(--font-body)' }}
                  className="text-sm text-white/40 hover:text-[#DCD9F8] transition-colors font-light"
                >
                  {product}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs tracking-widest uppercase text-white/60 mb-6">
              Company
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'The Routine', href: '/routine' },
                { label: 'My Orders', href: '/orders' },
                { label: 'Return Policy', href: '/policies/returns' },
                { label: 'Refund Policy', href: '/policies/refunds' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ fontFamily: 'var(--font-body)' }}
                  className="text-sm text-white/40 hover:text-[#DCD9F8] transition-colors font-light"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs tracking-widest uppercase text-white/60 mb-6">
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <a href="mailto:hello@museandmist.in" style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-white/40 hover:text-[#DCD9F8] transition-colors font-light">
                hello@museandmist.in
              </a>
              <a href="https://wa.me/917984355915" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-white/40 hover:text-[#DCD9F8] transition-colors font-light">
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5">
          <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-white/20 font-light">
            © 2026 Muse &amp; Mist. All rights reserved. HRK Wellness LLP.
          </p>
        </div>
      </div>
    </footer>
  )
}
