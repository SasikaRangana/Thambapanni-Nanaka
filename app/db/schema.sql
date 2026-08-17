-- =========================================================================
-- THAMBAPANNI NANAKA - Database Schema & Supabase Realtime Setup
-- Execute this script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create currencies table
CREATE TABLE IF NOT EXISTS public.currencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    item_code VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(50) DEFAULT 'coin', -- coin, banknote, token, medal, ancient
    description TEXT DEFAULT '',
    image_url TEXT NOT NULL,
    condition_grade VARCHAR(50) NOT NULL, -- e.g. UNC, VF, XF, Fair, Gem Uncirculated
    is_sold BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create helpful indexes for ultra-fast filtering and searching
CREATE INDEX IF NOT EXISTS idx_currencies_country ON public.currencies (country);
CREATE INDEX IF NOT EXISTS idx_currencies_year ON public.currencies (year);
CREATE INDEX IF NOT EXISTS idx_currencies_is_sold ON public.currencies (is_sold);
CREATE INDEX IF NOT EXISTS idx_currencies_item_code ON public.currencies (item_code);
CREATE INDEX IF NOT EXISTS idx_currencies_category ON public.currencies (category);
CREATE INDEX IF NOT EXISTS idx_currencies_created_at ON public.currencies (created_at DESC);

-- 4. Automatically update updated_at timestamp on record update
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_currencies_updated_at ON public.currencies;
CREATE TRIGGER set_currencies_updated_at
BEFORE UPDATE ON public.currencies
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active and sold items for gallery viewing
CREATE POLICY "Public Read Access"
ON public.currencies
FOR SELECT
USING (true);

-- Allow service role / backend API full CRUD operations
CREATE POLICY "Service Role Full Access"
ON public.currencies
FOR ALL
USING (auth.role() = 'service_role' OR auth.role() = 'anon')
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'anon');

-- 6. Enable Supabase Realtime for the currencies table
-- This enables Next.js frontend to receive instant live events on inventory changes (new items, sold toggles)
ALTER PUBLICATION supabase_realtime ADD TABLE public.currencies;
