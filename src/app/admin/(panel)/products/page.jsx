import Link from 'next/link';
import { prisma } from '@/lib/db';
import { serializeProduct, formatPrice } from '@/lib/products';
import ProductsTable from '@/components/admin/ProductsTable';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({ searchParams }) {
  const includeArchived = searchParams?.archived === 'true';
  const rows = await prisma.product.findMany({
    where: includeArchived ? {} : { isArchived: false },
    include: { sizes: true },
    orderBy: { createdAt: 'desc' },
  });
  const products = rows.map(serializeProduct);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Products ({products.length})</h1>
        <div className="flex gap-3">
          <Link
            href={includeArchived ? '/admin/products' : '/admin/products?archived=true'}
            className="text-sm text-gray-600 hover:text-accent self-center"
          >
            {includeArchived ? 'Hide archived' : 'Show archived'}
          </Link>
          <Link href="/admin/products/new" className="btn-primary py-2 px-4 text-sm">
            + Add Product
          </Link>
        </div>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
