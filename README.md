# Golden Nuts House

Online store for Golden Nuts House, Columbus, OH.

Built with React (Vite) and Supabase, hosted on Vercel.

## Features

**Store**
- Home page with banner slides, featured products and categories
- Collection and product pages (sold per piece or by weight)
- Cart and checkout (store pickup or local delivery)
- Customer accounts with order history

**Admin panel** (`/admin`)
- Dashboard: new orders, sales, low stock
- Orders: view details and update status
- Products: add, edit, hide, delete, upload photos, manage stock and sale prices
- Categories and home page slides
- Site settings: announcement bar, contact info, texts and images
- Users: give staff or admin access

## Setup

### Database (Supabase)
1. Create a Supabase project.
2. In SQL Editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Copy the project URL and publishable key from Project Settings > API Keys.

### Local
```bash
cp .env.example .env    # add the URL and key
npm install
npm run dev
```

### Hosting (Vercel)
Add these environment variables in Vercel, then redeploy:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable key |

### Admin access
Create an account on the site, then run once in SQL Editor:
```sql
update public.profiles set role = 'admin' where email = 'owner@example.com';
```
After that, more staff can be added from Admin > Users.

## Roles

| Role | Access |
|---|---|
| customer | Shop and view own orders |
| staff | Admin panel (products, orders, content) |
| admin | Everything, including user roles |
