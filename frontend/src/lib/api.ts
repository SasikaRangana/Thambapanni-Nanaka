import { CurrencyItem, PaginatedResponse, CurrencyFilterState } from "./types";
import { DEFAULT_CURRENCIES, WHATSAPP_PHONE } from "../data/mockCurrencies";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function formatLKR(amount: number): string {
  return "Rs. " + Number(amount).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function generateWhatsAppUrl(item: CurrencyItem): string {
  const message = [
    `*🪙 Thambapanni Nanaka Collector Order Inquiry*`,
    `----------------------------------------`,
    `*Item:* ${item.title}`,
    `*SKU / Code:* \`${item.itemCode}\``,
    `*Era / Year:* ${item.year} (${item.country})`,
    `*Condition Grade:* ${item.condition_grade}`,
    `*Quoted Price:* ${formatLKR(item.price)}`,
    `----------------------------------------`,
    `Hello Thambapanni Nanaka team, I would like to inquire about the availability and secure delivery for this item. Could you please confirm reservation?`,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export async function fetchCurrencies(filters?: Partial<CurrencyFilterState>): Promise<PaginatedResponse<CurrencyItem>> {
  try {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== "all") {
      params.append("category", filters.category);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.minPrice !== undefined) {
      params.append("min_price", String(filters.minPrice));
    }
    if (filters?.maxPrice !== undefined) {
      params.append("max_price", String(filters.maxPrice));
    }
    if (filters?.conditionGrade) {
      params.append("condition_grade", filters.conditionGrade);
    }

    const res = await fetch(`${API_BASE}/currencies?${params.toString()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        return {
          items: data.items.map((it: any) => ({
            ...it,
            imageUrl: it.imageUrl || it.image_url || "/images/note_200_temple_tooth_1998.jpg",
            whatsapp_inquiry_url: generateWhatsAppUrl(it),
          })),
          pagination: data.pagination || {
            total: data.items.length,
            page: 1,
            limit: 20,
            total_pages: 1,
            has_next: false,
            has_prev: false,
          },
        };
      }
    }
  } catch (err) {
    console.warn("Backend API not reachable, using authentic local catalog data fallback.", err);
  }

  // Local fallback filtering
  let filtered = [...DEFAULT_CURRENCIES];

  if (filters?.category && filters.category !== "all") {
    filtered = filtered.filter((it) => it.category === filters.category);
  }

  if (filters?.era && filters.era !== "all") {
    filtered = filtered.filter((it) => it.era === filters.era);
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.itemCode.toLowerCase().includes(q) ||
        it.country.toLowerCase().includes(q) ||
        String(it.year).includes(q) ||
        (it.description && it.description.toLowerCase().includes(q))
    );
  }

  if (filters?.sortBy) {
    if (filters.sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "year_asc") {
      filtered.sort((a, b) => a.year - b.year);
    } else if (filters.sortBy === "year_desc") {
      filtered.sort((a, b) => b.year - a.year);
    }
  }

  const enriched = filtered.map((it) => ({
    ...it,
    whatsapp_inquiry_url: generateWhatsAppUrl(it),
  }));

  return {
    items: enriched,
    pagination: {
      total: enriched.length,
      page: 1,
      limit: 20,
      total_pages: 1,
      has_next: false,
      has_prev: false,
    },
  };
}

export async function verifyItemProvenance(query: string): Promise<CurrencyItem | null> {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  try {
    const res = await fetch(`${API_BASE}/currencies/${encodeURIComponent(q)}`, {
      cache: "no-store"
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data) {
        return {
          ...data.data,
          whatsapp_inquiry_url: generateWhatsAppUrl(data.data),
        };
      }
    }
  } catch (err) {
    // fallback
  }

  const found = DEFAULT_CURRENCIES.find(
    (it) =>
      it.itemCode.toLowerCase() === q ||
      it.id.toLowerCase() === q ||
      it.title.toLowerCase().includes(q) ||
      String(it.year) === q
  );

  return found ? { ...found, whatsapp_inquiry_url: generateWhatsAppUrl(found) } : null;
}
