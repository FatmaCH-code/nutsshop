-- Starter content for Golden Nuts House (run ONCE after schema.sql)
-- Placeholder photos: replace them from the admin panel with the client's real photos.

insert into public.categories (slug, name, image_url, show_on_home, sort_order) values
  ('nuts-seeds-snacks', 'Nuts, Seeds & Snacks', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1200&auto=format&fit=crop', true, 0),
  ('coffee-tea', 'Coffee & Tea', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop', true, 1),
  ('dates-dry-fruits', 'Dates & Dry Fruits', 'https://images.unsplash.com/photo-1601599963565-b7f49deb2c19?q=80&w=1200&auto=format&fit=crop', true, 2),
  ('chocolates-sweets', 'Chocolates & Sweets', 'https://images.unsplash.com/photo-1548907040-4baa419e8e9c?q=80&w=1200&auto=format&fit=crop', true, 3),
  ('turkish-delights', 'Turkish Delights', 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=1200&auto=format&fit=crop', true, 4),
  ('spices', 'Spices', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop', true, 5),
  ('gifts', 'Gifts', null, false, 6),
  ('best-sellers', 'Best Sellers', null, false, 7),
  ('hot-items', 'Hot Items', null, false, 8),
  ('deals', 'Limited-Time Discounts', null, false, 9)
on conflict (slug) do nothing;

insert into public.products (name, slug, base_price, has_weight, category, image_url, sort_order) values
  ('Salted Persian Pistachios', 'salted-persian-pistachios', 9, true, array['nuts-seeds-snacks','best-sellers'], 'https://images.unsplash.com/photo-1610137512859-aa919f651a05?q=80&w=800&auto=format&fit=crop', 0),
  ('Pistachio Dubai Chocolate Bar', 'pistachio-dubai-chocolate-bar', 25, false, array['chocolates-sweets','best-sellers'], 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800&auto=format&fit=crop', 1),
  ('Salted Pumpkin Seeds', 'salted-pumpkin-seeds', 5, true, array['nuts-seeds-snacks','best-sellers'], 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?q=80&w=800&auto=format&fit=crop', 2),
  ('Mixed Nuts Deluxe', 'mixed-nuts-deluxe', 12, true, array['nuts-seeds-snacks','best-sellers'], 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800&auto=format&fit=crop', 3),
  ('Turkish Sunflower Seeds', 'turkish-sunflower-seeds', 4, true, array['nuts-seeds-snacks','best-sellers'], 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=800&auto=format&fit=crop', 4),
  ('Nut-Stuffed Dates Mix', 'nut-stuffed-dates-mix', 9, true, array['dates-dry-fruits','hot-items'], 'https://images.unsplash.com/photo-1593904308074-e1a53c1c4a19?q=80&w=800&auto=format&fit=crop', 5),
  ('Dark Chocolate with Hazelnut', 'dark-chocolate-hazelnut', 14, false, array['chocolates-sweets','hot-items'], 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=800&auto=format&fit=crop', 6),
  ('Honey Roasted Almonds', 'honey-roasted-almonds', 11, true, array['nuts-seeds-snacks','hot-items'], 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?q=80&w=800&auto=format&fit=crop', 7),
  ('Mixed Turkish Delights 700g', 'mixed-turkish-delights', 35, false, array['turkish-delights','hot-items'], 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=800&auto=format&fit=crop', 8),
  ('Raw Cashews', 'raw-cashews', 10, true, array['nuts-seeds-snacks','hot-items'], 'https://images.unsplash.com/photo-1563412885-e335dc45a3f7?q=80&w=800&auto=format&fit=crop', 9),
  ('7 Spice Blend', 'seven-spice-blend', 8, true, array['spices','hot-items'], 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop', 10),
  ('Wrapped Sultan Delight with Chocolate & Coconut', 'wrapped-sultan-delight', 12, true, array['turkish-delights','deals'], 'https://images.unsplash.com/photo-1503153554456-938cf7ee200c?q=80&w=800&auto=format&fit=crop', 11),
  ('Salted Pumpkin Seeds (Bulk)', 'salted-pumpkin-seeds-deal', 5, true, array['nuts-seeds-snacks','deals'], 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?q=80&w=800&auto=format&fit=crop', 12),
  ('Pistachio Knafeh Chocolate Bar', 'pistachio-knafeh-bar', 25, false, array['chocolates-sweets','deals'], 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800&auto=format&fit=crop', 13),
  ('Muluki Zatar Blend', 'muluki-zatar', 7, true, array['spices','deals'], 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop', 14),
  ('Mayasi Snack Mix', 'mayasi-mix', 6, true, array['nuts-seeds-snacks','deals'], 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800&auto=format&fit=crop', 15),
  ('Turkish Coffee, Cardamom Blend', 'turkish-coffee-cardamom', 13, true, array['coffee-tea'], 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop', 16),
  ('Loose Leaf Black Tea', 'loose-leaf-black-tea', 9, true, array['coffee-tea'], 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop', 17),
  ('Medjool Dates, Premium', 'medjool-dates', 16, true, array['dates-dry-fruits'], 'https://images.unsplash.com/photo-1601599963565-b7f49deb2c19?q=80&w=800&auto=format&fit=crop', 18),
  ('Gourmet Gift Tray', 'gourmet-gift-tray', 45, false, array['gifts'], 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?q=80&w=800&auto=format&fit=crop', 19)
on conflict (slug) do nothing;

insert into public.hero_slides (title, subtitle, image_url, cta_label, cta_href, secondary_label, secondary_href, sort_order)
select * from (values
  ('Treat Yourself Anytime', 'Delicious chocolates, sweets & snacks made to brighten your day', 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=2400&auto=format&fit=crop', 'Shop Now', '/collections/best-sellers', 'Explore Gifts', '/collections/gifts', 0),
  ('From Nature to Your Table', 'Freshly sourced nuts & seeds with unbeatable flavor', 'https://images.unsplash.com/photo-1728310341959-6451b2d37f28?q=80&w=2400&auto=format&fit=crop', 'Shop Now', '/collections/nuts-seeds-snacks', 'Explore Gifts', '/collections/gifts', 1),
  ('Sweet Tradition, Modern Delight', 'Authentic Turkish delights crafted with rich nuts & flavors', 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?q=80&w=2400&auto=format&fit=crop', 'Shop Now', '/collections/turkish-delights', 'Explore Gifts', '/collections/gifts', 2),
  ('Rich Coffee & Tea, Every Morning', 'Slow-brewed traditions, sourced with care', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2400&auto=format&fit=crop', 'Shop Now', '/collections/coffee-tea', 'Explore Gifts', '/collections/gifts', 3)
) v where not exists (select 1 from public.hero_slides);
