import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { serializeProduct } from '@/lib/products';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }) {
  const row = await prisma.product.findUnique({
    where: { id: params.id },
    include: { sizes: true },
  });
  if (!row) notFound();
  const product = serializeProduct(row);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Edit: <span className="text-gray-600">{product.brand} — {product.name}</span>
      </h1>
      <ProductForm initial={product} />
    </div>
  );
}
