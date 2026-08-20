import { NextResponse } from "next/server";
import { DEFAULT_CURRENCIES } from "@/data/mockCurrencies";
import { CurrencyItem } from "@/lib/types";

// In-memory global store across serverless requests in Next.js
let globalCurrencies: CurrencyItem[] = [...DEFAULT_CURRENCIES];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let result = [...globalCurrencies];

  if (category && category !== "all") {
    result = result.filter((it) => it.category === category);
  }

  if (search && search.trim()) {
    const s = search.toLowerCase().trim();
    result = result.filter(
      (it) =>
        it.title.toLowerCase().includes(s) ||
        it.itemCode.toLowerCase().includes(s) ||
        it.country.toLowerCase().includes(s) ||
        String(it.year).includes(s)
    );
  }

  return NextResponse.json({
    items: result,
    pagination: {
      total: result.length,
      page: 1,
      limit: 100,
      total_pages: 1,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body) {
      if (Array.isArray(body)) {
        // Bulk replace (e.g. clear or update all)
        globalCurrencies = body;
      } else {
        // Add single item
        const newItem: CurrencyItem = {
          id: body.id || "cur-" + Date.now(),
          title: body.title || "Untitled",
          itemCode: body.itemCode || body.item_code || `SL-${Date.now()}`,
          country: body.country || "Sri Lanka",
          year: Number(body.year || 1980),
          price: Number(body.price || 0),
          category: body.category || "banknote",
          condition_grade: body.condition_grade || "UNC",
          imageUrl: body.imageUrl || body.image_url || "/images/note_200_temple_tooth_1998.jpg",
          images: body.images || [body.imageUrl || "/images/note_200_temple_tooth_1998.jpg"],
          description: body.description || "",
          is_sold: Boolean(body.is_sold),
          created_at: new Date().toISOString(),
        };
        globalCurrencies = [newItem, ...globalCurrencies];
      }
    }
    return NextResponse.json({ success: true, items: globalCurrencies });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      globalCurrencies = globalCurrencies.filter((i) => String(i.id) !== String(id));
    }
    return NextResponse.json({ success: true, items: globalCurrencies });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
