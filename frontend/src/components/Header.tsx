"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Menu, X, ShieldCheck } from "lucide-react";
import { WHATSAPP_PHONE, SOCIAL_LINKS } from "../data/mockCurrencies";

export function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappDirect = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    "Hello Thambapanni Nanaka team, I would like to inquire about your historical currency and banknote collection."
  )}`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0c0a08]/95 backdrop-blur-md border-b border-[#d4af37]/20 shadow-2xl"
          : "bg-transparent border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4af37]/60 group-hover:border-[#d4af37] transition-all shadow-md">
            <Image
              src="/images/logo.jpg"
              alt="තම්බපණ්ණි නාණක Official Seal"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#e5c158]">
              තම්බපණ්ණි නාණක
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#b8af9e] font-medium font-mono">
              Thambapanni Nanaka · Curated Archive
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#dcd6cd]">
          <Link href="#home" className="hover:text-[#d4af37] transition-colors">
            Home
          </Link>
          <Link href="#collection" className="hover:text-[#d4af37] transition-colors">
            Catalog
          </Link>
          <Link href="#series" className="hover:text-[#d4af37] transition-colors">
            Eras &amp; Series
          </Link>
          <Link href="#verify" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            Verify Note
          </Link>
          <Link href="#how" className="hover:text-[#d4af37] transition-colors">
            How It Works
          </Link>
          <Link href="#contact" className="hover:text-[#d4af37] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Social Icons & Action CTAs */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Social Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-[#d4af37]/20">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#18130e] border border-[#d4af37]/20 text-[#b8af9e] hover:text-[#1877f2] hover:border-[#1877f2]/50 hover:bg-[#1877f2]/10 transition-all shadow-sm"
              title="Follow us on Facebook"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#18130e] border border-[#d4af37]/20 text-[#b8af9e] hover:text-white hover:border-white/50 hover:bg-white/10 transition-all shadow-sm"
              title="Watch on TikTok"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#18130e] border border-[#d4af37]/20 text-[#b8af9e] hover:text-[#e4405f] hover:border-[#e4405f]/50 hover:bg-[#e4405f]/10 transition-all shadow-sm"
              title="Follow us on Instagram"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          <a
            href={whatsappDirect}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-700/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-white/10 text-white hover:border-[#d4af37]/50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Modal Popup with Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Backdrop Click Area */}
          <div 
            className="absolute inset-0" 
            onClick={() => setMobileMenuOpen(false)} 
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-sm rounded-3xl bg-[#14100c]/98 border border-[#d4af37]/40 shadow-2xl p-5 text-sm font-medium z-10 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#d4af37]/20">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#d4af37]/60">
                  <Image
                    src="/images/logo.jpg"
                    alt="Logo"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <span className="font-serif font-bold text-[#f8f6f0] text-sm tracking-wide">
                  තම්බපණ්ණි නාණක
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-[#201912] border border-[#d4af37]/30 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#0c0a08] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compact Nav Items */}
            <div className="flex flex-col space-y-0.5 py-1">
              <Link
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-[#d4cdbf] hover:text-[#f8f6f0] hover:bg-[#201912] transition-colors flex items-center justify-between text-xs"
              >
                <span>Home (මුල් පිටුව)</span>
                <span className="text-[10px] text-[#8c8273] font-mono">01</span>
              </Link>
              <Link
                href="#collection"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-[#d4cdbf] hover:text-[#f8f6f0] hover:bg-[#201912] transition-colors flex items-center justify-between text-xs"
              >
                <span>Catalog (නාමාවලිය)</span>
                <span className="text-[10px] text-[#8c8273] font-mono">02</span>
              </Link>
              <Link
                href="#series"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-[#d4cdbf] hover:text-[#f8f6f0] hover:bg-[#201912] transition-colors flex items-center justify-between text-xs"
              >
                <span>Eras &amp; Series (යුග සහ කාණ්ඩ)</span>
                <span className="text-[10px] text-[#8c8273] font-mono">03</span>
              </Link>
              <Link
                href="#verify"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-[#e5c158] hover:bg-[#201912] transition-colors flex items-center justify-between text-xs font-semibold"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  Verify Note
                </span>
                <span className="text-[10px] text-[#d4af37] font-mono">04</span>
              </Link>
              <Link
                href="#how"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-[#d4cdbf] hover:text-[#f8f6f0] hover:bg-[#201912] transition-colors flex items-center justify-between text-xs"
              >
                <span>How Ordering Works (ඇණවුම් කිරීම)</span>
                <span className="text-[10px] text-[#8c8273] font-mono">05</span>
              </Link>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-[#d4cdbf] hover:text-[#f8f6f0] hover:bg-[#201912] transition-colors flex items-center justify-between text-xs"
              >
                <span>Contact &amp; Valuations (විමසීම්)</span>
                <span className="text-[10px] text-[#8c8273] font-mono">06</span>
              </Link>
            </div>

            {/* Social Media Section with Equalized Vertical Spacing */}
            <div className="pt-3.5 pb-3.5 mt-1 border-t border-[#d4af37]/20 flex items-center justify-center gap-4">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#1c1611] border border-[#d4af37]/30 text-[#d4cdbf] hover:text-[#1877f2] hover:border-[#1877f2]/50 hover:bg-[#1877f2]/10 transition-all shadow-sm"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#1c1611] border border-[#d4af37]/30 text-[#d4cdbf] hover:text-white hover:border-white/50 hover:bg-white/10 transition-all shadow-sm"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#1c1611] border border-[#d4af37]/30 text-[#d4cdbf] hover:text-[#e4405f] hover:border-[#e4405f]/50 hover:bg-[#e4405f]/10 transition-all shadow-sm"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>

            {/* WhatsApp CTA Button */}
            <div>
              <a
                href={whatsappDirect}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Direct WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
