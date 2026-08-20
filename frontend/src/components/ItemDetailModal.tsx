"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Award,
  ZoomIn,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Eye,
  Link2,
  Heart,
  Check,
  Maximize2,
  Minimize2,
  HelpCircle,
} from "lucide-react";
import { CurrencyItem, getItemImages } from "@/lib/types";
import { formatLKR, generateWhatsAppUrl } from "@/lib/api";
import { useCurrency, formatConverted } from "@/lib/CurrencyContext";
import { useWishlist } from "@/lib/WishlistContext";
import GradingGuideModal from "./GradingGuideModal";

interface ItemDetailModalProps {
  item: CurrencyItem | null;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const [loupeActive, setLoupeActive] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50 });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGradingGuide, setShowGradingGuide] = useState(false);
  const { currency, convert, symbol, label } = useCurrency();
  const { addItem, removeItem, isInWishlist } = useWishlist();

  // Reset active image index when item changes
  useEffect(() => {
    setActiveImageIndex(0);
    setLoupeActive(false);
  }, [item?.id]);

  // Intercept Mobile Back Button when Fullscreen Lightbox is open
  useEffect(() => {
    if (typeof window === "undefined" || !isFullscreen) return;

    window.history.pushState({ tn_fullscreen: true }, "");

    const handlePopState = () => {
      setIsFullscreen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isFullscreen]);

  if (!item) return null;

  const images = getItemImages(item);
  const currentImage = images[activeImageIndex] || images[0] || "/images/note_200_temple_tooth_1998.jpg";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLoupePos({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    
    let x = ((touch.clientX - rect.left) / rect.width) * 100;
    let y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    if (x < 0 || x > 100 || y < 0 || y > 100) {
      setLoupeActive(false);
      return;
    }
    
    setLoupeActive(true);
    setLoupePos({ x, y });
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const whatsappUrl = generateWhatsAppUrl(item);

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#14100c] border border-[#d4af37]/40 shadow-2xl p-6 sm:p-8 text-[#f8f6f0]">
        {/* Close & Share Buttons */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2.5 rounded-full bg-[#201912] border border-[#d4af37]/30 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#0c0a08] transition-colors"
            title="View Fullscreen 4K Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const url = `${window.location.origin}/?item=${encodeURIComponent(item.itemCode)}`;
              navigator.clipboard.writeText(url).then(() => {
                setLinkCopied(true);
                // Update URL without reload
                window.history.replaceState(null, "", `/?item=${encodeURIComponent(item.itemCode)}`);
                setTimeout(() => setLinkCopied(false), 2000);
              });
            }}
            className={`p-2.5 rounded-full border transition-colors ${
              linkCopied
                ? "bg-emerald-600 border-emerald-400 text-white"
                : "bg-[#201912] border-[#d4af37]/30 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#0c0a08]"
            }`}
            title="Copy direct link to this item"
          >
            {linkCopied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#201912] border border-[#d4af37]/30 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#0c0a08] transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Loupe High-Res Image & Multi-Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image Loupe Viewport — Wide Horizontal Aspect Ratio & Full View */}
            <div
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 bg-[#080604] md:cursor-crosshair group shadow-inner"
              onMouseEnter={() => setLoupeActive(true)}
              onMouseLeave={() => setLoupeActive(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={currentImage}
                alt={`${item.title} — View ${activeImageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain p-2 transition-opacity duration-300"
                priority
              />

              {/* Magnifier Circle (Interactive 3.5x Loupe) */}
              {loupeActive && (
                <div
                  className="absolute w-40 h-40 rounded-full border-2 border-[#d4af37] pointer-events-none shadow-2xl overflow-hidden -translate-x-1/2 -translate-y-1/2 bg-[#080604] z-30 ring-2 ring-[#d4af37]/40"
                  style={{ left: `${loupePos.x}%`, top: `${loupePos.y}%` }}
                >
                  <div
                    className="absolute w-[350%] h-[350%]"
                    style={{
                      left: `${-loupePos.x * 2.5}%`,
                      top: `${-loupePos.y * 2.5}%`,
                    }}
                  >
                    <Image
                      src={currentImage}
                      alt="Zoomed High-Res Detail"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
              )}

              {/* Item SKU Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-[#d4af37]/40 text-[10px] font-mono font-bold text-[#f3e5ab]">
                {item.itemCode}
              </div>

              {/* Multi-image indicator badge */}
              {images.length > 1 && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-sm border border-[#d4af37]/40 text-[10px] font-mono text-[#f3e5ab] flex items-center gap-1.5 z-10">
                  <Layers className="w-3 h-3 text-[#d4af37]" />
                  <span>
                    Photo {activeImageIndex + 1} / {images.length}
                  </span>
                </div>
              )}

              {/* Next/Prev Arrow Controls overlay on main image */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black transition-all border border-[#d4af37]/40 shadow-lg z-20"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-[#d4af37] text-white hover:text-black transition-all border border-[#d4af37]/40 shadow-lg z-20"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm border border-[#d4af37]/40 text-[10px] font-mono text-[#f3e5ab] flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Move Cursor for 3.5x Loupe</span>
              </div>
            </div>

            {/* Multi-Image Thumbnail Gallery Strip */}
            {images.length > 1 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#a69d8d]">
                  <span className="flex items-center gap-1.5 text-[#f3e5ab]">
                    <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Archival Multi-Angle Views ({images.length} Photos)</span>
                  </span>
                  <span>Click thumbnail to inspect</span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {images.map((imgUrl, idx) => {
                    const isSelected = idx === activeImageIndex;
                    const labels = ["Obverse (Front)", "Reverse (Back)", "Watermark / Detail", "Close-up"];
                    const label = labels[idx] || `View ${idx + 1}`;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`group/thumb relative aspect-[16/9] rounded-xl overflow-hidden border-2 transition-all text-left bg-[#080604] ${
                          isSelected
                            ? "border-[#d4af37] ring-2 ring-[#d4af37]/50 scale-[1.03] shadow-lg shadow-[#d4af37]/20"
                            : "border-[#d4af37]/20 hover:border-[#d4af37]/60 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`${item.title} thumbnail ${idx + 1}`}
                          fill
                          sizes="120px"
                          className="object-contain p-1"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                        <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-mono text-white truncate font-medium">
                          {label}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#d4af37] shadow-sm animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-[#1b150f] border border-[#d4af37]/20 flex items-center gap-3 text-xs text-[#b8af9e]">
              <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0" />
              <span>
                Verified authentic with intaglio engraving, security thread inspection and watermark provenance.
              </span>
            </div>
          </div>

          {/* Right Column: Information, Specs & WhatsApp Button */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{item.country} • {item.year}</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#f8f6f0] leading-tight">
                {item.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGradingGuide(true)}
                  className="px-3 py-1 rounded-full bg-[#261e15] hover:bg-[#32281c] border border-[#d4af37]/40 text-xs font-mono text-[#f3e5ab] flex items-center gap-1.5 transition-colors cursor-pointer group/grade"
                  title="Click to view condition grading scale guide"
                >
                  <span>Condition: <strong>{item.condition_grade}</strong></span>
                  <HelpCircle className="w-3.5 h-3.5 text-[#d4af37] opacity-70 group-hover/grade:opacity-100" />
                </button>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    item.is_sold
                      ? "bg-rose-950 text-rose-300 border border-rose-600/40"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {item.is_sold ? "Sold" : "Available in Vault"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-[#d4cdbf] leading-relaxed bg-[#19130e] p-4 rounded-2xl border border-white/5">
              <p>{item.description || "Authentic Sri Lankan historical numismatic item preserved in high grade with verifiable security features."}</p>
            </div>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#120f0c] border border-[#d4af37]/15">
                <span className="text-[#a69d8d] block">Catalog SKU</span>
                <span className="text-[#f8f6f0] font-bold mt-0.5 block">{item.itemCode}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#120f0c] border border-[#d4af37]/15">
                <span className="text-[#a69d8d] block">Category</span>
                <span className="text-[#f8f6f0] font-bold mt-0.5 block capitalize">{item.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#120f0c] border border-[#d4af37]/15">
                <span className="text-[#a69d8d] block">Issue / Mint Year</span>
                <span className="text-[#f8f6f0] font-bold mt-0.5 block">{item.year}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#120f0c] border border-[#d4af37]/15">
                <span className="text-[#a69d8d] block">Packaging</span>
                <span className="text-[#f8f6f0] font-bold mt-0.5 block">Acid-Free Capsule</span>
              </div>
            </div>

            {/* Price & Direct Purchase Action */}
            <div className="pt-4 border-t border-[#d4af37]/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-mono text-[#a69d8d] block">
                    Catalog Price (Sri Lankan Rupees)
                  </span>
                  <span className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#e5c158]">
                    {formatLKR(item.price)}
                  </span>
                  {currency !== "LKR" && (
                    <span className="text-xs font-mono text-[#b8af9e] block mt-0.5">
                      ≈ {formatConverted(convert(item.price), symbol, label)} {label}
                    </span>
                  )}
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-emerald-600/30 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              {/* Wishlist / Inquiry List Button */}
              <button
                onClick={() => {
                  if (isInWishlist(item.id)) {
                    removeItem(item.id);
                  } else {
                    addItem(item);
                  }
                }}
                className={`w-full py-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  isInWishlist(item.id)
                    ? "bg-rose-950/40 border-rose-600/40 text-rose-300 hover:bg-rose-900/50"
                    : "bg-[#1e1710] border-[#d4af37]/30 text-[#f3e5ab] hover:border-[#d4af37]"
                }`}
              >
                <Heart className="w-4 h-4" fill={isInWishlist(item.id) ? "currentColor" : "none"} />
                <span>{isInWishlist(item.id) ? "Remove from Inquiry List" : "Add to Inquiry List"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Fullscreen 4K Darkroom Lightbox Mode */}
    {isFullscreen && (
      <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200 select-none">
        {/* Top Bar */}
        <div className="flex items-center justify-between text-white z-20">
          <div>
            <span className="text-xs font-mono text-[#d4af37] uppercase tracking-wider block">
              {item.itemCode} • {item.condition_grade}
            </span>
            <h3 className="font-serif text-lg font-bold text-[#f8f6f0] truncate max-w-xl">
              {item.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#a69d8d] hidden sm:inline">
              Photo {activeImageIndex + 1} of {images.length} (ESC to exit)
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-3 rounded-full bg-[#1c1711] border border-[#d4af37]/40 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-black transition-colors"
              title="Exit Fullscreen"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Large Image Display */}
        <div className="relative flex-1 w-full my-4 flex items-center justify-center">
          <div className="relative w-full h-full max-h-[82vh]">
            <Image
              src={currentImage}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/80 hover:bg-[#d4af37] text-white hover:text-black transition-all border border-[#d4af37]/40 shadow-2xl"
                title="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/80 hover:bg-[#d4af37] text-white hover:text-black transition-all border border-[#d4af37]/40 shadow-2xl"
                title="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Bottom Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-3 z-20 overflow-x-auto py-2">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 sm:w-24 aspect-[16/9] rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-black ${
                  idx === activeImageIndex
                    ? "border-[#d4af37] scale-110 shadow-lg"
                    : "border-[#d4af37]/20 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>
    )}

    {/* Grading Guide Modal */}
    <GradingGuideModal open={showGradingGuide} onClose={() => setShowGradingGuide(false)} />
    </>
  );
}
