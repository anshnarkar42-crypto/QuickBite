-- Delete existing menu items and categories to start fresh
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.menu_items;
DELETE FROM public.categories;

-- Seed Categories
INSERT INTO public.categories (name, description) VALUES
  ('Breakfast', 'Morning specials to start your day'),
  ('Lunch', 'Hearty lunch options'),
  ('Snacks', 'Light bites and snacks'),
  ('Beverages', 'Drinks and beverages'),
  ('Desserts', 'Sweet treats')
ON CONFLICT DO NOTHING;

-- Seed Menu Items - BREAKFAST (5 items)
INSERT INTO public.menu_items (name, description, price, category_id, is_available, image_url) VALUES
  ('Masala Dosa', 'Crispy dosa with potato and vegetable filling', 80.00, (SELECT id FROM public.categories WHERE name = 'Breakfast'), true, NULL),
  ('Idli with Sambar', 'Fluffy steamed rice cakes with lentil stew', 60.00, (SELECT id FROM public.categories WHERE name = 'Breakfast'), true, NULL),
  ('Aloo Paratha', 'Layered bread with spiced potato filling', 75.00, (SELECT id FROM public.categories WHERE name = 'Breakfast'), true, NULL),
  ('Poha', 'Flattened rice with vegetables and peanuts', 50.00, (SELECT id FROM public.categories WHERE name = 'Breakfast'), true, NULL),
  ('Omelette with Toast', 'Three-egg omelette with buttered toast', 55.00, (SELECT id FROM public.categories WHERE name = 'Breakfast'), true, NULL)
ON CONFLICT DO NOTHING;

-- Seed Menu Items - LUNCH (5 items)
INSERT INTO public.menu_items (name, description, price, category_id, is_available, image_url) VALUES
  ('Chicken Biryani', 'Fragrant basmati rice with marinated chicken and spices', 180.00, (SELECT id FROM public.categories WHERE name = 'Lunch'), true, '/menu/biryani.jpg'),
  ('Margherita Pizza', 'Fresh mozzarella, tomato sauce, and basil on crispy dough', 200.00, (SELECT id FROM public.categories WHERE name = 'Lunch'), true, '/menu/pizza.jpg'),
  ('Deluxe Burger', 'Juicy beef patty with lettuce, tomato, and cheese', 120.00, (SELECT id FROM public.categories WHERE name = 'Lunch'), true, '/menu/burger.jpg'),
  ('Pasta Carbonara', 'Creamy Italian pasta with bacon and parmesan cheese', 160.00, (SELECT id FROM public.categories WHERE name = 'Lunch'), true, '/menu/pasta.jpg'),
  ('Vegetable Biryani', 'Fragrant basmati rice with mixed vegetables and herbs', 140.00, (SELECT id FROM public.categories WHERE name = 'Lunch'), true, NULL)
ON CONFLICT DO NOTHING;

-- Seed Menu Items - SNACKS (5 items)
INSERT INTO public.menu_items (name, description, price, category_id, is_available, image_url) VALUES
  ('Samosa', 'Crispy triangular pastry with spiced potato and peas filling', 30.00, (SELECT id FROM public.categories WHERE name = 'Snacks'), true, '/menu/samosa.jpg'),
  ('Paneer Tikka', 'Grilled cottage cheese cubes marinated in yogurt and spices', 85.00, (SELECT id FROM public.categories WHERE name = 'Snacks'), true, '/menu/paneer-tikka.jpg'),
  ('Spring Rolls', 'Crispy rolls with mixed vegetables and sweet dipping sauce', 45.00, (SELECT id FROM public.categories WHERE name = 'Snacks'), true, NULL),
  ('Vegetable Pakora', 'Battered and fried vegetable fritters with mint chutney', 40.00, (SELECT id FROM public.categories WHERE name = 'Snacks'), true, NULL),
  ('Garlic Bread', 'Toasted bread with garlic butter and herbs', 70.00, (SELECT id FROM public.categories WHERE name = 'Snacks'), true, NULL)
ON CONFLICT DO NOTHING;

-- Seed Menu Items - BEVERAGES (5 items)
INSERT INTO public.menu_items (name, description, price, category_id, is_available, image_url) VALUES
  ('Masala Chai', 'Spiced milk tea with ginger and cardamom', 25.00, (SELECT id FROM public.categories WHERE name = 'Beverages'), true, NULL),
  ('Fresh Orange Juice', 'Freshly squeezed orange juice without pulp', 50.00, (SELECT id FROM public.categories WHERE name = 'Beverages'), true, NULL),
  ('Cappuccino', 'Creamy coffee with milk foam and chocolate powder', 80.00, (SELECT id FROM public.categories WHERE name = 'Beverages'), true, '/menu/coffee.jpg'),
  ('Mango Lassi', 'Thick yogurt-based mango smoothie', 60.00, (SELECT id FROM public.categories WHERE name = 'Beverages'), true, NULL),
  ('Cold Lemonade', 'Refreshing lemon juice with mint and ice', 30.00, (SELECT id FROM public.categories WHERE name = 'Beverages'), true, NULL)
ON CONFLICT DO NOTHING;

-- Seed Menu Items - DESSERTS (5 items)
INSERT INTO public.menu_items (name, description, price, category_id, is_available, image_url) VALUES
  ('Gulab Jamun', 'Soft milk solids soaked in aromatic sugar syrup', 45.00, (SELECT id FROM public.categories WHERE name = 'Desserts'), true, NULL),
  ('Kheer', 'Creamy rice pudding with condensed milk and dry nuts', 50.00, (SELECT id FROM public.categories WHERE name = 'Desserts'), true, NULL),
  ('Jalebi', 'Spiraled sweet fried dough in orange sugar syrup', 35.00, (SELECT id FROM public.categories WHERE name = 'Desserts'), true, NULL),
  ('Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and whipped cream', 60.00, (SELECT id FROM public.categories WHERE name = 'Desserts'), true, '/menu/ice-cream.jpg'),
  ('Chocolate Brownie', 'Rich chocolate brownie with walnuts and fudge', 65.00, (SELECT id FROM public.categories WHERE name = 'Desserts'), true, NULL)
ON CONFLICT DO NOTHING;
