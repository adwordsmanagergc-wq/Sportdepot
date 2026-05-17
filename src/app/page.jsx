import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import ProductGrid from '@/components/ProductGrid';
import { prisma } from '@/lib/db';
import { serializeProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

async function getFeaturedAndNew() {
  const [featured, fresh] = await Promise.all([
    prisma.product.findMany({
      where: { isArchived: false, isActive: true, isFeatured: true },
      include: { sizes: true },
      take: 8,
      orderBy: { popularity: 'desc' },
    }),
    prisma.product.findMany({
      where: { isArchived: false, isActive: true, isNew: true },
      include: { sizes: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return {
    featured: featured.map(serializeProduct),
    fresh: fresh.map(serializeProduct),
  };
}

const CATEGORY_TILES = [
  {
    href: '/shop/men',
    label: 'MEN',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',
  },
  {
    href: '/shop/women',
    label: 'WOMEN',
    img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900',
  },
  {
    href: '/shop/kids',
    label: 'KIDS',
    img: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=900',
  },
];

export default async function HomePage() {
  const { featured, fresh } = await getFeaturedAndNew();

  return (
    <>
      <Header />
      <main>
        <HeroBanner />

        {/* Category tiles */}
        <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-4">
          {CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="relative aspect-[4/3] overflow-hidden rounded-lg group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tile.img}
                alt={tile.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <div className="font-display text-4xl text-white tracking-wider">{tile.label}</div>
                <div className="text-white/80 text-sm mt-1 group-hover:text-accent">Shop now →</div>
              </div>
            </Link>
          ))}
        </section>

        {/* Featured */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-3xl tracking-wider">FEATURED PICKS</h2>
            <Link href="/shop/all" className="text-sm font-semibold uppercase text-accent hover:underline">
              Shop all →
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>

        {/* Promo strip */}
        <section className="bg-accent text-white my-12">
          <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-display text-3xl md:text-4xl tracking-wider">EXTRA 20% OFF SALE</div>
              <p className="text-white/90">Use code <span className="font-bold">RUN20</span> at checkout</p>
            </div>
            <Link href="/shop/sale" className="btn bg-ink text-white hover:bg-black px-6 py-3 rounded">
              Shop Sale
            </Link>
          </div>
        </section>

        {/* New arrivals */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-3xl tracking-wider">JUST DROPPED</h2>
            <Link href="/shop/new" className="text-sm font-semibold uppercase text-accent hover:underline">
              See all new →
            </Link>
          </div>
          <ProductGrid products={fresh} />
        </section>
      </main>
      <Footer />
    </>
  );
}
