import { prisma } from '@/lib/db';
import { serializeProduct } from '@/lib/products';
import StockEditor from '@/components/admin/StockEditor';

export const dynamic = 'force-dynamic';

export default async function StockPage() {
  const rows = await prisma.product.findMany({
    where: { isArchived: false },
    include: { sizes: true },
    orderBy: [{ brand: 'asc' }, { name: 'asc' }],
  });
  const products = rows.map(serializeProduct);
  const soldOut = products.filter((p) => p.isSoldOut);
  const lowStock = products.filter((p) => !p.isSoldOut && p.totalStock <= 5);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Stock Report</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Stat label="Total products" value={products.length} />
        <Stat label="Sold out" value={soldOut.length} accent={soldOut.length > 0} />
        <Stat label="Low stock (≤5)" value={lowStock.length} accent={lowStock.length > 0} />
      </div>

      <section>
        <h2 className="font-bold uppercase tracking-wide mb-3 text-sm">Sold Out</h2>
        <List products={soldOut} empty="None — everything is in stock." />
      </section>

      <section>
        <h2 className="font-bold uppercase tracking-wide mb-3 text-sm">Low Stock</h2>
        <List products={lowStock} empty="No low-stock items." />
      </section>

      <section>
        <h2 className="font-bold uppercase tracking-wide mb-3 text-sm">Bulk Update</h2>
        <p className="text-sm text-gray-600 mb-3">
          Edit any cell and click <strong>Save changes</strong> to push updates in one batch.
        </p>
        <StockEditor products={products} />
      </section>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`text-3xl font-bold mt-1 ${accent ? 'text-accent' : ''}`}>{value}</div>
    </div>
  );
}

function List({ products, empty }) {
  if (products.length === 0) return <p className="text-sm text-gray-500">{empty}</p>;
  return (
    <ul className="card divide-y divide-gray-100">
      {products.map((p) => (
        <li key={p.id} className="p-3 flex items-center gap-3 text-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images?.[0] || '/placeholder.svg'} alt="" className="w-10 h-10 object-cover rounded" />
          <div className="flex-1">
            <div className="font-medium">{p.brand} — {p.name}</div>
            <div className="text-xs text-gray-500">
              {p.sizes.map((s) => `${s.size}:${s.stock}`).join('  ·  ')}
            </div>
          </div>
          <a href={`/admin/products/${p.id}`} className="text-accent hover:underline">Edit</a>
        </li>
      ))}
    </ul>
  );
}
