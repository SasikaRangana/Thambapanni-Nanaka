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
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
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

import { supabase } from "./supabase";

export async function fetchCurrencies(filters?: Partial<CurrencyFilterState>): Promise<PaginatedResponse<CurrencyItem>> {
  try {
    let query = supabase.from("currencies").select("*");

    if (filters?.category && filters.category !== "all") {
      query = query.ilike("category", filters.category);
    }
    if (filters?.conditionGrade && filters.conditionGrade !== "all") {
      query = query.ilike("condition_grade", `%${filters.conditionGrade}%`);
    }
    if (filters?.search && filters.search.trim()) {
      const s = filters.search.trim();
      query = query.or(`title.ilike.%${s}%,item_code.ilike.%${s}%,description.ilike.%${s}%,country.ilike.%${s}%`);
    }

    if (filters?.sortBy === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (filters?.sortBy === "price_desc") {
      query = query.order("price", { ascending: false });
    } else if (filters?.sortBy === "year_asc") {
      query = query.order("year", { ascending: true });
    } else if (filters?.sortBy === "year_desc") {
      query = query.order("year", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (!error && Array.isArray(data) && data.length > 0) {
      const liveItems: CurrencyItem[] = data.map((row: any) => {
        let parsedImages: string[] = [];
        if (Array.isArray(row.images)) {
          parsedImages = row.images;
        } else if (typeof row.image_url === "string") {
          try {
            const parsed = JSON.parse(row.image_url);
            if (Array.isArray(parsed)) parsedImages = parsed;
            else parsedImages = [row.image_url];
          } catch {
            parsedImages = [row.image_url];
          }
        }

        const primaryImg = parsedImages[0] || row.image_url || row.imageUrl || "/images/note_200_temple_tooth_1998.jpg";

        const item: CurrencyItem = {
          id: String(row.id),
          title: row.title,
          itemCode: row.item_code || row.itemCode || `SL-${row.year || 1980}`,
          country: row.country || "Sri Lanka",
          year: Number(row.year || 1980),
          price: Number(row.price || 0),
          category: row.category || "banknote",
          condition_grade: row.condition_grade || "UNC (Uncirculated)",
          is_sold: Boolean(row.is_sold),
          imageUrl: primaryImg,
          images: parsedImages.length > 0 ? parsedImages : [primaryImg],
          description: row.description || "",
          created_at: row.created_at,
        };

        return {
          ...item,
          whatsapp_inquiry_url: generateWhatsAppUrl(item),
        };
      });

      // Save to local cache as backup
      saveLocalCurrencies(liveItems);

      return {
        items: liveItems,
        pagination: {
          total: liveItems.length,
          page: 1,
          limit: 100,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        },
      };
    }
  } catch (err) {
    console.warn("Supabase fetch failed, trying Next.js API route:", err);
  }

  // 2. Next.js native API route fallback (Universal across all mobile & PC devices)
  try {
    const apiRes = await fetch("/api/currencies", { cache: "no-store" });
    if (apiRes.ok) {
      const apiData = await apiRes.json();
      if (apiData && Array.isArray(apiData.items) && apiData.items.length > 0) {
        return {
          items: apiData.items.map((it: any) => ({
            ...it,
            whatsapp_inquiry_url: generateWhatsAppUrl(it),
          })),
          pagination: apiData.pagination || {
            total: apiData.items.length,
            page: 1,
            limit: 100,
            total_pages: 1,
            has_next: false,
            has_prev: false,
          },
        };
      }
    }
  } catch {}

  // 3. Local fallback filtering from local storage cache or default dataset
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

