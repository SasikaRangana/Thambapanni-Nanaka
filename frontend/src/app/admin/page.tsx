"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Search,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  RefreshCw,
  UploadCloud,
  Images,
  Star,
  Eye,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { DEFAULT_CURRENCIES } from "@/data/mockCurrencies";
import { CurrencyItem, getItemImages } from "@/lib/types";
import { formatLKR, fetchCurrencies, API_BASE, getLocalCurrencies, saveLocalCurrencies } from "@/lib/api";
import { supabase } from "@/lib/supabase";

const PRESET_TEMPLATES = [
  {
    label: "✨ Select a Note or Coin Preset (Template) to Auto-fill...",
    data: null,
  },
  {
    label: "💵 1979 Central Bank of Ceylon 2 Rupees (Fauna: Butterfly & Skink)",
    data: {
      title: "1979 Central Bank of Ceylon 2 Rupees — Endemic Flora & Fauna (Butterfly & Skink)",
      itemCode: "CEY-1979-2R",
      country: "Sri Lanka (Ceylon)",
      year: 1979,
      price: 9500,
      category: "banknote",
      condition_grade: "UNC (Uncirculated)",
      imageUrl: "/images/note_2_ceylon_fauna_1979.jpg",
      images: [
        "/images/note_2_ceylon_fauna_1979.jpg",
        "/images/note_10_ceylon_1982.jpg",
        "/images/note_200_temple_tooth_1998.jpg",
      ],
      description: "Iconic 1979 Ceylon issue depicting the rare butterfly (Cethosia nietneri) and endemic skink (Dasia haliana) on a Murraya branch with intricate fine-line guilloche engraving.",
    },
  },
  {
    label: "💵 1998 Sri Lanka 200 Rupees (Temple of the Tooth & Independence)",
    data: {
      title: "1998 Sri Lanka 200 Rupees — Temple of the Tooth & 50th Independence",
      itemCode: "SL-1998-200R",
      country: "Sri Lanka",
      year: 1998,
      price: 18500,
      category: "banknote",
      condition_grade: "UNC (Uncirculated)",
      imageUrl: "/images/note_200_temple_tooth_1998.jpg",
      images: [
        "/images/note_200_temple_tooth_1998.jpg",
        "/images/note_modern_series_stack.jpg",
        "/images/note_100_sigiriya_frescoes.jpg",
      ],
      description: "Commemorative 50th Anniversary of Independence polymer/paper note depicting Sri Dalada Maligawa (Temple of the Tooth) and the grand historical progress of Sri Lanka.",
    },
  },
  {
    label: "💵 1954 Central Bank of Ceylon 100 Rupees (Queen Elizabeth II)",
    data: {
      title: "1954 Central Bank of Ceylon 100 Rupees — Queen Elizabeth II & Sigiriya",
      itemCode: "CEY-1954-100R",
      country: "Ceylon",
      year: 1954,
      price: 145000,
      category: "banknote",
      condition_grade: "Extremely Fine (XF)",
      imageUrl: "/images/note_100_ceylon_qeii.jpg",
      images: [
        "/images/note_100_ceylon_qeii.jpg",
        "/images/note_100_sigiriya_frescoes.jpg",
        "/images/note_100_ceylon_qeii_color.jpg",
      ],
      description: "Extremely rare 16th October 1954 100-rupee issue bearing the royal portrait of Queen Elizabeth II by Bradbury Wilkinson & Co. Reverse features Sigiriya Frescoes.",
    },
  },
  {
    label: "💵 1982 Central Bank of Ceylon 10 Rupees (Temple Facade)",
    data: {
      title: "1982 Central Bank of Ceylon 10 Rupees — Temple of the Tooth & Somawathiya",
      itemCode: "CEY-1982-10R",
      country: "Sri Lanka (Ceylon)",
      year: 1982,
      price: 8500,
      category: "banknote",
      condition_grade: "UNC (Uncirculated)",
      imageUrl: "/images/note_10_ceylon_1982.jpg",
      images: [
        "/images/note_10_ceylon_1982.jpg",
        "/images/note_2_ceylon_fauna_1979.jpg",
      ],
      description: "Crisp 1982 10-rupee note with intricate temple facade of Sri Dalada Maligawa and Somawathiya Chaitiya reverse.",
    },
  },
  {
    label: "💵 1954 Ceylon 100 Rupees Reverse (Sigiriya Cloud Maidens)",
    data: {
      title: "1954 Ceylon 100 Rupees Reverse — Sigiriya Cloud Maidens (Apsaras)",
      itemCode: "CEY-1954-SIG",
      country: "Ceylon",
      year: 1954,
      price: 135000,
      category: "banknote",
      condition_grade: "Very Fine (VF+)",
      imageUrl: "/images/note_100_sigiriya_frescoes.jpg",
      images: [
        "/images/note_100_sigiriya_frescoes.jpg",
        "/images/note_100_ceylon_qeii.jpg",
      ],
      description: "Historical reverse engraving of the celebrated 5th-century Sigiriya Rock Fortress frescoes depicting celestial cloud maidens holding lotus blossoms.",
    },
  },
  {
    label: "🪙 South Asian Ancient Gold Kahavanu Coin (Polonnaruwa Era)",
    data: {
      title: "South Asian Ancient Gold Kahavanu Coin (Polonnaruwa Era)",
      itemCode: "SL-1153-KAH",
      country: "Sri Lanka",
      year: 1153,
      price: 125000,
      category: "coin",
      condition_grade: "Extremely Fine (XF)",
      imageUrl: "/images/note_200_temple_tooth_1998.jpg",
      images: [
        "/images/note_200_temple_tooth_1998.jpg",
        "/images/note_10_ceylon_1982.jpg",
      ],
      description: "Rare medieval Gold Kahavanu of Polonnaruwa depicting the standing king holding a lotus flower on obverse, Nagari legend 'Sri Parakramabahu' on reverse.",
    },
  },
  {
    label: "🪙 British Ceylon 1941 King George VI 10 Cents Coin",
    data: {
      title: "British Ceylon 1941 King George VI 10 Cents Coin",
      itemCode: "CEY-1941-10C",
      country: "British Ceylon",
      year: 1941,
      price: 6500,
      category: "coin",
      condition_grade: "About Uncirculated (AU)",
      imageUrl: "/images/note_10_ceylon_1982.jpg",
      images: [
        "/images/note_10_ceylon_1982.jpg",
        "/images/note_2_ceylon_fauna_1979.jpg",
      ],
      description: "Pre-independence silver-nickel George VI coinage issued during World War II with palm tree design and bilingual Ceylon script.",
    },
  },
];

