"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: 'Nirali K.',
    location: 'Ahmedabad',
    rating: 5,
    product: 'On our brand vision',
    review: 'This is the skincare brand India has been waiting for. Science-backed, honest about ingredients, and actually designed for our climate. I\'ve been following since day one.',
  },
  {
    id: 2,
    name: 'Pulkit B.',
    location: 'Jaipur',
    rating: 5,
    product: 'On our Hybrid Harmony philosophy',
    review: 'The idea of combining high-performance actives with calming botanicals makes so much sense. Most brands do one or the other. Muse & Mist is doing both — and explaining exactly why.',
  },
  {
    id: 3,
    name: 'Somya K.',
    location: 'Gurugram',
    rating: 5,
    product: 'On our ingredient transparency',
    review: 'I love that they tell you exactly what\'s in each product and at what concentration. No proprietary blends, no vague claims. Just honest formulation. Refreshing.',
  },
  {
    id: 4,
    name: 'Tushar S.',
    location: 'Bangalore',
    rating: 5,
    product: 'On our 5-step ritual',
    review: 'Finally a brand that says STOP buying more products. The 5-step ritual concept is exactly what the Indian skincare community needs to hear right now.',
  },
  {
    id: 5,
    name: 'Neel M.',
    location: 'Mumbai',
    rating: 5,
    product: 'On our founder story',
    review: 'Having an MSc chemist as co-founder gives me so much confidence. This isn\'t just a pretty brand — the science is real. Can\'t wait to try everything at launch.',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="w-full px-6 sm:px-12 py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] sm:text-[64px] font-light text-[#1A237E] leading-tight">
            What our community<br />
            <em>is already saying.</em>
          </h2>
          <p className="text-sm text-gray-400 mt-4 font-light" style={{ fontFamily: 'var(--font-body)' }}>
            From people who believe in what we&apos;re building.
          </p>
        </div>

        {/* Scrollable row on mobile, 3-column grid on desktop */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="min-w-[280px] sm:min-w-0 bg-[#DCEFFF]/50 rounded-2xl p-6 border border-[#DCD9F8] flex flex-col gap-3 hover:bg-[#DCD9F8]/30 transition-colors"
            >
              <StarRating count={review.rating} />

              <p className="text-base text-gray-600 leading-relaxed flex-1" style={{ fontFamily: 'var(--font-body)' }}>
                &ldquo;{review.review}&rdquo;
              </p>

              <div className="pt-3 border-t border-[#DCD9F8]">
                <p className="text-lg font-medium text-[#1A237E]" style={{ fontFamily: 'var(--font-display)' }}>
                  {review.name}
                </p>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
                  {review.location} &middot; {review.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregate rating */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-2 mt-16 p-8 rounded-3xl bg-[#1A237E]"
        >
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="fill-[#DCD9F8] text-[#DCD9F8]" />
            ))}
          </div>
          <p className="text-3xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Now Live
          </p>
          <p className="text-sm text-white/40" style={{ fontFamily: 'var(--font-body)' }}>
            Join 100+ muses already shopping
          </p>
        </motion.div>
      </div>
    </section>
  );
}
