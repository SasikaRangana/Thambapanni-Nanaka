"use client";

import React from "react";
import Image from "next/image";
import { X, MessageCircle, Trash2, Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/lib/WishlistContext";
import { formatLKR } from "@/lib/api";
import { getItemImages } from "@/lib/types";

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({ open, onClose }: WishlistDrawerProps) {
  const { items, removeItem, clearAll, count, generateBundledWhatsAppUrl } = useWishlist();
  const totalPrice = items.reduce((sum, it) => sum + it.price, 0);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-[#12100c] border-l border-[#d4af37]/30 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#d4af37]/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#1e1710] border border-[#d4af37]/30">
                <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#f8f6f0]">Inquiry List</h3>
                <p className="text-[10px] font-mono text-[#a69d8d] uppercase tracking-wider">
                  {count} item{count !== 1 ? "s" : ""} bookmarked
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#1e1710] border border-[#d4af37]/30 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#0c0a08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-60">
                <ShoppingBag className="w-12 h-12 text-[#d4af37]/40" />
                <p className="text-sm text-[#b8af9e]">
                  No items bookmarked yet.
                  <br />
                  <span className="text-[10px] font-mono text-[#6b6255]">
                    Tap the ❤️ icon on any note or coin to add it here.
                  </span>
                </p>
              </div>
            ) : (
              items.map((item) => {
                const images = getItemImages(item);
                const thumb = images[0] || "/images/note_200_temple_tooth_1998.jpg";
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-[#18140f] border border-[#d4af37]/15 hover:border-[#d4af37]/40 transition-colors group"
                  >
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-[#d4af37]/20 shrink-0 bg-black">
                      <Image
                        src={thumb}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#f8f6f0] truncate">{item.title}</p>
                      <p className="text-[10px] font-mono text-[#a69d8d] mt-0.5">
                        {item.itemCode} · {item.condition_grade}
                      </p>
                      <p className="text-xs font-bold text-[#d4af37] font-mono mt-1">
                        {formatLKR(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-600/30 text-rose-400 hover:bg-rose-900/60 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                      title="Remove from inquiry list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#d4af37]/20 space-y-3">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#a69d8d]">Estimated Total</span>
                <span className="font-serif text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#e5c158]">
                  {formatLKR(totalPrice)}
                </span>
              </div>

              {/* Bundled WhatsApp Order Button */}
              <a
                href={generateBundledWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire All {count} Items via WhatsApp</span>
              </a>

              <button
                onClick={clearAll}
                className="w-full py-2 rounded-xl bg-transparent border border-[#d4af37]/20 text-[#a69d8d] text-xs font-mono hover:text-rose-300 hover:border-rose-600/30 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
