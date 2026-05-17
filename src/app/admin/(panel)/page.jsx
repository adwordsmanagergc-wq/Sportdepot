import Link from 'next/link';
import { prisma } from '@/lib/db';
import { serializeProduct, formatPrice } from '@/lib/products';

export const dynamic = 'force-dynamic';

async function loadStats() {
  const [products, recentOrders, pending, totalRevenue] = await Promise.all([
    prisma.product.findMany({
      where: { isArchived: false },
      include: { sizes: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  const serialized = products.map(serializeProduct);
  const soldOut = serialized.filter((p) => p.isSoldOut);
  const lowStock = serialized.filter(
    (p) => !p.isSoldOut && p.totalStock <= 5,
  );

  return {
    totalProducts: serialized.length,
    soldOut,
    lowStock,
    recentOrders,
    pendingOrders: pending,
    revenue: totalRevenue._sum.total || 0,
  };
}

export default async function DashboardPage() {
  const s = await loadStats();
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Products" value={s.totalProducts} />
        <Stat label="Sold Out" value={s.soldOut.length} accent={s.soldOut.length > 0} />
        <Stat label="Low Stock" value={s.lowStock.length} accent={s.lowStock.length > 0} />
        <Stat label="Pending Orders" value={s.pendingOrders} />
      </div>

      <div className="card p-6">
        <div className="text-sm text-gray-500 uppercase tracking-wide">Total Revenue</div>
        <div className="text-3xl font-bold mt-1">{formatPrice(s.revenue)}</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Low Stock Alert" link={{ href: '/admin/stock', label: 'Manage stock' }}>
          {s.lowStock.length === 0 ? (
            <p className="text-sm text-gray-500">All stock levels are healthy.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {s.lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="py-2 flex justify-between text-sm">
                  <Link href={`/admin/products/${p.id}`} className="hover:text-accent truncate">
                    {p.brand} — {p.name}
                  </Link>
                  <span className="text-accent font-semibold ml-2">{p.totalStock} left</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Sold Out Items" link={{ href: '/admin/stock', label: 'Manage stock' }}>
          {s.soldOut.length === 0 ? (
            <p className="text-sm text-gray-500">No sold-out items.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {s.soldOut.slice(0, 6).map((p) => (
                <li key={p.id} className="py-2 flex justify-between text-sm">
                  <Link href={`/admin/products/${p.id}`} className="hover:text-accent truncate">
                    {p.brand} — {p.name}
                  </Link>
                  <span className="badge-sold">Sold out</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Recent Orders" link={{ href: '/admin/orders', label: 'All orders' }}>
        {s.recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
                <th className="py-2">Placed</th>
              </tr>
            </thead>
            <tbody>
              {s.recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100">
                  <td className="py-2 font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-2">{o.customerName}</td>
                  <td className="py-2">{formatPrice(o.total)}</td>
                  <td className="py-2 capitalize">{o.status}</td>
                  <td className="py-2 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
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

function Panel({ title, link, children }) {
  return (
    <section className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold uppercase tracking-wide">{title}</h2>
        {link && (
          <Link href={link.href} className="text-xs text-accent hover:underline">
            {link.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
