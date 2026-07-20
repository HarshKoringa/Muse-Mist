import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Under Maintenance',
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#DCD9F8' }}
    >
      <div className="w-full max-w-md bg-white/60 rounded-3xl shadow-sm px-6 py-10 sm:px-10 sm:py-12 flex flex-col items-center text-center gap-5">
        <span
          className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
          style={{ backgroundColor: '#1a1a3e', color: '#C9A84C', fontFamily: 'var(--font-body)' }}
        >
          Under Maintenance
        </span>

        <div className="flex items-center gap-2">
          <Image src="/images/logo-icon.png" alt="" width={36} height={36} priority />
          <Image src="/images/logo-text.png" alt="Muse & Mist" width={126} height={29} priority />
        </div>

        <div className="w-16 h-px" style={{ backgroundColor: '#C9A84C' }} />

        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-md">
          <Image
            src="/images/maintenance-hero.png"
            alt="Muse & Mist serum"
            width={192}
            height={192}
            priority
            className="w-full h-full object-cover"
          />
        </div>

        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-2xl sm:text-3xl font-medium text-[#1a1a3e]"
        >
          Even muses need a little rest
        </h1>

        <p
          style={{ fontFamily: 'var(--font-body)' }}
          className="text-sm sm:text-base text-[#1a1a3e]/70 leading-relaxed"
        >
          We&apos;re refining your Muse &amp; Mist experience behind the scenes. Back shortly, glowing brighter than ever.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <a
            href="https://wa.me/917984355915"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-body)', backgroundColor: '#1a1a3e' }}
            className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-white text-center hover:opacity-90 transition-opacity"
          >
            Message us
          </a>
          <a
            href="https://instagram.com/museandmist.skin"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-body)', borderColor: '#B9AEE8', color: '#1a1a3e' }}
            className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-center border-2 hover:bg-white/50 transition-colors"
          >
            @museandmist
          </a>
        </div>
      </div>
    </main>
  )
}
