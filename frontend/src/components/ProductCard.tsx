"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageCircle, ZoomIn, ShieldCheck, Images, Layers, Heart } from "lucide-react";
import { CurrencyItem, getItemImages } from "@/lib/types";
import { formatLKR } from "@/lib/api";
import { useCurrency, formatConverted } from "@/lib/CurrencyContext";
import { useWishlist } from "@/lib/WishlistContext";

interface ProductCardProps {
  item: CurrencyItem;
  onOpenDetail: (item: CurrencyItem) => void;
}

export default function ProductCard({ item, onOpenDetail }: ProductCardProps) {
  const images = getItemImages(item);
  const primaryImage = images[0] || "/images/note_200_temple_tooth_1998.jpg";
  const [hoverIndex, setHoverIndex] = useState(0);
  const { currency, convert, symbol, label } = useCurrency();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(item.id);

  const displayImage = images[hoverIndex] || primaryImage;

  return (
    <article className="group relative rounded-2xl bg-[#15110d] border border-[#d4af37]/20 hover:border-[#d4af37]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#d4af37]/10">
      {/* Media Box — 16:9 landscape ratio, object-contain so full note is visible */}
      <div
        className="relative w-full aspect-[16/9] bg-[#090806] overflow-hidden cursor-pointer"
        onClick={() => onOpenDetail(item)}
      >
        {/* Subtle inner glow frame */}
        <div className="absolute inset-0 shadow-[inset_0_0_24px_rgba(0,0,0,0.7)] z-10 pointer-events-none rounded-t-2xl" />

        <Image
          src={displayImage}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-500"
        />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#15110d] to-transparent pointer-events-none z-10" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
          <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-[10px] font-mono font-semibold text-[#f3e5ab] uppercase tracking-wider">
            {item.itemCode}
          </span>

          <div className="flex items-center gap-1.5">
            {images.length > 1 && (
              <span className="px-2 py-1 rounded-md bg-black/85 backdrop-blur-md border border-[#d4af37]/40 text-[10px] font-mono font-bold text-[#f3e5ab] flex items-center gap-1">
                <Images className="w-3 h-3 text-[#d4af37]" />
                <span>{images.length} Photos</span>
              </span>
            )}
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                item.is_sold
                  ? "bg-rose-950/80 text-rose-300 border border-rose-600/40"
                  : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
              }`}
            >
              {item.is_sold ? "Sold Out" : "Available"}
            </span>
          </div>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            wishlisted ? removeItem(item.id) : addItem(item);
          }}
          className={`absolute bottom-3 right-3 z-20 p-2 rounded-full border transition-all shadow-lg ${
            wishlisted
              ? "bg-rose-600/90 border-rose-400 text-white scale-110"
              : "bg-black/70 border-[#d4af37]/40 text-[#f3e5ab] hover:bg-rose-600/80 hover:border-rose-400 hover:text-white"
          }`}
          title={wishlisted ? "Remove from inquiry list" : "Add to inquiry list"}
        >
          <Heart className="w-3.5 h-3.5" fill={wishlisted ? "currentColor" : "none"} />
        </button>

        {/* Loupe Hover Prompt */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] z-20">
          <span className="px-4 py-2 rounded-full bg-[#1c1711] border border-[#d4af37] text-xs font-mono text-[#f3e5ab] flex items-center gap-2 shadow-xl">
            <ZoomIn className="w-3.5 h-3.5 text-[#d4af37]" />
            Inspect Loupe &amp; Gallery
          </span>
        </div>
      </div>

      {/* Content & Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#b8af9e]">
            <span>{item.country}</span>
            <span>•</span>
            <span className="text-[#e5c158] font-bold">{item.year}</span>
            <span>•</span>
            <span className="capitalize">{item.category}</span>
          </div>

          <h3
            onClick={() => onOpenDetail(item)}
            className="font-serif text-base font-bold text-[#f8f6f0] group-hover:text-[#f3e5ab] transition-colors mt-1.5 line-clamp-2 cursor-pointer"
          >
            {item.title}
          </h3>

          <div className="mt-2.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#221b13] border border-[#d4af37]/25 text-[11px] font-mono text-[#f3e5ab]">
              <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
              {item.condition_grade}
            </span>
          </div>
        </div>

        {/* Pricing & WhatsApp CTA */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#a69d8d] block">
              Quoted Valuation
            </span>
            <span className="font-serif text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] to-[#d4af37]">
              {formatLKR(item.price)}
            </span>
            {currency !== "LKR" && (
              <span className="text-[10px] font-mono text-[#b8af9e] block mt-0.5">
                ≈ {formatConverted(convert(item.price), symbol, label)} {label}
              </span>
            )}
          </div>

          <a
            href={item.whatsapp_inquiry_url || `https://wa.me/94710679068`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md shrink-0"
            title="Inquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Inquire</span>
          </a>
        </div>
      </div>
    </article>
  );
}
