-- Add loyalty tiers tracking to user_profiles (points column already exists)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS loyalty_tier TEXT DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
ADD COLUMN IF NOT EXISTS total_orders INT DEFAULT 0;

-- Create loyalty tiers configuration table
CREATE TABLE IF NOT EXISTS public.loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  min_points INT NOT NULL,
  max_points INT,
  benefits TEXT,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create special offers table
CREATE TABLE IF NOT EXISTS public.special_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create combo/bundle meals table
CREATE TABLE IF NOT EXISTS public.combo_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  original_price DECIMAL(10, 2) NOT NULL,
  combo_price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create combo items junction table
CREATE TABLE IF NOT EXISTS public.combo_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES public.combo_meals(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1
);

-- Create scheduled orders table
CREATE TABLE IF NOT EXISTS public.scheduled_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create group orders table
CREATE TABLE IF NOT EXISTS public.group_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  group_code TEXT NOT NULL UNIQUE,
  group_name TEXT,
  total_cost DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'locked', 'completed', 'cancelled')),
  deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create group order members table
CREATE TABLE IF NOT EXISTS public.group_order_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_order_id UUID NOT NULL REFERENCES public.group_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  items_cost DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid'))
);

-- Create leaderboard view (for points ranking)
CREATE OR REPLACE VIEW public.points_leaderboard AS
SELECT 
  id,
  email,
  full_name,
  points,
  loyalty_tier,
  total_orders,
  ROW_NUMBER() OVER (ORDER BY points DESC) as rank
FROM public.user_profiles
WHERE role = 'student'
ORDER BY points DESC;

-- Create indexes for performance
CREATE INDEX idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_special_offers_active ON public.special_offers(is_active, end_date);
CREATE INDEX idx_combo_meals_active ON public.combo_meals(is_active);
CREATE INDEX idx_scheduled_orders_user ON public.scheduled_orders(user_id, scheduled_time);
CREATE INDEX idx_group_orders_creator ON public.group_orders(creator_id);
CREATE INDEX idx_user_points ON public.user_profiles(points DESC);
