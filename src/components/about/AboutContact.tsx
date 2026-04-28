"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export default function AboutContact() {
  return (
    <section className="w-full px-6 sm:px-12 py-24 bg-[#DCD9F8]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p
            className="text-xs tracking-[0.35em] uppercase text-[#1A237E]/40 mb-4 font-medium"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Get in Touch
          </p>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[52px] sm:text-[64px] font-light text-[#1A237E] leading-tight mb-6"
          >
            We actually
            <br />
            <em className="text-[#1A237E]/40">reply.</em>
          </h2>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-base text-[#1A237E]/60 font-light max-w-sm mx-auto leading-relaxed"
          >
            Questions about your skin, our formulas, or an order? A real human
            will get back to you.
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a
            href="mailto:hello@museandmist.in"
            className="flex-1 flex items-center gap-4 p-6 rounded-2xl bg-white border border-[#DCD9F8] hover:shadow-md hover:shadow-[#1A237E]/10 transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#DCEFFF] flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-[#1A237E]" />
            </div>
            <div>
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="text-sm font-semibold text-[#1A237E] mb-0.5"
              >
                Email
              </p>
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="text-sm text-[#1A237E]/50 font-light"
              >
                hello@museandmist.in
              </p>
            </div>
          </a>

          <a
            href="https://wa.me/917984355915"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center gap-4 p-6 rounded-2xl bg-[#1A237E] border border-[#1A237E] hover:opacity-90 transition-opacity group"
          >
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="text-sm font-semibold text-white mb-0.5"
              >
                WhatsApp
              </p>
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="text-sm text-white/50 font-light"
              >
                Chat with us directly
              </p>
            </div>
          </a>
        </div>

        {/* Social row */}
        <div className="flex items-center justify-center gap-8 mb-16">
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-xs tracking-[0.3em] uppercase text-[#1A237E]/30"
          >
            Follow
          </p>
          <a
            href="https://instagram.com/museandmist.skin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#1A237E]/50 hover:text-[#1A237E] transition-colors"
          >
            <Instagram size={18} />
            <span
              style={{ fontFamily: "var(--font-body)" }}
              className="text-sm font-medium"
            >
              Instagram
            </span>
          </a>
        </div>

        {/* Back to shop */}
        <div className="text-center">
          <Link
            href="/"
            style={{ fontFamily: "var(--font-body)" }}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#1A237E] text-white text-base font-semibold hover:opacity-90 transition-opacity"
          >
            Back to The Edit
          </Link>
        </div>
      </div>
    </section>
  );
}
