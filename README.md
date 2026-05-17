# Sport Depot — Sports Footwear E‑Commerce

A complete e‑commerce website for a fictional sports‑shoe retailer modelled on
the look and feel of shoewarehouse.com.au. Built with Next.js 14 (App Router),
Tailwind CSS, Prisma + SQLite (swappable for PostgreSQL), and a JWT‑secured
admin back‑end.

---

## Features

### Customer‑facing storefront

- Bold sporty homepage with hero banner, category tiles, featured picks,
  promo strip and "Just Dropped" rail.
- Top nav with **Men / Women / Kids / Brands / Sale / New Arrivals** plus
  a search bar and live cart counter.
- Responsive category landing pages (`/shop/men`, `/shop/women`, `/shop/kids`,
  `/shop/sale`, `/shop/new`, `/shop/all`, `/shop/search?q=`).
- Filters: brand, size, color, sport type, price range. Sort: newest, popular,
  price asc/desc.
- Product cards show image, brand, name, price, available sizes and an
  **Out of Stock** overlay when total stock is zero.
- Product detail page with image gallery + hover‑zoom, size selector with
  per‑size stock indicators, quantity stepper, add‑to‑cart (disabled when
  sold out), buy‑now, and related products.
- Cart with quantity adjust / remove, free shipping threshold, and a
  checkout that captures contact + shipping address. Orders decrement stock
  atomically inside a transaction.
- Mobile‑first responsive layout, sticky header, "Out of Stock" / "Sale" /
  "New" badges throughout.
- Footer with contact info, policies, social links.

### Admin back‑end (`/admin`)

- Secure login (`/admin/login`) — bcrypt password hashing, JWT cookie,
  middleware‑enforced auth on every `/admin/**` and `/api/admin/**` route.
- Dashboard: total products, low‑stock alerts, sold‑out items, pending
  orders, total revenue, recent orders table.
- Product management: list with archive / delete, full add/edit form with
  drag‑and‑drop multi‑image upload, per‑size stock entry, sale price,
  sport type, colors and category.
- Image manager: drag to upload (or local file picker), reorder via arrow
  buttons, mark cover image, delete.
- Stock report + **bulk update grid** — edit every size for every product
  inline and save in one batch.
- Orders: filter by status, expand to view items + shipping address,
  inline status dropdown (pending / shipped / delivered / cancelled).
- Automatic stock logic: a size with `stock = 0` is marked **Sold Out**;
  a product whose every size is 0 is marked fully sold out on the storefront.

---

## Tech stack

| Layer        | Choice                                                  |
|--------------|---------------------------------------------------------|
| Framework    | **Next.js 14** (App Router, React 18)                   |
| Styling      | **Tailwind CSS** with custom sporty palette             |
| Database     | **Prisma ORM** with **SQLite** by default (or Postgres) |
| Auth         | **JWT** in httpOnly cookie (jose) + bcrypt              |
| State (cart) | **Zustand** with `localStorage` persistence             |
| Uploads      | **Local** (`public/uploads/`) or **Cloudinary**         |

---

## Folder structure

```
.
├── prisma/
│   ├── schema.prisma          ← DB schema (Admin, Product, ProductSize, Order, OrderItem)
│   └── seed.js                ← Seeds admin user + 12 demo products
├── public/
│   ├── uploads/               ← User‑uploaded product images (local provider)
│   └── placeholder.svg
├── src/
│   ├── app/
│   │   ├── layout.jsx
│   │   ├── globals.css
│   │   ├── page.jsx                   ← Homepage
│   │   ├── shop/[slug]/page.jsx       ← Category / sale / new / search / brands
│   │   ├── product/[id]/page.jsx      ← Product detail
│   │   ├── cart/page.jsx
│   │   ├── checkout/page.jsx
│   │   ├── order-success/page.jsx
│   │   ├── help/[slug]/page.jsx       ← Static info pages
│   │   ├── admin/
│   │   │   ├── login/page.jsx
│   │   │   └── (panel)/               ← Auth‑gated admin shell
│   │   │       ├── layout.jsx
│   │   │       ├── page.jsx           ← Dashboard
│   │   │       ├── products/
│   │   │       │   ├── page.jsx
│   │   │       │   ├── new/page.jsx
│   │   │       │   └── [id]/page.jsx
│   │   │       ├── stock/page.jsx
│   │   │       └── orders/page.jsx
│   │   └── api/
│   │       ├── auth/login/route.js
│   │       ├── auth/logout/route.js
│   │       ├── orders/route.js
│   │       └── admin/
│   │           ├── upload/route.js
│   │           ├── products/route.js
│   │           ├── products/[id]/route.js
│   │           ├── stock/bulk/route.js
│   │           └── orders/[id]/route.js
│   ├── components/
│   │   ├── Header.jsx · Footer.jsx · HeroBanner.jsx
│   │   ├── ProductCard.jsx · ProductGrid.jsx
│   │   ├── FilterSidebar.jsx · SortSelect.jsx
│   │   ├── ImageGallery.jsx · AddToCartPanel.jsx
│   │   └── admin/
│   │       ├── AdminLogout.jsx
│   │       ├── ProductsTable.jsx
│   │       ├── ProductForm.jsx
│   │       ├── StockEditor.jsx
│   │       └── OrdersTable.jsx
│   ├── lib/
│   │   ├── db.js           ← Prisma client singleton
│   │   ├── auth.js         ← JWT cookie helpers
│   │   ├── products.js     ← Serialization + constants
│   │   ├── upload.js       ← Local + Cloudinary providers
│   │   └── cart.js         ← Zustand cart store (client)
│   └── middleware.js       ← Protects /admin/** and /api/admin/**
├── next.config.js · tailwind.config.js · postcss.config.js · jsconfig.json
├── package.json
└── .env.example
```

