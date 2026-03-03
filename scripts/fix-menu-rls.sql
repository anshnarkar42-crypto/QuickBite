-- Disable RLS on menu_items (it's public data that doesn't need RLS)
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;

-- Disable RLS on categories (it's public reference data)
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;

-- Drop all problematic policies from menu_items if they exist
DROP POLICY IF EXISTS "Everyone can view available menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Admins can manage menu items" ON public.menu_items;
