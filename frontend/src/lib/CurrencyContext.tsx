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

export function FlagIcon({ code, className = "w-4 h-3 shrink-0 rounded-[2px] shadow-sm" }: { code: CurrencyCode; className?: string }) {
  switch (code) {
    case "LKR":
      // Sri Lanka Flag SVG
      return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#ffbe29" />
          <rect x="25" y="25" width="590" height="430" fill="#000" />
          <rect x="40" y="40" width="85" height="400" fill="#005f38" />
          <rect x="135" y="40" width="85" height="400" fill="#eb7400" />
          <rect x="230" y="40" width="370" height="400" fill="#8d153a" />
          {/* Gold Lion Stylized Silhouette */}
          <circle cx="415" cy="240" r="85" fill="#ffbe29" opacity="0.9" />
          <path d="M370 190h90v100h-90z" fill="#ffbe29" />
          <path d="M430 180l40 30-40 30z" fill="#ffbe29" />
          {/* Bo Leaves in corners */}
          <path d="M250 60c20 0 30 10 30 30-20 0-30-10-30-30z" fill="#ffbe29" />
          <path d="M580 60c0 20-10 30-30 30 0-20 10-30 30-30z" fill="#ffbe29" />
          <path d="M250 420c20 0 30-10 30-30-20 0-30 10-30 30z" fill="#ffbe29" />
          <path d="M580 420c0-20-10-30-30-30 0 20 10 30 30 30z" fill="#ffbe29" />
        </svg>
      );
    case "USD":
      // United States Flag SVG
      return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#fff" />
          <path fill="#bd3d44" d="M0 0h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0z" />
          <rect width="270" height="259" fill="#192f5d" />
          <circle cx="70" cy="65" r="14" fill="#fff" />
          <circle cx="135" cy="65" r="14" fill="#fff" />
          <circle cx="200" cy="65" r="14" fill="#fff" />
          <circle cx="100" cy="130" r="14" fill="#fff" />
          <circle cx="170" cy="130" r="14" fill="#fff" />
          <circle cx="70" cy="195" r="14" fill="#fff" />
          <circle cx="135" cy="195" r="14" fill="#fff" />
          <circle cx="200" cy="195" r="14" fill="#fff" />
        </svg>
      );
    case "GBP":
      // United Kingdom Union Jack SVG
      return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <path fill="#012169" d="M0 0h640v480H0z" />
          <path fill="#FFF" d="m75 0 245 180L565 0h75v50L395 240l245 190v50h-75L320 300 75 480H0v-50l245-190L0 50V0h75z" />
          <path fill="#C8102E" d="m424 288 216 162v30h-30L384 300zm-208-96L0 30V0h30l216 162zm208-48L640 30V0h-30L384 180zM0 450l216-162h30L30 480H0z" />
          <path fill="#FFF" d="M240 0h160v480H240zM0 160h640v160H0z" />
          <path fill="#C8102E" d="M266 0h108v480H266zM0 186h640v108H0z" />
        </svg>
      );
    case "EUR":
      // European Union Flag SVG
      return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#003399" />
          <g fill="#ffcc00">
            <circle cx="320" cy="110" r="16" />
            <circle cx="320" cy="370" r="16" />
            <circle cx="190" cy="240" r="16" />
            <circle cx="450" cy="240" r="16" />
            <circle cx="228" cy="148" r="16" />
            <circle cx="412" cy="148" r="16" />
            <circle cx="228" cy="332" r="16" />
            <circle cx="412" cy="332" r="16" />
            <circle cx="268" cy="118" r="16" />
            <circle cx="372" cy="118" r="16" />
            <circle cx="268" cy="362" r="16" />
            <circle cx="372" cy="362" r="16" />
          </g>
        </svg>
      );
    case "AUD":
      // Australia Flag SVG
      return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="480" fill="#00008b" />
          {/* Mini Union Jack canton */}
          <g transform="scale(0.5)">
            <path fill="#012169" d="M0 0h640v480H0z" />
            <path fill="#FFF" d="m75 0 245 180L565 0h75v50L395 240l245 190v50h-75L320 300 75 480H0v-50l245-190L0 50V0h75z" />
            <path fill="#C8102E" d="m424 288 216 162v30h-30L384 300zm-208-96L0 30V0h30l216 162zm208-48L640 30V0h-30L384 180zM0 450l216-162h30L30 480H0z" />
            <path fill="#FFF" d="M240 0h160v480H240zM0 160h640v160H0z" />
            <path fill="#C8102E" d="M266 0h108v480H266zM0 186h640v108H0z" />
          </g>
          {/* Commonwealth 7-pointed star */}
          <circle cx="160" cy="360" r="38" fill="#fff" />
          {/* Southern Cross stars */}
          <circle cx="480" cy="390" r="22" fill="#fff" />
          <circle cx="410" cy="240" r="18" fill="#fff" />
          <circle cx="480" cy="90" r="18" fill="#fff" />
          <circle cx="550" cy="180" r="18" fill="#fff" />
          <circle cx="510" cy="290" r="12" fill="#fff" />
        </svg>
      );
    default:
      return null;
  }
}

export const CURRENCY_OPTIONS: CurrencyCode[] = ["LKR", "USD", "GBP", "EUR", "AUD"];

