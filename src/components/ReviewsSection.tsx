"use client";

const BASE = 'https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/';

const REVIEWS = [
  {
    image: `${BASE}review-kinal.png`,
    username: '@kinal_narodiya',
    excerpt: 'Face wash acne marks faded in 15 days. Sunscreen is miraculous — no white cast.',
    product: 'Face Wash, Niacinamide Serum, Sunscreen',
  },
  {
    image: `${BASE}review-pulkit.png`,
    username: '@_pulkitbohra',
    excerpt: 'Deep Detox feels super gentle yet leaves skin fresh. Handwritten note made it special.',
    product: 'Face Wash, Niacinamide Serum',
  },
  {
    image: `${BASE}review-nairuti.png`,
    username: '@nairuti_hedamba',
    excerpt: 'Sunscreen is lightweight, blends well, no greasy feel. Comfortable for daily use.',
    product: 'Invisible Glow Shield Sunscreen',
  },
  {
    image: `${BASE}review-trupti.png`,
    username: '@trupti',
    excerpt: 'Loved the products. Really felt like my skin type. Would definitely recommend.',
    product: 'Full Routine',
  },
  {
    image: `${BASE}review-bhakti.png`,
    username: '@itssbhaktii',
    excerpt: 'Cloud foam texture, non-sticky serums, matte moisturizer. Recommend to everyone.',
    product: 'Full Routine',
  },
  {
    image: `${BASE}review-somya.png`,
    username: '@_arsphene_',
    excerpt: 'Lightweight, no white cast, not oily. Really good and genuine product.',
    product: 'Invisible Glow Shield Sunscreen',
  },
  {
    image: `${BASE}review-arsphene.png`,
    username: '@whatswrongwith',
    excerpt: "Lightweight for everyday use, fragrance free, doesn't get oily in heat.",
    product: 'Invisible Glow Shield Sunscreen',
  },
  {
    image: `${BASE}review-tushar.png`,
    username: '@tushar_sukhwal',
    excerpt: 'Face wash feels light, cleans properly without tight feeling. So far, so good.',
    product: 'Deep Detox Face Wash',
  },
];

export default function ReviewsSection() {
  return (
    <section className="w-full py-[60px] sm:py-[40px] bg-[#F8F7FD]">
      {/* Header */}
      <div className="px-6 sm:px-12 mb-8">
        <p
          className="text-[12px] uppercase tracking-[3px] text-[#1A237E] mb-2 font-medium"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Real Reviews
        </p>
        <h2
          className="text-[32px] sm:text-[32px] text-[24px] font-light text-[#0D1117] leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          What our customers say.
        </h2>
      </div>

      {/* Scroll container */}
      <div
        className="reviews-scroll flex overflow-x-auto gap-5 px-6 sm:px-10 pb-2"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {REVIEWS.map((review, i) => (
          <div
            key={i}
            className="review-card flex-none bg-white rounded-2xl overflow-hidden"
            style={{
              width: '280px',
              scrollSnapAlign: 'start',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            {/* Screenshot image */}
            <div style={{ maxHeight: '400px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={review.image}
                alt={`Review by ${review.username}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* Info */}
            <div style={{ padding: '12px 16px' }}>
              <p
                className="font-semibold text-[#1A237E]"
                style={{ fontFamily: 'var(--font-body)', fontSize: '13px' }}
              >
                {review.username}
              </p>
              <p
                className="text-[#6B7280] mt-1 line-clamp-2"
                style={{ fontFamily: 'var(--font-body)', fontSize: '12px' }}
              >
                {review.excerpt}
              </p>
              <p
                className="text-[#9CA3AF] mt-1"
                style={{ fontFamily: 'var(--font-body)', fontSize: '11px' }}
              >
                {review.product}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .reviews-scroll::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 640px) {
          .review-card {
            width: 85% !important;
          }
        }
      `}</style>
    </section>
  );
}
