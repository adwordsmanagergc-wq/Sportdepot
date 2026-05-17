import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import AddToCartPanel from '@/components/AddToCartPanel';
import ProductGrid from '@/components/ProductGrid';
import { prisma } from '@/lib/db';
import { serializeProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

async function getProduct(id) {
  const p = await prisma.product.findUnique({
    where: { id },
    include: { sizes: true },
  });
  if (!p || p.isArchived) return null;
  return serializeProduct(p);
}

async function getRelated(product) {
  const rows = await prisma.product.findMany({
    where: {
      isArchived: false,
      isActive: true,
      id: { not: product.id },
      OR: [{ category: product.category }, { sportType: product.sportType }],
    },
    include: { sizes: true },
    take: 4,
    orderBy: { popularity: 'desc' },
  });
  return rows.map(serializeProduct);
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const related = await getRelated(product);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">
          <Link href="/" className="hover:text-accent">Home</Link> /{' '}
          <Link href={`/shop/${product.category}`} className="hover:text-accent">
            {product.category}
          </Link>{' '}
          / {product.name}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <ImageGallery images={product.images} alt={product.name} />
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.isNew && <span className="badge-new">New</span>}
              {product.onSale && <span className="badge-sale">Sale</span>}
              {product.isSoldOut && <span className="badge-sold">Sold Out</span>}
            </div>
            <div className="text-sm uppercase tracking-wider text-gray-500">
              {product.brand}
            </div>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1 capitalize">
              {product.sportType} · {product.category}
            </p>

            <div className="mt-6">
              <AddToCartPanel product={product} />
            </div>

            <div className="mt-8">
              <h2 className="font-semibold uppercase tracking-wide text-sm mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl tracking-wider mb-6">YOU MAY ALSO LIKE</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