---

## Data model

### `Product`
`id, name, brand, description, price, salePrice?, category, sportType,
colors[], images[], sizes[{size,stock}], isActive, isArchived, isFeatured,
isNew, popularity, createdAt, updatedAt`

> `colors` and `images` are stored as JSON strings in SQLite for portability
> and parsed on the way out via `serializeProduct`.

### `ProductSize`
`id, productId, size, stock` — one row per size of each product.
A product is **sold out** when the sum of its sizes' stock is zero.

### `Order`
`id, customerName, customerEmail, customerPhone?, addressLine1, addressLine2?,
city, state, postcode, country, subtotal, shipping, total,
status (pending|shipped|delivered|cancelled), notes?, createdAt, updatedAt`

### `OrderItem`
`id, orderId, productId, productName, brand, size, quantity, unitPrice, imageUrl?`

### `Admin`
`id, email, passwordHash, name?, createdAt`

---

## Running locally

### 1. Prerequisites
- Node.js 18.17+ (or 20+)
- npm

### 2. Install & configure
```bash
git clone <repo> sport-depot && cd sport-depot
cp .env.example .env
npm install
```

### 3. Initialise DB + seed
```bash
npm run db:push     # creates prisma/dev.db from the schema
npm run db:seed     # seeds the admin user + 12 demo products
```

### 4. Start
```bash
npm run dev
```

Visit:
- Storefront: <http://localhost:3000>
- Admin login: <http://localhost:3000/admin/login>

**Default admin credentials** (from `.env.example`):
```
email:    admin@sportdepot.local
password: admin1234
```

Change these in `.env` and re‑run `npm run db:seed`.

---

## Environment variables

| Variable                | Purpose                                                        |
|-------------------------|----------------------------------------------------------------|
| `DATABASE_URL`          | Prisma datasource URL. Default `file:./dev.db` (SQLite).       |
| `JWT_SECRET`            | Secret used to sign admin session cookies. **Set this.**       |
| `ADMIN_EMAIL`           | Email seeded by `npm run db:seed`.                             |
| `ADMIN_PASSWORD`        | Plain‑text password (bcrypt‑hashed on seed).                   |
| `UPLOAD_PROVIDER`       | `local` (default) or `cloudinary`.                             |
| `CLOUDINARY_CLOUD_NAME` | Required if `UPLOAD_PROVIDER=cloudinary`.                      |
| `CLOUDINARY_API_KEY`    | "                                                              |
| `CLOUDINARY_API_SECRET` | "                                                              |

Generate a real `JWT_SECRET` with `openssl rand -hex 32`.

---

## Switching to PostgreSQL

1. Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL="postgresql://user:pass@host:5432/sportdepot"` in `.env`.
3. Run `npm run db:push && npm run db:seed`.

Everything else works unchanged.

---

## Switching to Cloudinary uploads

1. Create a free Cloudinary account, copy your **Cloud name**, **API key** and
   **API secret**.
2. Set in `.env`:
   ```
   UPLOAD_PROVIDER=cloudinary
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
3. Restart `npm run dev`. New admin uploads will land in the `sport-depot`
   folder in your Cloudinary account, and the secure URL is stored on the
   product.

---

## Deployment

### Vercel (recommended)
1. Push the repo to GitHub.
2. Import the project at <https://vercel.com/new>.
3. Add the env vars from `.env`. For production data, use a managed Postgres
   (Vercel Postgres, Neon, Supabase, Railway) and set `DATABASE_URL`
   accordingly — SQLite **does not work** on serverless Vercel.
4. Set `UPLOAD_PROVIDER=cloudinary` (the Vercel filesystem is read‑only).
5. Add a build hook or one‑time job to run `npx prisma db push && npx prisma db seed`
   against the production database.

### Self‑hosted (Node / Docker)
```bash
npm run build
npm start
```
The default `build` script runs `prisma generate && prisma db push && next build`
so deployments stay schema‑synced. Mount a writable volume on
`public/uploads/` if you keep `UPLOAD_PROVIDER=local`.

---

## NPM scripts

| Script              | What it does                                       |
|---------------------|----------------------------------------------------|
| `npm run dev`       | Start Next.js dev server on :3000                  |
| `npm run build`     | Generate Prisma client, sync schema, production build |
| `npm start`         | Start the production server                        |
| `npm run db:push`   | Apply `schema.prisma` to the database              |
| `npm run db:seed`   | Seed admin + 12 demo products                      |
| `npm run db:studio` | Open Prisma Studio (DB browser)                    |

---

## Notes

- The checkout flow does not process real payments — it stores a `pending`
  order. Wire in Stripe / PayPal at `/api/orders/route.js` to take payments
  before the `prisma.order.create` call.
- Stock is decremented inside a `prisma.$transaction` so concurrent
  checkouts cannot oversell.
- Search is a simple `contains` over name, brand and description — fine for
  SQLite. For Postgres, swap in `pg_trgm` or a full‑text index.
- All admin routes are protected by `src/middleware.js`; trying to hit any
  `/admin/**` page without a session cookie redirects to the login page,
  and admin API routes return `401`.
