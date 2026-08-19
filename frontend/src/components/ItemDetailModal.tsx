"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { CurrencyItem, getItemImages } from "@/lib/types";
import { formatLKR, generateWhatsAppUrl } from "@/lib/api";

interface ItemDetailModalProps {
  item: CurrencyItem | null;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const [loupeActive, setLoupeActive] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50 });
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset active image index when item changes
  useEffect(() => {
    setActiveImageIndex(0);
    setLoupeActive(false);
  }, [item?.id]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#14100c] border border-[#d4af37]/40 shadow-2xl p-6 sm:p-8 text-[#f8f6f0]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-[#201912] border border-[#d4af37]/30 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#0c0a08] transition-colors z-20"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Loupe High-Res Image & Multi-Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image Loupe Viewport */}
            <div
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 bg-[#0c0a08] cursor-crosshair group shadow-inner touch-none"
              onMouseEnter={() => setLoupeActive(true)}
              onMouseLeave={() => setLoupeActive(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchMove}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => setLoupeActive(false)}
              onTouchCancel={() => setLoupeActive(false)}
            >
              <Image
                src={currentImage}
                alt={`${item.title} — View ${activeImageIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover transition-opacity duration-300"
                priority
              />

              {/* Magnifier Circle (Interactive 3.5x Loupe) */}
              {loupeActive && (
                <div
                  className="absolute w-36 h-36 rounded-full border-2 border-[#d4af37] pointer-events-none shadow-2xl overflow-hidden -translate-x-1/2 -translate-y-1/2 bg-black z-30"
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
                      className="object-cover"
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
                        className={`group/thumb relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all text-left bg-black ${
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
                          className="object-cover"
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
                <span className="px-3 py-1 rounded-full bg-[#261e15] border border-[#d4af37]/40 text-xs font-mono text-[#f3e5ab]">
                  Condition: <strong>{item.condition_grade}</strong>
                </span>
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
            <div className="pt-4 border-t border-[#d4af37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-mono text-[#a69d8d] block">
                  Catalog Price (Sri Lankan Rupees)
                </span>
                <span className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#e5c158]">
                  {formatLKR(item.price)}
                </span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
