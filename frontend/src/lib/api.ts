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

const LOCAL_OVERRIDE_KEY = "thambapanni_currencies_override";

export function getLocalCurrencies(): CurrencyItem[] {
  if (typeof window === "undefined") return DEFAULT_CURRENCIES;
  try {
    const saved = localStorage.getItem(LOCAL_OVERRIDE_KEY);
    if (saved !== null) {
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
    window.dispatchEvent(new Event("thambapanni_catalog_updated"));
  } catch (e) {
    console.error("Error saving local currencies", e);
  }
}

// ─── Fetch currencies: Always uses /api/currencies server route (Supabase-backed) ───
export async function fetchCurrencies(filters?: Partial<CurrencyFilterState>): Promise<PaginatedResponse<CurrencyItem>> {
  try {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== "all") params.set("category", filters.category);
    if (filters?.search && filters.search.trim()) params.set("search", filters.search.trim());

    const url = `/api/currencies${params.toString() ? "?" + params.toString() : ""}`;
    const res = await fetch(url, { cache: "no-store" });

    if (res.ok) {
      const data = await res.json();
      let items: CurrencyItem[] = (data.items || []).map((it: any) => ({
        ...it,
        images: it.images || (it.imageUrl ? [it.imageUrl] : ["/images/note_200_temple_tooth_1998.jpg"]),
        whatsapp_inquiry_url: generateWhatsAppUrl(it),
      }));

      // Apply client-side sorts (server route orders by created_at by default)
      if (filters?.sortBy === "price_asc") items.sort((a, b) => a.price - b.price);
      else if (filters?.sortBy === "price_desc") items.sort((a, b) => b.price - a.price);
      else if (filters?.sortBy === "year_asc") items.sort((a, b) => a.year - b.year);
      else if (filters?.sortBy === "year_desc") items.sort((a, b) => b.year - a.year);

      // condition grade filter (client-side)
      if (filters?.conditionGrade && filters.conditionGrade !== "all") {
        items = items.filter(it => it.condition_grade.toLowerCase().includes(filters.conditionGrade!.toLowerCase()));
      }

      if (items.length > 0) {
        saveLocalCurrencies(items);
      }

      return {
        items,
        pagination: {
          total: items.length,
          page: 1,
          limit: 100,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        },
      };
    }
  } catch (err) {
    console.warn("API route fetch failed, using local cache:", err);
  }

  // Fallback: local storage cache
  const baseItems = getLocalCurrencies();
  let filtered = [...baseItems];

  if (filters?.category && filters.category !== "all") {
    filtered = filtered.filter((it) => it.category === filters.category);
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
  if (filters?.sortBy === "price_asc") filtered.sort((a, b) => a.price - b.price);
  else if (filters?.sortBy === "price_desc") filtered.sort((a, b) => b.price - a.price);
  else if (filters?.sortBy === "year_asc") filtered.sort((a, b) => a.year - b.year);
  else if (filters?.sortBy === "year_desc") filtered.sort((a, b) => b.year - a.year);

  const enriched = filtered.map((it) => ({
    ...it,
    images: it.images || (it.imageUrl ? [it.imageUrl] : ["/images/note_200_temple_tooth_1998.jpg"]),
    whatsapp_inquiry_url: generateWhatsAppUrl(it),
  }));

  return {
    items: enriched,
    pagination: { total: enriched.length, page: 1, limit: 100, total_pages: 1, has_next: false, has_prev: false },
  };
}

export async function verifyItemProvenance(query: string): Promise<CurrencyItem | null> {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  try {
    const res = await fetch(`${API_BASE}/currencies/${encodeURIComponent(q)}`, { cache: "no-store" });
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
  } catch {}

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
