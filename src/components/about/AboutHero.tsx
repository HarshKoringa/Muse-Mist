"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative w-full min-h-[60vh] bg-gradient-to-br from-[#1A237E] via-[#3949AB] to-[#DCD9F8] flex flex-col justify-between p-8 overflow-hidden">
      {/* Back button */}
      <Link
        href="/home-v1"
        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors w-fit"
      >
        <ArrowLeft size={18} />
        <span className="text-base">Back</span>
      </Link>

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mt-16"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">
          Our Story
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight max-w-lg">
          Where Science Meets Serenity.
        </h1>
        <p className="text-base text-white/60 mt-4 max-w-md leading-relaxed">
          Muse &amp; Mist was born from a simple belief — that high-performance
          skincare should feel like a ritual, not a routine.
        </p>
      </motion.div>

      {/* Decorative blur circles */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#DCD9F8] opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white opacity-5 blur-2xl pointer-events-none" />
    </section>
  );
}
