-- Seed Special Offers
INSERT INTO public.special_offers (title, description, discount_type, discount_value, start_date, end_date, is_active) VALUES
  ('Lunch Hour Special', '20% off on all lunch items between 12-2 PM', 'percentage', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', true),
  ('Breakfast Deal', 'Get 50 points bonus on breakfast orders', 'fixed', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', true),
  ('Friday Feast', '₹100 discount on orders above ₹500', 'fixed', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', true),
  ('Happy Hour', '15% off on beverages and desserts', 'percentage', 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '15 days', true)
ON CONFLICT DO NOTHING;

-- Seed Combo Meals
INSERT INTO public.combo_meals (name, description, original_price, combo_price, is_active) VALUES
  ('Biryani Combo', 'Chicken Biryani + Lassi + Dessert', 350, 299, true),
  ('Pizza Combo', 'Margherita Pizza + Cold Drink + Garlic Bread', 400, 329, true),
  ('Breakfast Combo', 'Masala Dosa + Idli + Sambar + Tea', 220, 179, true),
  ('Student Pack', 'Burger + Fries + Juice', 250, 199, true),
  ('Premium Lunch', 'Chicken Biryani + Paneer Tikka + Lassi + Brownie', 500, 399, true)
ON CONFLICT DO NOTHING;

-- Seed Combo Items (linking menu items to combos)
-- Biryani Combo items
INSERT INTO public.combo_items (combo_id, menu_item_id, quantity) 
SELECT 
  (SELECT id FROM public.combo_meals WHERE name = 'Biryani Combo'),
  (SELECT id FROM public.menu_items WHERE name = 'Chicken Biryani'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.combo_items WHERE 
  combo_id = (SELECT id FROM public.combo_meals WHERE name = 'Biryani Combo')
);

-- Pizza Combo items
INSERT INTO public.combo_items (combo_id, menu_item_id, quantity)
SELECT
  (SELECT id FROM public.combo_meals WHERE name = 'Pizza Combo'),
  (SELECT id FROM public.menu_items WHERE name = 'Margherita Pizza'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.combo_items WHERE
  combo_id = (SELECT id FROM public.combo_meals WHERE name = 'Pizza Combo')
);

-- Breakfast Combo items
INSERT INTO public.combo_items (combo_id, menu_item_id, quantity)
SELECT
  (SELECT id FROM public.combo_meals WHERE name = 'Breakfast Combo'),
  (SELECT id FROM public.menu_items WHERE name = 'Masala Dosa'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.combo_items WHERE
  combo_id = (SELECT id FROM public.combo_meals WHERE name = 'Breakfast Combo')
);

-- Student Pack items
INSERT INTO public.combo_items (combo_id, menu_item_id, quantity)
SELECT
  (SELECT id FROM public.combo_meals WHERE name = 'Student Pack'),
  (SELECT id FROM public.menu_items WHERE name = 'Deluxe Burger'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.combo_items WHERE
  combo_id = (SELECT id FROM public.combo_meals WHERE name = 'Student Pack')
);

-- Premium Lunch items  
INSERT INTO public.combo_items (combo_id, menu_item_id, quantity)
SELECT
  (SELECT id FROM public.combo_meals WHERE name = 'Premium Lunch'),
  (SELECT id FROM public.menu_items WHERE name = 'Chicken Biryani'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.combo_items WHERE
  combo_id = (SELECT id FROM public.combo_meals WHERE name = 'Premium Lunch')
);
