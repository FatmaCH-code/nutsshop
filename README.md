# Golden Nuts House — Website + Admin Panel

React (Vite) + Supabase. Shop: home, collections, product pages, cart, checkout (pickup / local delivery), customer account.
Admin panel at **/admin**: dashboard, orders, products, categories, home slides, site settings, users & roles.

## 1. Supabase (once)

1. Create a new Supabase project (free plan allows **2 active projects per account**).
2. **SQL Editor → New query** → paste `supabase/schema.sql` → **Run**.
3. New query → paste `supabase/seed.sql` → **Run** (starter products, slides, categories — optional).
4. **Authentication → Sign In / Providers → Email**: for quick testing you can turn off "Confirm email".
5. **Project Settings → API**: copy the *Project URL* and the *anon public* key.

## 2. Run locally

```bash
cp .env.example .env      # then paste the 2 keys in .env
npm install
npm run dev
```

## 3. Make the client an admin

1. On the site, go to **/signup** and create an account with the client's email.
2. In Supabase SQL Editor run:
   ```sql
   update public.profiles set role = 'admin' where email = 'CLIENT@EMAIL.COM';
   ```
3. Log in → an **ADMIN** button appears in the header → **/admin**.
   From then on the client can promote employees himself in *Admin → Users & Roles* (`staff` = products + orders, `admin` = everything).

## 4. Deploy on Vercel

- Push to GitHub, import in Vercel (framework: Vite).
- **Settings → Environment Variables**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then **Redeploy**.
- `vercel.json` already makes links like `/admin` work on refresh.
- **Settings → Domains**: add the client's domain (e.g. goldennutshouse.com) and set the DNS records Vercel shows.

## What the admin can change

| Section | What |
|---|---|
| Orders | list, filter by status, change status (new → confirmed → preparing → ready → completed / cancelled), private notes, print, delete |
| Products | add / edit / duplicate / delete, upload photos, price, old price (SALE badge), stock (0 = sold out), sold by weight, categories, hide/show, order |
| Categories | names, tile images, show on home page |
| Home Slides | banner images, titles, buttons, order, hide/show |
| Site Settings | announcement bar, address, phone, email, hours, about/gift sections, footer, social links, checkout message |

Home page rows: put a product in **Best Sellers**, **Hot Items** or **Limited-Time Discounts** to show it on the home page.

Prices are always taken from the database when an order is placed (`place_order` function), so they can't be changed from the browser.

## Files

```
public/            gnh-logo.png, gnh-mark.png, favicon.png (logo cut from the bag mock-up)
supabase/          schema.sql (tables + security + storage), seed.sql (starter content)
src/context/       Auth, Cart, SiteData (loads products/slides/settings from Supabase)
src/pages/admin/   the admin panel
src/data/nav.js    header mega-menu links (edit here if categories change)
```

> Logo: extracted from the bag photo. For the sharpest result, ask the client for the original PNG/SVG
> and replace `public/gnh-logo.png` + `public/gnh-mark.png` (same names).
