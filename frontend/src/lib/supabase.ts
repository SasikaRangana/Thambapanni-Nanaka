import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rwatywlucdmakmmjcjfj.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YXR5d2x1Y2RtYWttbWpjamZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MTUwODAsImV4cCI6MjA1NTM5MTA4MH0.w1V8K2G4b1e7L8e8p0_placeholder";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

