"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Aanya S.",
    location: "Mumbai",
    rating: 5,
    product: "Invisible Glow Shield",
    review:
      "Finally a sunscreen that doesn't leave a white cast. I've been using it daily for 3 weeks and my skin looks so much brighter. The texture is absolutely dreamy.",
  },
  {
    id: 2,
    name: "Rohan M.",
    location: "Bangalore",
    rating: 5,
    product: "Barrier Repair",
    review:
      "My skin was so dehydrated and flaky. After just 5 days of using Barrier Repair, it's completely transformed. Lightweight but so effective. Worth every rupee.",
  },
  {
    id: 3,
    name: "Priya K.",
    location: "Delhi",
    rating: 5,
    product: "Reset to Radiance",
    review:
      "I was skeptical about Vitamin C serums but this one is different. No irritation, no stinging — just pure glow. My dark spots have faded noticeably in 2 weeks.",
  },
  {
    id: 4,
    name: "Ishaan T.",
    location: "Pune",
    rating: 4,
    product: "Smooth & Spotless",
    review:
      "My acne scars are visibly lighter after a month of consistent use. The niacinamide concentration is perfect — not too strong, works beautifully.",
  },
  {
    id: 5,
    name: "Meera R.",
    location: "Chennai",
    rating: 5,
    product: "Cleanse, Clear & Calm",
    review:
      "Best face wash I've used. My oily skin stays matte for hours and it doesn't dry my skin out. The foam is so satisfying and it smells incredible.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count
              ? "fill-[#1A237E] text-[#1A237E]"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="w-full px-4 py-20 bg-[#DCEFFF]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-[#1A237E] text-center mb-2">
          Real Skin. Real Results.
        </h2>
        <p className="text-base text-gray-400 text-center mb-12">
          From muses who made the switch.
        </p>

        {/* Scrollable row on mobile, grid on desktop */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="min-w-[280px] sm:min-w-0 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3"
            >
              <StarRating count={review.rating} />

              <p className="text-base text-gray-600 leading-relaxed flex-1">
                &ldquo;{review.review}&rdquo;
              </p>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm font-semibold text-[#1A237E]">
                  {review.name}
                </p>
                <p className="text-xs text-gray-400">
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
          className="flex flex-col items-center gap-2 mt-12"
        >
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="fill-[#1A237E] text-[#1A237E]" />
            ))}
          </div>
          <p className="text-lg font-semibold text-[#1A237E]">4.9 out of 5</p>
          <p className="text-sm text-gray-400">Based on 47 verified reviews</p>
        </motion.div>
      </div>
    </section>
  );
}
