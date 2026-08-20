"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CurrencyItem } from "./types";
import { formatLKR, generateWhatsAppUrl } from "./api";
import { WHATSAPP_PHONE } from "../data/mockCurrencies";

interface WishlistContextType {
  items: CurrencyItem[];
  addItem: (item: CurrencyItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearAll: () => void;
  count: number;
  generateBundledWhatsAppUrl: () => string;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  isInWishlist: () => false,
  clearAll: () => {},
  count: 0,
  generateBundledWhatsAppUrl: () => "",
});

const STORAGE_KEY = "tn_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CurrencyItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
  }, []);

  const persist = useCallback((next: CurrencyItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addItem = useCallback(
    (item: CurrencyItem) => {
      if (items.find((i) => i.id === item.id)) return;
      persist([...items, item]);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    (id: string) => {
      persist(items.filter((i) => i.id !== id));
    },
    [items, persist]
  );

  const isInWishlist = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  const generateBundledWhatsAppUrl = useCallback(() => {
    if (items.length === 0) return `https://wa.me/${WHATSAPP_PHONE}`;

    const totalPrice = items.reduce((sum, it) => sum + it.price, 0);
    const itemLines = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.title}*\n   SKU: \`${it.itemCode}\` • Grade: ${it.condition_grade} • ${formatLKR(it.price)}`
      )
      .join("\n\n");

    const message = [
      `*🪙 Thambapanni Nanaka — Multi-Item Inquiry*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      itemLines,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*Total Estimated Value:* ${formatLKR(totalPrice)}`,
      `*Items Count:* ${items.length}`,
      ``,
      `Hello Thambapanni Nanaka team, I would like to inquire about the availability and secure delivery for these ${items.length} items. Could you please confirm reservation?`,
    ].join("\n");

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  }, [items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearAll,
        count: items.length,
        generateBundledWhatsAppUrl,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
