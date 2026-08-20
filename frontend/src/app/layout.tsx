import type { Metadata } from "next";
import { Cinzel, Outfit, Noto_Serif } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { WishlistProvider } from "@/lib/WishlistContext";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "තම්බපණ්ණි නාණක | Thambapanni Nanaka — Sri Lanka's Heritage in Your Hands",
  description:
    "Discover, collect and own authentic ancient Ceylon coins, British colonial banknotes and rare historical currency at Thambapanni Nanaka. Bank-verified authenticity, LKR pricing, instant WhatsApp inquiry.",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${outfit.variable} ${notoSerif.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#0c0a08] text-[#f8f6f0] font-sans antialiased selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
        <CurrencyProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}