const CONDITION_GRADES = [
  "UNC (Uncirculated)",
  "Choice UNC (Gem Uncirculated)",
  "About Uncirculated (AU)",
  "Extremely Fine (XF)",
  "Very Fine (VF)",
  "Fine (F)",
  "Very Good (VG)",
  "Good (G)",
  "Crisp UNC Set",
];

const DEFAULT_ADMIN_TOKEN = "thambapanni_super_secret_admin_token_2026";

export default function AdminPage() {
  const [items, setItems] = useState<CurrencyItem[]>([]);
  const [adminToken, setAdminToken] = useState("");

  // Load items from local storage first, then try API
  React.useEffect(() => {
    // 1. Initial local load
    const cached = getLocalCurrencies();
    setItems(cached);

    // 2. Load stored token if saved
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("thambapanni_admin_token") || DEFAULT_ADMIN_TOKEN;
      setAdminToken(savedToken);
    }

    // 3. Fetch from API
    fetchCurrencies().then((res) => {
      if (res.items && res.items.length > 0) {
        setItems(res.items);
      }
    });
  }, []);

  const handleTokenChange = (val: string) => {
    setAdminToken(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("thambapanni_admin_token", val);
    }
  };

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState("");
  const [manualUrlInput, setManualUrlInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State for new item (Supports multiple images: 3-4 photos)
  const [formData, setFormData] = useState({
    title: "",
    itemCode: "",
    country: "Sri Lanka",
    year: 1980,
    price: 15000,
    category: "banknote",
    condition_grade: "UNC (Uncirculated)",
    imageUrl: "/images/note_200_temple_tooth_1998.jpg",
    images: ["/images/note_200_temple_tooth_1998.jpg"],
    description: "",
  });

  const autoGenerateSku = (category: string, country: string, year: number, title: string) => {
    const isCeylon = country.toLowerCase().includes("ceylon");
    const prefix = isCeylon ? "CEY" : "SL";
    const typeCode = category === "banknote" ? "BN" : category === "coin" ? "CN" : "TK";
    const rand = Math.floor(Math.random() * 900 + 100);
    return `${prefix}-${year}-${typeCode}${rand}`;
  };

  const handlePresetSelect = (presetIndex: number) => {
    const preset = PRESET_TEMPLATES[presetIndex]?.data;
    if (preset) {
      const presetImages = preset.images || (preset.imageUrl ? [preset.imageUrl] : []);
      setFormData({
        title: preset.title,
        itemCode: preset.itemCode || autoGenerateSku(preset.category, preset.country, preset.year, preset.title),
        country: preset.country,
        year: preset.year,
        price: preset.price,
        category: preset.category,
        condition_grade: preset.condition_grade,
        imageUrl: preset.imageUrl,
        images: presetImages,
        description: preset.description,
      });
    }
  };

  const handleTitleOrYearChange = (title: string, year: number, category: string, country: string) => {
    if (!formData.itemCode || formData.itemCode.startsWith("SL-") || formData.itemCode.startsWith("CEY-")) {
      const generated = autoGenerateSku(category, country, year, title);
      setFormData((prev) => ({
        ...prev,
        title,
        year,
        category,
        country,
        itemCode: generated,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        title,
        year,
        category,
        country,
      }));
    }
  };

  // Upload Multiple Images Handler (Cloudinary API integration + Local Preview Fallback)
  const handleImageFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatusMsg(`⏳ Uploading ${files.length} photo(s)...`);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let uploadedUrl = "";

      // Try uploading to Cloudinary directly via public unsigned or local endpoint
      try {
        const cloudFormData = new FormData();
        cloudFormData.append("file", file);
        cloudFormData.append("upload_preset", "ml_default"); // standard preset
        cloudFormData.append("folder", "thambapanni_nanaka/currencies");

        // 1. Try direct Cloudinary upload if cloud name is known
        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/iimn3f72/image/upload", {
          method: "POST",
          body: cloudFormData,
        });

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          if (cloudData?.secure_url) {
            uploadedUrl = cloudData.secure_url;
          }
        }
      } catch {}

      // 2. Fallback to base64 DataURL (always works universally across all devices)
      if (!uploadedUrl) {
        uploadedUrl = await readFileAsDataURL(file);
      }

      uploadedUrls.push(uploadedUrl);
    }


    setFormData((prev) => {
      const existing = prev.images.filter((img) => img !== "/images/note_200_temple_tooth_1998.jpg" || prev.title.includes("200"));
      const combined = [...existing, ...uploadedUrls].slice(0, 8);
      return {
        ...prev,
        images: combined,
        imageUrl: combined[0] || prev.imageUrl,
      };
    });

    setIsUploading(false);
    setUploadStatusMsg(`✅ ${uploadedUrls.length} photo(s) added successfully!`);
    setTimeout(() => setUploadStatusMsg(""), 4000);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    setFormData((prev) => {
      const updated = [...prev.images, manualUrlInput.trim()];
      return {
        ...prev,
        images: updated,
        imageUrl: updated[0] || prev.imageUrl,
      };
    });
    setManualUrlInput("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const filteredImages = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: filteredImages,
        imageUrl: filteredImages[0] || "/images/note_200_temple_tooth_1998.jpg",
      };
    });
  };

  const handleSetPrimaryImage = (indexToSetPrimary: number) => {
    setFormData((prev) => {
      const selected = prev.images[indexToSetPrimary];
      const others = prev.images.filter((_, idx) => idx !== indexToSetPrimary);
      const reordered = [selected, ...others];
      return {
        ...prev,
        images: reordered,
        imageUrl: selected,
      };
    });
  };

  const filtered = items.filter(
    (it) =>
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      it.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      it.country.toLowerCase().includes(search.toLowerCase())
  );

  const totalValuation = items.reduce((acc, curr) => acc + curr.price, 0);
  const totalSold = items.filter((it) => it.is_sold).length;

  const toggleSoldStatus = async (id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const newStatus = !item.is_sold;
    
    // Update local state and local storage immediately
    const updatedItems = items.map((it) => (it.id === id ? { ...it, is_sold: newStatus } : it));
    setItems(updatedItems);
    saveLocalCurrencies(updatedItems);

    try {
      // 1. Sync to API route
      await fetch("/api/currencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItems),
      });
      // 2. Update in Supabase
      await supabase.from("currencies").update({ is_sold: newStatus }).eq("id", id);
    } catch (err) {
      console.warn("Toggle sync fallback:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this item from the vault catalog?")) {
      const updatedItems = items.filter((it) => it.id !== id);
      setItems(updatedItems);
      saveLocalCurrencies(updatedItems);

      try {
        // 1. Sync to API route
        await fetch(`/api/currencies?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        // 2. Delete in Supabase
        await supabase.from("currencies").delete().eq("id", id);
      } catch (err) {
        console.warn("Delete sync fallback:", err);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSku = formData.itemCode.trim() || autoGenerateSku(formData.category, formData.country, formData.year, formData.title);
    const finalImages = formData.images.length > 0 ? formData.images : [formData.imageUrl || "/images/note_200_temple_tooth_1998.jpg"];

    const newItem: CurrencyItem = {
      id: "vault-" + Date.now(),
      title: formData.title,
      itemCode: finalSku,
      country: formData.country,
      year: Number(formData.year),
      price: Number(formData.price),
      category: formData.category,
      condition_grade: formData.condition_grade,
      imageUrl: finalImages[0],
      images: finalImages,
      description: formData.description,
      is_sold: false,
      created_at: new Date().toISOString(),
    };

    // Save to state & local storage immediately
    const updated = [newItem, ...items];
    setItems(updated);
    saveLocalCurrencies(updated);
    setShowAddModal(false);
    resetFormData();

    try {
      // 1. Sync directly to Next.js API route
      await fetch("/api/currencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      // 2. Insert directly into Supabase Cloud Database
      const { data, error } = await supabase.from("currencies").insert([
        {
          title: newItem.title,
          item_code: newItem.itemCode,
          country: newItem.country,
          year: newItem.year,
          price: newItem.price,
          category: newItem.category,
          condition_grade: newItem.condition_grade,
          image_url: JSON.stringify(finalImages),
          description: newItem.description,
          is_sold: false,
        },
      ]).select();

      if (!error && data && data.length > 0) {
        const savedRow = data[0];
        const apiItem: CurrencyItem = {
          id: String(savedRow.id),
          title: savedRow.title,
          itemCode: savedRow.item_code || newItem.itemCode,
          country: savedRow.country,
          year: savedRow.year,
          price: savedRow.price,
          category: savedRow.category,
          condition_grade: savedRow.condition_grade,
          imageUrl: finalImages[0],
          images: finalImages,
          description: savedRow.description,
          is_sold: savedRow.is_sold,
          created_at: savedRow.created_at,
        };

        const reconciled = [apiItem, ...items.filter((i) => i.id !== newItem.id)];
        setItems(reconciled);
        saveLocalCurrencies(reconciled);
      }
    } catch (err) {
      console.warn("Catalog sync fallback:", err);
    }
  };



  const resetFormData = () => {
    setFormData({
      title: "",
      itemCode: "",
      country: "Sri Lanka",
      year: 1980,
      price: 15000,
      category: "banknote",
      condition_grade: "UNC (Uncirculated)",
      imageUrl: "/images/note_200_temple_tooth_1998.jpg",
      images: ["/images/note_200_temple_tooth_1998.jpg"],
      description: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0a08] text-[#f8f6f0] p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d4af37]/20">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-[#17130e] border border-[#d4af37]/30 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#0c0a08] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-md shrink-0">
                  <Image
                    src="/images/logo.jpg"
                    alt="තම්බපණ්ණි නාණක Logo"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#f8f6f0]">
                  Admin Vault &amp; Inventory Suite
                </h1>
              </div>
              <p className="text-xs text-[#b8af9e] font-mono mt-0.5">
                Manage live numismatic catalog, multi-angle photos (3-4 images), valuations, and sold inventory.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="password"
              placeholder="Admin API Secret Token"
              value={adminToken}
              onChange={(e) => handleTokenChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#14100c] border border-[#d4af37]/30 text-xs text-[#f8f6f0] focus:outline-none focus:border-[#d4af37]"
            />
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear all catalog items? This will remove all items from the view.")) {
                  setItems([]);
                  saveLocalCurrencies([]);
                }
              }}
              className="px-3.5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/40 text-rose-300 font-semibold text-xs transition-colors"
              title="Clear all catalog items"
            >
              Clear Catalog
            </button>
            <button
              onClick={() => {
                if (confirm("Reset to default 10 authentic catalog items?")) {
                  setItems(DEFAULT_CURRENCIES);
                  saveLocalCurrencies(DEFAULT_CURRENCIES);
                }
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#1e1710] hover:bg-[#2a2016] border border-[#d4af37]/30 text-[#f3e5ab] font-semibold text-xs transition-colors"
              title="Reset default template items"
            >
              Reset Defaults
            </button>
            <button
              onClick={() => {
                const initSku = autoGenerateSku("banknote", "Sri Lanka", 1980, "");
                setFormData({
                  title: "",
                  itemCode: initSku,
                  country: "Sri Lanka",
                  year: 1980,
                  price: 15000,
                  category: "banknote",
                  condition_grade: "UNC (Uncirculated)",
                  imageUrl: "/images/note_200_temple_tooth_1998.jpg",
                  images: ["/images/note_200_temple_tooth_1998.jpg"],
                  description: "",
                });
                setShowAddModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#0c0a08] font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Currency Item</span>
            </button>
          </div>
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#14100c] border border-[#d4af37]/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[#a69d8d] uppercase">Total Catalog Items</span>
              <div className="text-2xl font-bold font-serif text-[#f8f6f0] mt-1">{items.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#201912] text-[#d4af37]">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#14100c] border border-[#d4af37]/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[#a69d8d] uppercase">Total Vault Valuation</span>
              <div className="text-2xl font-bold font-serif text-[#e5c158] mt-1">
                {formatLKR(totalValuation)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#201912] text-[#d4af37]">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#14100c] border border-[#d4af37]/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[#a69d8d] uppercase">Available vs Sold</span>
              <div className="text-2xl font-bold font-serif text-[#f8f6f0] mt-1">
                {items.length - totalSold} / <span className="text-rose-400">{totalSold} Sold</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#201912] text-[#d4af37]">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#14100c] border border-[#d4af37]/20 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8c8273] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalog by title, SKU or country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0d0b09] border border-[#d4af37]/30 text-xs text-[#f8f6f0] placeholder-[#6b6255] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <span className="text-xs font-mono text-[#a69d8d]">
            Showing {filtered.length} of {items.length} records
          </span>
        </div>

        {/* Currency Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#d4af37]/20 bg-[#120f0c] shadow-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#1a140f] border-b border-[#d4af37]/20 text-[#f3e5ab] uppercase tracking-wider">
              <tr>
                <th className="p-4">Item Photos</th>
                <th className="p-4">SKU / Code</th>
                <th className="p-4">Title &amp; Country</th>
                <th className="p-4">Grade</th>
                <th className="p-4">LKR Valuation</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#d4cdbf]">
              {filtered.map((it) => {
                const itemImgs = getItemImages(it);
                return (
                  <tr key={it.id} className="hover:bg-[#18130e]/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden border border-[#d4af37]/30 bg-black shrink-0">
                          <Image
                            src={itemImgs[0]}
                            alt={it.title}
                            fill
                            sizes="60px"
                            className="object-cover"
                          />
                        </div>
                        {itemImgs.length > 1 && (
                          <span className="px-1.5 py-0.5 rounded bg-[#1e1710] border border-[#d4af37]/30 text-[10px] text-[#f3e5ab] font-bold">
                            +{itemImgs.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#e5c158]">{it.itemCode}</td>
                    <td className="p-4">
                      <div className="font-sans font-semibold text-white text-sm">{it.title}</div>
                      <div className="text-[11px] text-[#8c8273]">{it.country} ({it.year})</div>
                    </td>
                    <td className="p-4">{it.condition_grade}</td>
                    <td className="p-4 font-bold text-white font-serif text-sm">
                      {formatLKR(it.price)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleSoldStatus(it.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                          it.is_sold
                            ? "bg-rose-950 text-rose-300 border border-rose-600/40"
                            : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                        }`}
                      >
                        {it.is_sold ? "Sold Out" : "Available"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(it.id)}
                        className="p-2 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-colors"
                        title="Delete from Catalog"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Enhanced Add Item Modal with Multi-Image Upload (Cloudinary) */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#14100c] border border-[#d4af37]/40 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="font-serif text-xl font-bold text-[#f8f6f0]">
                    Add New Numismatic Item
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full bg-[#1e1710] text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#0c0a08] transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
                {/* 1. Quick Select Preset Template */}
                <div className="p-3.5 rounded-2xl bg-[#1b150f] border border-[#d4af37]/35 space-y-1.5">
                  <label className="block text-[#f3e5ab] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡ Quick-Fill from Catalog Preset (පෙර සැකසුම් තෝරන්න)</span>
                  </label>
                  <select
                    onChange={(e) => handlePresetSelect(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0c0a] border border-[#d4af37]/40 text-[#f8f6f0] text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    {PRESET_TEMPLATES.map((tmpl, idx) => (
                      <option key={idx} value={idx}>
                        {tmpl.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-[#8c8273]">
                    Selecting a preset will instantly auto-fill all item details, SKU, and all archival multi-angle photos.
                  </p>
                </div>

                {/* 2. Multi-Image Upload & Management Suite (Upload 3-4 images) */}
                <div className="p-4 rounded-2xl bg-[#1b150f] border border-[#d4af37]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[#f3e5ab] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <Images className="w-4 h-4 text-[#d4af37]" />
                      <span>Item Multi-Image Vault (පින්තූර 3-4ක් Upload කරන්න)</span>
                    </label>
                    <span className="text-[10px] text-[#a69d8d]">
                      {formData.images.length} Image(s) Attached
                    </span>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageFilesSelected(e.target.files)}
                    className="hidden"
                  />

                  {/* Drag and Drop / Upload Button Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#d4af37]/40 hover:border-[#d4af37] rounded-xl p-5 text-center bg-[#0e0c0a] cursor-pointer transition-all hover:bg-[#14100c] space-y-2 group"
                  >
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#201912] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-white font-semibold text-xs block">
                        Click or Drag &amp; Drop to Upload Multiple Photos
                      </span>
                      <span className="text-[10px] text-[#8c8273] block mt-0.5">
                        Upload Obverse (Front), Reverse (Back), and Watermark / Macro close-ups (Supports PNG, JPG, WebP)
                      </span>
                    </div>
                  </div>

                  {/* Upload Status Banner */}
                  {uploadStatusMsg && (
                    <div className="p-2.5 rounded-xl bg-[#261d12] border border-[#d4af37]/30 text-xs text-[#f3e5ab] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                      <span>{uploadStatusMsg}</span>
                    </div>
                  )}

                  {/* Uploaded Images Gallery / Thumbnail Grid */}
                  {formData.images.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[10px] text-[#a69d8d] uppercase tracking-wider">
                        Attached Images (First photo is Primary Catalog Visual):
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {formData.images.map((imgUrl, idx) => {
                          const labels = ["1. Primary (Front)", "2. Reverse (Back)", "3. Watermark", "4. Detail"];
                          const label = labels[idx] || `${idx + 1}. Photo`;

                          return (
                            <div
                              key={idx}
                              className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-black group/card transition-all ${
                                idx === 0 ? "border-[#d4af37] shadow-md shadow-[#d4af37]/20" : "border-[#d4af37]/30"
                              }`}
                            >
                              <Image
                                src={imgUrl}
                                alt={`Uploaded ${idx + 1}`}
                                fill
                                sizes="140px"
                                className="object-cover"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 opacity-80" />

                              {/* Primary Star Indicator */}
                              {idx === 0 ? (
                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#d4af37] text-black text-[9px] font-bold flex items-center gap-0.5 shadow">
                                  <Star className="w-2.5 h-2.5 fill-black" />
                                  <span>Primary</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(idx)}
                                  className="absolute top-1.5 left-1.5 p-1 rounded bg-black/80 hover:bg-[#d4af37] text-white hover:text-black transition-colors opacity-0 group-hover/card:opacity-100"
                                  title="Set as Primary"
                                >
                                  <Star className="w-3 h-3" />
                                </button>
                              )}

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-1.5 right-1.5 p-1 rounded bg-rose-950/80 hover:bg-rose-600 text-rose-200 hover:text-white transition-colors"
                                title="Remove photo"
                              >
                                <X className="w-3 h-3" />
                              </button>

                              <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-mono text-white truncate font-semibold">
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Manual URL Input Bar (Alternative) */}
                  <div className="pt-2 border-t border-white/5 flex gap-2">
                    <input
                      type="text"
                      placeholder="Or paste direct image URL (e.g. https://res.cloudinary.com/...)"
                      value={manualUrlInput}
                      onChange={(e) => setManualUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#0d0b09] border border-[#d4af37]/25 text-[11px] text-white focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualUrl}
                      className="px-3 py-1.5 rounded-lg bg-[#241c14] border border-[#d4af37]/40 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-black font-semibold text-[11px] transition-colors shrink-0"
                    >
                      + Add URL
                    </button>
                  </div>
                </div>

                {/* 3. Item Title */}
                <div>
                  <label className="block text-[#a69d8d] mb-1">Item Title (නම)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1979 Central Bank of Ceylon 2 Rupees"
                    value={formData.title}
                    onChange={(e) =>
                      handleTitleOrYearChange(e.target.value, formData.year, formData.category, formData.country)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0b09] border border-[#d4af37]/30 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* 4. SKU / Item Code (Auto-generated with manual override) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#a69d8d]">SKU / Item Code (Auto Generated)</label>
                      <button
                        type="button"
                        onClick={() => {
                          const newCode = autoGenerateSku(
                            formData.category,
                            formData.country,
                            formData.year,
                            formData.title
                          );
                          setFormData({ ...formData, itemCode: newCode });
                        }}
                        className="text-[10px] text-[#d4af37] hover:underline flex items-center gap-1 font-sans font-semibold"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-generate</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. CEY-1979-2R"
                      value={formData.itemCode}
                      onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0b09] border border-[#d4af37]/30 text-[#e5c158] font-bold focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a69d8d] mb-1">Country / Reign (රට / යුගය)</label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) =>
                        handleTitleOrYearChange(formData.title, formData.year, formData.category, e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0b09] border border-[#d4af37]/30 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* 5. Year, Price & Category */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#a69d8d] mb-1">Year (වර්ෂය)</label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) =>
                        handleTitleOrYearChange(
                          formData.title,
                          Number(e.target.value),
                          formData.category,
                          formData.country
                        )
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0b09] border border-[#d4af37]/30 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a69d8d] mb-1">Price in LKR (මිල)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0b09] border border-[#d4af37]/30 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a69d8d] mb-1">Category (වර්ගය)</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleTitleOrYearChange(
                          formData.title,
                          formData.year,
                          e.target.value,
                          formData.country
                        )
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0b09] border border-[#d4af37]/30 text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="banknote">💵 Banknote (නෝට්ටු)</option>
                      <option value="coin">🪙 Coin (කාසි)</option>
                      <option value="token">🏷️ Token (ටෝකන්)</option>
                    </select>
                  </div>
                </div>

                {/* 6. Condition Grade Dropdown */}
                <div>
                  <label className="block text-[#a69d8d] mb-1">
                    Condition Grade (තත්ත්ව ශ්‍රේණිය)
                  </label>
                  <select
                    value={formData.condition_grade}
                    onChange={(e) => setFormData({ ...formData, condition_grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0b09] border border-[#d4af37]/30 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {CONDITION_GRADES.map((grade, idx) => (
                      <option key={idx} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7. Historical Description */}
                <div>
                  <label className="block text-[#a69d8d] mb-1">Historical Description (විස්තරය)</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter provenance, engraved artwork, security features or history..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0b09] border border-[#d4af37]/30 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#1e1710] text-[#a69d8d] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-[#0c0a08] font-bold hover:bg-[#e5c158] transition-colors"
                  >
                    Save &amp; Publish to Catalog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
