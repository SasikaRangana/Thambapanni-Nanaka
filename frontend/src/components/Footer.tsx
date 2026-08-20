"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Send, ArrowRight, Phone } from "lucide-react";
import { WHATSAPP_PHONE, SOCIAL_LINKS } from "../data/mockCurrencies";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./Header";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail("");
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Hello Thambapanni Nanaka specialists, I would like expert advice regarding antique currency valuations."
  )}`;

  return (
    <footer id="contact" className="bg-[#090705] border-t border-[#d4af37]/25 text-[#f8f6f0] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact & WhatsApp Callout Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#1c150e] via-[#241a10] to-[#1c150e] border border-[#d4af37]/35 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 mb-16">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="font-serif text-2xl font-bold text-[#f8f6f0]">
              Need Help Choosing or Valuing a Rare Note?
            </h3>
            <p className="text-xs sm:text-sm text-[#b8af9e]">
              Our numismatic curators respond promptly via Direct Call or WhatsApp with high-resolution photos and provenance history.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="tel:+94710679068"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#14100c] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#f3e5ab] text-sm font-semibold transition-all shadow-lg"
            >
              <Phone className="w-4 h-4 text-[#d4af37]" />
              <span className="font-mono">+94 71 067 9068</span>
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info & Social Media Links */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-md">
                <Image
                  src="/images/logo.jpg"
                  alt="තම්බපණ්ණි නාණක Official Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] to-[#d4af37]">
                  තම්බපණ්ණි නාණක
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#a69d8d] block">
                  Thambapanni Nanaka · Heritage in Your Hands
                </span>
              </div>
            </div>

            <p className="text-xs text-[#b8af9e] italic leading-relaxed">
              &ldquo;We guarantee full responsibility, bank authentication, and trust for all currency notes and historical items in our archive.&rdquo;
            </p>

            <p className="text-xs text-[#8c8273] leading-relaxed">
              Curated repository of authenticated Ceylon and Sri Lankan banknotes, ancient kingdom coins, and commemorative tokens for collectors who value genuine heritage.
            </p>

            {/* Social Media Link Buttons */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-[#d4af37] uppercase tracking-wider block mb-2 font-semibold">
                Official Channels &amp; Community:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18130e] border border-[#d4af37]/30 text-xs font-mono text-[#f8f6f0] hover:text-[#1877f2] hover:border-[#1877f2]/60 hover:bg-[#1877f2]/10 transition-all shadow-sm"
                >
                  <FacebookIcon className="w-3.5 h-3.5 text-[#1877f2]" />
                  <span>Facebook</span>
                </a>

                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18130e] border border-[#d4af37]/30 text-xs font-mono text-[#f8f6f0] hover:text-white hover:border-white/60 hover:bg-white/10 transition-all shadow-sm"
                >
                  <TikTokIcon className="w-3.5 h-3.5 text-white" />
                  <span>TikTok</span>
                </a>

                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18130e] border border-[#d4af37]/30 text-xs font-mono text-[#f8f6f0] hover:text-[#e4405f] hover:border-[#e4405f]/60 hover:bg-[#e4405f]/10 transition-all shadow-sm"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#e4405f]" />
                  <span>Instagram</span>
                </a>

                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18130e] border border-[#d4af37]/30 text-xs font-mono text-[#f8f6f0] hover:text-emerald-400 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="tel:+94710679068"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18130e] border border-[#d4af37]/30 text-xs font-mono text-[#f8f6f0] hover:text-[#f3e5ab] hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10 transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>071 067 9068</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#d4af37]">
              Curated Sections
            </h4>
            <ul className="space-y-2 text-xs text-[#b8af9e]">
              <li>
                <Link href="#collection" className="hover:text-[#f3e5ab] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                  <span>Verified Collection</span>
                </Link>
              </li>
              <li>
                <Link href="#series" className="hover:text-[#f3e5ab] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                  <span>Browse Series &amp; Eras</span>
                </Link>
              </li>
              <li>
                <Link href="#verify" className="hover:text-[#f3e5ab] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                  <span>Verify Serial Number</span>
                </Link>
              </li>
              <li>
                <Link href="#how" className="hover:text-[#f3e5ab] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                  <span>How Ordering Works</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#d4af37]">
              Archival Notices
            </h4>
            <p className="text-xs text-[#b8af9e] leading-relaxed">
              Receive private notices when rare lots or ancient coins enter our vault.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2 pt-1">
              <input
                type="email"
                placeholder="Enter email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#14100c] border border-[#d4af37]/30 text-xs text-[#f8f6f0] placeholder-[#6b6255] focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#d4af37] text-[#0c0a08] hover:bg-[#e5c158] transition-colors"
                aria-label="Subscribe to newsletter"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] font-mono text-emerald-400">
                Subscribed — Welcome to the Thambapanni Nanaka collector registry.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8c8273]">
          <span>© 2026 තම්බපණ්ණි නාණක (Thambapanni Nanaka). All Rights Reserved.</span>
          <span>All Valuations Quoted in Sri Lankan Rupees (LKR)</span>
        </div>
      </div>
    </footer>
  );
}
