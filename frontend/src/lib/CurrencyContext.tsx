"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type CurrencyCode = "LKR" | "USD" | "GBP" | "EUR" | "AUD";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  convert: (lkrAmount: number) => number;
  symbol: string;
  label: string;
}

// Fixed approximate exchange rates (LKR → X), updated periodically
const RATES: Record<CurrencyCode, { rate: number; symbol: string; label: string }> = {
  LKR: { rate: 1, symbol: "Rs.", label: "LKR" },
  USD: { rate: 0.0031, symbol: "$", label: "USD" },
  GBP: { rate: 0.0024, symbol: "£", label: "GBP" },
  EUR: { rate: 0.0028, symbol: "€", label: "EUR" },
  AUD: { rate: 0.0047, symbol: "A$", label: "AUD" },
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "LKR",
  setCurrency: () => {},
  convert: (v) => v,
  symbol: "Rs.",
  label: "LKR",
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("LKR");

  useEffect(() => {
    const saved = localStorage.getItem("tn_currency") as CurrencyCode;
    if (saved && RATES[saved]) setCurrencyState(saved);
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem("tn_currency", c);
  }, []);

  const convert = useCallback(
    (lkrAmount: number) => {
      return Math.round(lkrAmount * RATES[currency].rate * 100) / 100;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convert,
        symbol: RATES[currency].symbol,
        label: RATES[currency].label,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function formatConverted(amount: number, symbol: string, label: string): string {
  if (label === "LKR") {
    return "Rs. " + Number(amount).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return `${symbol}${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const CURRENCY_OPTIONS: CurrencyCode[] = ["LKR", "USD", "GBP", "EUR", "AUD"];
export const CURRENCY_FLAGS: Record<CurrencyCode, string> = {
  LKR: "🇱🇰",
  USD: "🇺🇸",
  GBP: "🇬🇧",
  EUR: "🇪🇺",
  AUD: "🇦🇺",
};
