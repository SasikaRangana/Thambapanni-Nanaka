import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rwatywlucdmakmmjcfjf.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YXR5d2x1Y2RtYWttbWpjZmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MzM1ODEsImV4cCI6MjEwMjUwOTU4MX0.OZ3bgszetOL1Ug0Iw53yI_B-dgriMjIYlG4CnEDajP4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
