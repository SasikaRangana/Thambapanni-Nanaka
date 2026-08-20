import { CurrencyItem, PaginatedResponse, CurrencyFilterState } from "./types";
import { DEFAULT_CURRENCIES, WHATSAPP_PHONE } from "../data/mockCurrencies";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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

const LOCAL_STORAGE_KEY = "thambapanni_custom_currencies";
const LOCAL_OVERRIDE_KEY = "thambapanni_currencies_override";

export function getLocalCurrencies(): CurrencyItem[] {
  if (typeof window === "undefined") return DEFAULT_CURRENCIES;
  try {
    const saved = localStorage.getItem(LOCAL_OVERRIDE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading cached currencies", e);
  }
  return DEFAULT_CURRENCIES;
}

export function saveLocalCurrencies(items: CurrencyItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_OVERRIDE_KEY, JSON.stringify(items));
    // Dispatch custom event so other tabs or components can react instantly
    window.dispatchEvent(new Event("thambapanni_catalog_updated"));
  } catch (e) {
    console.error("Error saving local currencies", e);
  }
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
        const enrichedApiItems = data.items.map((it: any) => ({
          ...it,
          imageUrl: it.imageUrl || it.image_url || "/images/note_200_temple_tooth_1998.jpg",
          images: it.images || (it.imageUrl ? [it.imageUrl] : [it.image_url || "/images/note_200_temple_tooth_1998.jpg"]),
          whatsapp_inquiry_url: generateWhatsAppUrl(it),
        }));

        // Cache latest API items to localStorage if available
        saveLocalCurrencies(enrichedApiItems);

        return {
          items: enrichedApiItems,
          pagination: data.pagination || {
            total: enrichedApiItems.length,
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
    // Backend API not reachable, fallback to persisted local/mock catalog
  }

  // Local fallback filtering from local storage cache or default dataset
  const baseItems = getLocalCurrencies();
  let filtered = [...baseItems];

  if (filters?.category && filters.category !== "all") {
    filtered = filtered.filter((it) => it.category === filters.category);
  }

  if (filters?.era && filters.era !== "all") {
    filtered = filtered.filter((it) => it.era === filters.era);
  }

  if (filters?.conditionGrade && filters.conditionGrade !== "all") {
    filtered = filtered.filter((it) => it.condition_grade.toLowerCase().includes(filters.conditionGrade!.toLowerCase()));
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
    images: it.images || (it.imageUrl ? [it.imageUrl] : ["/images/note_200_temple_tooth_1998.jpg"]),
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
          images: data.data.images || (data.data.imageUrl ? [data.data.imageUrl] : ["/images/note_200_temple_tooth_1998.jpg"]),
          whatsapp_inquiry_url: generateWhatsAppUrl(data.data),
        };
      }
    }
  } catch (err) {
    // fallback
  }

  const catalog = getLocalCurrencies();
  const found = catalog.find(
    (it) =>
      it.itemCode.toLowerCase() === q ||
      it.id.toLowerCase() === q ||
      it.title.toLowerCase().includes(q) ||
      String(it.year) === q
  );

  return found ? { ...found, whatsapp_inquiry_url: generateWhatsAppUrl(found) } : null;
}

