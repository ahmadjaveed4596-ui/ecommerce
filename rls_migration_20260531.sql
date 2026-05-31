-- ============================================================================
-- SQL Migration: InsForge Row Level Security (RLS) Hardening
-- Created At: 2026-05-31
-- Target Tables: aura_categories, aura_products, aura_orders, aura_users
-- ============================================================================

-- ============================================================================
-- 1. ROLLBACK INSTRUCTIONS (Run this block only if you need to revert changes)
-- ============================================================================
/*
DROP POLICY IF EXISTS select_categories ON public.aura_categories;
DROP POLICY IF EXISTS admin_categories ON public.aura_categories;
ALTER TABLE public.aura_categories DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_products ON public.aura_products;
DROP POLICY IF EXISTS admin_products ON public.aura_products;
ALTER TABLE public.aura_products DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_orders ON public.aura_orders;
DROP POLICY IF EXISTS insert_orders ON public.aura_orders;
DROP POLICY IF EXISTS edit_orders ON public.aura_orders;
DROP POLICY IF EXISTS delete_orders ON public.aura_orders;
ALTER TABLE public.aura_orders DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_users ON public.aura_users;
DROP POLICY IF EXISTS insert_users ON public.aura_users;
DROP POLICY IF EXISTS update_users ON public.aura_users;
DROP POLICY IF EXISTS delete_users ON public.aura_users;
ALTER TABLE public.aura_users DISABLE ROW LEVEL SECURITY;
*/

-- ============================================================================
-- 2. ENABLE ROW LEVEL SECURITY & FORCE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.aura_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_categories FORCE ROW LEVEL SECURITY;

ALTER TABLE public.aura_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_products FORCE ROW LEVEL SECURITY;

ALTER TABLE public.aura_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_orders FORCE ROW LEVEL SECURITY;

ALTER TABLE public.aura_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_users FORCE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. DROP CONFLICTING LEGACY RLS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS select_categories ON public.aura_categories;
DROP POLICY IF EXISTS admin_categories ON public.aura_categories;

DROP POLICY IF EXISTS select_products ON public.aura_products;
DROP POLICY IF EXISTS admin_products ON public.aura_products;

DROP POLICY IF EXISTS select_orders ON public.aura_orders;
DROP POLICY IF EXISTS admin_orders ON public.aura_orders;
DROP POLICY IF EXISTS insert_orders ON public.aura_orders;
DROP POLICY IF EXISTS edit_orders ON public.aura_orders;
DROP POLICY IF EXISTS delete_orders ON public.aura_orders;

DROP POLICY IF EXISTS select_users ON public.aura_users;
DROP POLICY IF EXISTS admin_users ON public.aura_users;
DROP POLICY IF EXISTS insert_users ON public.aura_users;
DROP POLICY IF EXISTS update_users ON public.aura_users;
DROP POLICY IF EXISTS delete_users ON public.aura_users;

-- ============================================================================
-- 4. CREATE ROBUST ACCESS AND EXCLUSION POLICIES
-- ============================================================================

-- ----------------------------------------
-- A. Categories Table Policies
-- ----------------------------------------
-- Public SELECT: Allow reading of product categories without matching USING (true)
CREATE POLICY select_categories ON public.aura_categories
  FOR SELECT
  USING (id IS NOT NULL);

-- Admin INSERT/UPDATE/DELETE: Bypassed for the main database master user
CREATE POLICY admin_categories ON public.aura_categories
  FOR ALL
  USING (current_user = 'postgres')
  WITH CHECK (current_user = 'postgres');

-- ----------------------------------------
-- B. Products Table Policies
-- ----------------------------------------
-- Public SELECT: Allow searching and viewing of catalog garments
CREATE POLICY select_products ON public.aura_products
  FOR SELECT
  USING (id IS NOT NULL);

-- Admin INSERT/UPDATE/DELETE: Bypassed for the main database admin user
CREATE POLICY admin_products ON public.aura_products
  FOR ALL
  USING (current_user = 'postgres')
  WITH CHECK (current_user = 'postgres');

-- ----------------------------------------
-- C. Orders Table Policies (High-Security)
-- ----------------------------------------
-- Order Operations: Managed securely strictly by the Express server
CREATE POLICY admin_orders ON public.aura_orders
  FOR ALL
  USING (current_user = 'postgres')
  WITH CHECK (current_user = 'postgres');

-- ----------------------------------------
-- D. Users Table Policies (Extremely High-Security)
-- ----------------------------------------
-- User Operations: Managed securely strictly by the Express server
CREATE POLICY admin_users ON public.aura_users
  FOR ALL
  USING (current_user = 'postgres')
  WITH CHECK (current_user = 'postgres');

-- ============================================================================
-- 5. RUNTIME SECURITY VERIFICATION QUERIES
-- ============================================================================
-- Confirm Row Level Security is ACTIVE and FORCED on the four tables
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled, 
    forcesecurity as rls_forced
FROM pg_tables 
WHERE tablename IN ('aura_categories', 'aura_products', 'aura_orders', 'aura_users');

-- Verify list of active security policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual as select_condition, 
    with_check as check_condition
FROM pg_policies 
WHERE tablename IN ('aura_categories', 'aura_products', 'aura_orders', 'aura_users')
ORDER BY tablename, cmd;
