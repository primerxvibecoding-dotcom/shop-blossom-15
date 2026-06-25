
-- Seed categories (parents + sub-categories) and products with images

INSERT INTO public.categories (slug, name, icon, position, parent_id) VALUES
  ('electronics', 'Electronics', 'Smartphone', 1, NULL),
  ('fashion', 'Fashion & Accessories', 'Shirt', 2, NULL),
  ('home-living', 'Home & Living', 'Lamp', 3, NULL),
  ('beauty', 'Health & Beauty', 'Sparkles', 4, NULL),
  ('gifts-toys', 'Gifts & Toys', 'Gift', 5, NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (slug, name, icon, position, parent_id) VALUES
  ('smartphones', 'Smartphones', 'Smartphone', 1, (SELECT id FROM public.categories WHERE slug='electronics')),
  ('laptops', 'Laptops', 'Cpu', 2, (SELECT id FROM public.categories WHERE slug='electronics')),
  ('audio', 'Audio & Headphones', 'Cpu', 3, (SELECT id FROM public.categories WHERE slug='electronics')),
  ('men', 'Men', 'Shirt', 1, (SELECT id FROM public.categories WHERE slug='fashion')),
  ('women', 'Women', 'Shirt', 2, (SELECT id FROM public.categories WHERE slug='fashion')),
  ('bags', 'Bags & Shoes', 'ShoppingBag', 3, (SELECT id FROM public.categories WHERE slug='fashion')),
  ('furniture', 'Furniture', 'BedDouble', 1, (SELECT id FROM public.categories WHERE slug='home-living')),
  ('decor', 'Decor', 'Lamp', 2, (SELECT id FROM public.categories WHERE slug='home-living')),
  ('bathroom', 'Bathroom', 'Bath', 3, (SELECT id FROM public.categories WHERE slug='home-living'))
ON CONFLICT (slug) DO NOTHING;

-- Products
WITH new_products AS (
  INSERT INTO public.products (slug, name, short_description, description, price, compare_at_price, stock, is_active, is_featured, is_deal, category_id, rating_avg, rating_count)
  VALUES
    ('iphone-15-pro', 'iPhone 15 Pro 256GB', 'Titanium body, A17 Pro chip', 'The most powerful iPhone yet with a titanium design and A17 Pro chip.', 1199.00, 1299.00, 25, true, true, true, (SELECT id FROM public.categories WHERE slug='smartphones'), 4.8, 124),
    ('macbook-air-m3', 'MacBook Air M3 13"', 'Ultra-thin laptop with M3 chip', 'Apple M3 chip, 8GB RAM, 256GB SSD, 13.6" Liquid Retina display.', 1099.00, 1199.00, 15, true, true, false, (SELECT id FROM public.categories WHERE slug='laptops'), 4.9, 87),
    ('sony-wh1000xm5', 'Sony WH-1000XM5 Headphones', 'Industry-leading noise cancellation', 'Wireless noise-cancelling over-ear headphones with 30h battery life.', 349.00, 399.00, 40, true, true, true, (SELECT id FROM public.categories WHERE slug='audio'), 4.7, 256),
    ('samsung-s24-ultra', 'Samsung Galaxy S24 Ultra', '6.8" AMOLED, 200MP camera', 'Flagship Android phone with S Pen and AI features.', 1299.00, NULL, 18, true, false, false, (SELECT id FROM public.categories WHERE slug='smartphones'), 4.6, 92),
    ('mens-leather-jacket', 'Men Leather Biker Jacket', 'Genuine leather, slim fit', 'Premium quality leather jacket in classic black.', 189.00, 249.00, 50, true, true, false, (SELECT id FROM public.categories WHERE slug='men'), 4.4, 64),
    ('womens-summer-dress', 'Women Floral Summer Dress', 'Lightweight, breathable', 'Elegant floral dress perfect for summer.', 59.00, 89.00, 80, true, true, true, (SELECT id FROM public.categories WHERE slug='women'), 4.5, 41),
    ('leather-tote-bag', 'Premium Leather Tote Bag', 'Spacious & elegant', 'Handcrafted leather tote with multiple compartments.', 129.00, 179.00, 35, true, false, false, (SELECT id FROM public.categories WHERE slug='bags'), 4.6, 28),
    ('modern-sofa-3seater', 'Modern Linen 3-Seater Sofa', 'Comfortable & stylish', 'Beige linen sofa with solid wood frame.', 899.00, 1199.00, 8, true, true, true, (SELECT id FROM public.categories WHERE slug='furniture'), 4.7, 19),
    ('oak-coffee-table', 'Oak Coffee Table', 'Solid wood, minimalist', 'Handmade solid oak coffee table.', 349.00, NULL, 12, true, false, false, (SELECT id FROM public.categories WHERE slug='furniture'), 4.5, 11),
    ('ceramic-vase-set', 'Ceramic Vase Set of 3', 'Modern decor accent', 'Set of 3 minimalist ceramic vases.', 49.00, 79.00, 60, true, true, false, (SELECT id FROM public.categories WHERE slug='decor'), 4.3, 22),
    ('table-lamp-brass', 'Brass Table Lamp', 'Vintage industrial style', 'Adjustable brass lamp with linen shade.', 89.00, 119.00, 25, true, false, true, (SELECT id FROM public.categories WHERE slug='decor'), 4.6, 17),
    ('luxury-towel-set', 'Egyptian Cotton Towel Set', '600 GSM, 6-piece', 'Plush Egyptian cotton bath towel set.', 79.00, 109.00, 100, true, false, false, (SELECT id FROM public.categories WHERE slug='bathroom'), 4.4, 53),
    ('skincare-set', 'Glow Skincare Routine', 'Cleanser, serum & moisturizer', '3-step skincare set with vitamin C.', 69.00, 99.00, 70, true, true, true, (SELECT id FROM public.categories WHERE slug='beauty'), 4.7, 88),
    ('teddy-bear-large', 'Giant Teddy Bear 80cm', 'Soft & cuddly', 'Premium plush teddy bear, hypoallergenic.', 39.00, 59.00, 120, true, false, false, (SELECT id FROM public.categories WHERE slug='gifts-toys'), 4.8, 134),
    ('wall-clock-modern', 'Modern Minimalist Wall Clock', 'Silent quartz movement', '12" wall clock with wooden frame.', 45.00, 65.00, 45, true, false, false, (SELECT id FROM public.categories WHERE slug='decor'), 4.5, 31),
    ('wireless-earbuds', 'Wireless Earbuds Pro', 'ANC, 30h battery', 'True wireless earbuds with active noise cancellation.', 129.00, 179.00, 90, true, true, true, (SELECT id FROM public.categories WHERE slug='audio'), 4.6, 207)
  ON CONFLICT (slug) DO NOTHING
  RETURNING id, slug
)
INSERT INTO public.product_images (product_id, url, alt, is_primary, position)
SELECT np.id,
  CASE np.slug
    WHEN 'iphone-15-pro' THEN 'https://images.unsplash.com/photo-1696446702183-be01a0fa07bc?w=800&q=80'
    WHEN 'macbook-air-m3' THEN 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
    WHEN 'sony-wh1000xm5' THEN 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'
    WHEN 'samsung-s24-ultra' THEN 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80'
    WHEN 'mens-leather-jacket' THEN 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'
    WHEN 'womens-summer-dress' THEN 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80'
    WHEN 'leather-tote-bag' THEN 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80'
    WHEN 'modern-sofa-3seater' THEN 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
    WHEN 'oak-coffee-table' THEN 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&q=80'
    WHEN 'ceramic-vase-set' THEN 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80'
    WHEN 'table-lamp-brass' THEN 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'
    WHEN 'luxury-towel-set' THEN 'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=800&q=80'
    WHEN 'skincare-set' THEN 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    WHEN 'teddy-bear-large' THEN 'https://images.unsplash.com/photo-1559454403-b8fb88521f2c?w=800&q=80'
    WHEN 'wall-clock-modern' THEN 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80'
    WHEN 'wireless-earbuds' THEN 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'
  END,
  np.slug, true, 0
FROM new_products np;
