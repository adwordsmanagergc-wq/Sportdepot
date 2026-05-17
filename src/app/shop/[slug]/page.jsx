import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import FilterSidebar from '@/components/FilterSidebar';
import SortSelect from '@/components/SortSelect';
import { prisma } from '@/lib/db';
import { serializeProduct, CATEGORIES, SPORT_TYPES } from '@/lib/products';
import { safeQuery } from '@/lib/safeQuery';
import { mockByCategory, MOCK_BRANDS, MOCK_PRODUCTS } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

const PAGE_TITLES = {
  men: 'Men’s Shoes',
  women: 'Women’s Shoes',
  kids: 'Kids’ Shoes',
  sale: 'Sale',
  new: 'New Arrivals',
  all: 'All Shoes',
  brands: 'Shop by Brand',
  search: 'Search Results',
};

async function loadProducts(slug, sp) {
  const where = { isArchived: false, isActive: true };

  if (CATEGORIES.some((c) => c.slug === slug)) {
    where.category = slug;
  } else if (slug === 'sale') {
    where.AND = [{ salePrice: { not: null } }];
  } else if (slug === 'new') {
    where.isNew = true;
  }

  const brandParam = sp.brand;
  if (brandParam) where.brand = { in: brandParam.split(',') };

  const sportParam = sp.sport;
  if (sportParam) where.sportType = { in: sportParam.split(',') };

  if (sp.minPrice || sp.maxPrice) {
    where.price = {};
    if (sp.minPrice) where.price.gte = Number(sp.minPrice);
    if (sp.maxPrice) where.price.lte = Number(sp.maxPrice);
  }

  if (sp.q) {
    where.OR = [
      { name: { contains: sp.q } },
      { brand: { contains: sp.q } },
      { description: { contains: sp.q } },
    ];
  }

  let orderBy = { createdAt: 'desc' };
  switch (sp.sort) {
    case 'price-asc': orderBy = { price: 'asc' }; break;
    case 'price-desc': orderBy = { price: 'desc' }; break;
    case 'popular': orderBy = { popularity: 'desc' }; break;
  }

  let products = await safeQuery(
    async () => {
      const rows = await prisma.product.findMany({
        where,
        include: { sizes: true },
        orderBy,
      });
      return rows.map(serializeProduct);
    },
    () => filterMock(slug, sp),
  );

  // Post-filter by size/color (stored as JSON strings)
  const sizeParam = sp.size;
  if (sizeParam) {
    const wanted = sizeParam.split(',');
    products = products.filter((p) =>
      p.sizes.some((s) => wanted.includes(s.size) && s.stock > 0),
    );
  }
  const colorParam = sp.color;
  if (colorParam) {
    const wanted = colorParam.split(',').map((c) => c.toLowerCase());
    products = products.filter((p) =>
      p.colors.some((c) => wanted.some((w) => c.toLowerCase().includes(w))),
    );
  }

  return products;
}

async function loadBrands() {
  return safeQuery(
    async () => {
      const rows = await prisma.product.findMany({
        where: { isArchived: false, isActive: true },
        select: { brand: true },
        distinct: ['brand'],
        orderBy: { brand: 'asc' },
      });
      return rows.map((r) => r.brand);
    },
    MOCK_BRANDS,
  );
}

function filterMock(slug, sp) {
  let products = mockByCategory(slug);
  if (sp.brand) {
    const wanted = sp.brand.split(',');
    products = products.filter((p) => wanted.includes(p.brand));
  }
  if (sp.sport) {
    const wanted = sp.sport.split(',');
    products = products.filter((p) => wanted.includes(p.sportType));
  }
  if (sp.minPrice) products = products.filter((p) => p.price >= Number(sp.minPrice));
  if (sp.maxPrice) products = products.filter((p) => p.price <= Number(sp.maxPrice));
  if (sp.q) {
    const q = sp.q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }
  switch (sp.sort) {
    case 'price-asc': products = [...products].sort((a, b) => a.price - b.price); break;
    case 'price-desc': products = [...products].sort((a, b) => b.price - a.price); break;
    case 'popular': products = [...products].sort((a, b) => b.popularity - a.popularity); break;
    default: products = [...products].sort((a, b) => b.createdAt - a.createdAt);
  }
  return products;
}

export default async function ShopPage({ params, searchParams }) {
  const { slug } = params;
  const title = PAGE_TITLES[slug] || 'Shop';
  const brands = await loadBrands();

  // The "brands" page is a brand directory rather than a product list
  if (slug === 'brands') {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="font-display text-4xl tracking-wider mb-8">SHOP BY BRAND</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {brands.map((b) => (
              <Link
                key={b}
                href={`/shop/all?brand=${encodeURIComponent(b)}`}
                className="card p-8 text-center hover:bg-ink hover:text-white transition-colors"
              >
                <span className="font-display text-2xl tracking-wider">{b}</span>
              </Link>
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const products = await loadProducts(slug, searchParams || {});

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          <Link href="/" className="hover:text-accent">Home</Link> / {title}
        </div>
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <h1 className="font-display text-4xl tracking-wider">{title}</h1>
          <SortSelect />
        </div>

        {/* Quick sport filter rail */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4 border-b border-gray-200">
          {SPORT_TYPES.map((s) => (
            <Link
              key={s.slug}
              href={`?sport=${s.slug}`}
              className="shrink-0 text-xs uppercase font-semibold border border-gray-300 px-3 py-1.5 rounded-full hover:border-accent hover:text-accent"
            >
              {s.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar brands={brands} />
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-4">{products.length} products</p>
            <ProductGrid products={products} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
