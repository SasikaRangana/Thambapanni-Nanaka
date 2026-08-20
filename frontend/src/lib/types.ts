export type CategoryType = "all" | "banknote" | "coin" | "token" | "medal";
export type EraType =
  | "all"
  | "ancient"
  | "dutch"
  | "colonial"
  | "british_ceylon"
  | "dominion"
  | "flora_fauna"
  | "modern"
  | "modern_heritage"
  | "commemorative"
  | string;

export interface CurrencyItem {
  id: string;
  title: string;
  itemCode: string;
  country: string;
  year: number;
  price: number;
  category: "banknote" | "coin" | "token" | "medal" | string;
  era?: "ancient" | "colonial" | "modern" | string;
  series?: string;
  condition_grade: string;
  is_sold: boolean;
  imageUrl: string;
  images?: string[];
  description?: string;
  created_at?: string;
  updated_at?: string;
  whatsapp_inquiry_url?: string;
  whatsapp_message?: string;
}

export function getItemImages(item: CurrencyItem | null | undefined): string[] {
  if (!item) return ["/images/note_200_temple_tooth_1998.jpg"];
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images.filter(Boolean);
  }
  if (!item.imageUrl) {
    return ["/images/note_200_temple_tooth_1998.jpg"];
  }
  if (typeof item.imageUrl === "string") {
    const trimmed = item.imageUrl.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    if (trimmed.includes(",")) {
      const split = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
      if (split.length > 0) return split;
    }
    return [trimmed];
  }
  return ["/images/note_200_temple_tooth_1998.jpg"];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CurrencyFilterState {
  category: CategoryType;
  era: EraType;
  search: string;
  series?: string;
  minPrice?: number;
  maxPrice?: number;
  conditionGrade?: string;
  sortBy: "created_at" | "price_asc" | "price_desc" | "year_asc" | "year_desc";
}
