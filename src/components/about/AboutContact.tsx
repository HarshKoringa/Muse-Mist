"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export default function AboutContact() {
  return (
    <section className="w-full px-4 py-20 bg-[#1A237E]">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-white opacity-30 mb-2">
            Get in Touch
          </p>
          <h2 className="text-3xl font-semibold text-white mb-4">
            We Actually Reply.
          </h2>
          <p className="text-base text-white/60 leading-relaxed mb-12">
            Questions about your skin, our formulas, or an order? Reach out — a
            real human from the Muse &amp; Mist team will get back to you.
          </p>

          {/* Contact options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="mailto:hello@museandmist.in"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors text-white text-base font-medium"
            >
              <Mail size={20} />
              hello@museandmist.in
            </a>
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors text-white text-base font-medium"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-6">
            <p className="text-sm text-white/40 uppercase tracking-widest">
              Follow
            </p>
            <a
              href="https://instagram.com/museandmist"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-base"
            >
              <Instagram size={20} />
              Instagram
            </a>
            <a
              href="https://twitter.com/museandmist"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-base"
            >
              <Twitter size={20} />
              Twitter
            </a>
          </div>

          {/* Back to shop */}
          <Link
            href="/home-v1"
            className="inline-block mt-16 px-8 py-4 rounded-2xl bg-white text-[#1A237E] text-base font-semibold hover:opacity-90 transition-opacity"
          >
            Back to The Edit
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
