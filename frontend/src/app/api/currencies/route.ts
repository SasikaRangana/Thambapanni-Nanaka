import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CurrencyItem } from "@/lib/types";

// IMPORTANT: Hardcoded correct Supabase project URL (rwatywlucdmakmmjcfjf)
// Do NOT change to env var override — Vercel env may have a typo (rwatywlucdmakmmjcjfj which is WRONG)
const SUPABASE_URL = "https://rwatywlucdmakmmjcfjf.supabase.co";

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YXR5d2x1Y2RtYWttbWpjZmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MzM1ODEsImV4cCI6MjEwMjUwOTU4MX0.OZ3bgszetOL1Ug0Iw53yI_B-dgriMjIYlG4CnEDajP4";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper: map Supabase DB row → CurrencyItem
function rowToItem(row: any): CurrencyItem {
  let parsedImages: string[] = [];
  if (Array.isArray(row.images)) {
    parsedImages = row.images;
  } else if (typeof row.image_url === "string") {
    try {
      const p = JSON.parse(row.image_url);
      parsedImages = Array.isArray(p) ? p : [row.image_url];
    } catch {
      parsedImages = [row.image_url];
    }
  }
  const primaryImg = parsedImages[0] || "/images/note_200_temple_tooth_1998.jpg";
  return {
    id: String(row.id),
    title: row.title || "Untitled",
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
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  try {
    let query = supabase.from("currencies").select("*").order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.ilike("category", category);
    }
    if (search && search.trim()) {
      const s = search.trim();
      query = query.or(`title.ilike.%${s}%,item_code.ilike.%${s}%,country.ilike.%${s}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json({ items: [], error: error.message, pagination: { total: 0, page: 1, limit: 100, total_pages: 0 } });
    }

    const items: CurrencyItem[] = (data || []).map(rowToItem);
    return NextResponse.json({
      items,
      pagination: { total: items.length, page: 1, limit: 100, total_pages: 1 },
    });
  } catch (err: any) {
    console.error("Supabase GET exception:", err);
    return NextResponse.json({ items: [], error: err?.message, pagination: { total: 0, page: 1, limit: 100, total_pages: 0 } });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      // Bulk upsert — not used in main flow, skip
      return NextResponse.json({ success: true });
    }

    // Single item insert
    const finalImages: string[] = body.images || (body.imageUrl ? [body.imageUrl] : ["/images/note_200_temple_tooth_1998.jpg"]);

    const insertPayload: any = {
      title: body.title || "Untitled",
      item_code: body.itemCode || body.item_code || `SL-${Date.now()}`,
      country: body.country || "Sri Lanka",
      year: Number(body.year || 1980),
      price: Number(body.price || 0),
      category: body.category || "banknote",
      condition_grade: body.condition_grade || "UNC (Uncirculated)",
      image_url: JSON.stringify(finalImages),
      description: body.description || "",
      is_sold: Boolean(body.is_sold),
    };

    const { data, error } = await supabase
      .from("currencies")
      .insert([insertPayload])
      .select();

    if (error) {
      console.error("Supabase INSERT error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const saved = data && data[0] ? rowToItem(data[0]) : null;
    return NextResponse.json({ success: true, item: saved });
  } catch (err: any) {
    console.error("Supabase POST exception:", err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "No id provided" }, { status: 400 });
    }

    const { error } = await supabase.from("currencies").delete().eq("id", id);

    if (error) {
      console.error("Supabase DELETE error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Supabase DELETE exception:", err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "No id provided" }, { status: 400 });
    }

    const { error } = await supabase.from("currencies").update(updates).eq("id", id);

    if (error) {
      console.error("Supabase PATCH error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
