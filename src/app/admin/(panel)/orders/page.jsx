import { prisma } from '@/lib/db';
import OrdersTable from '@/components/admin/OrdersTable';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders ({orders.length})</h1>
      <OrdersTable initialOrders={orders} />
    </div>
  );
}
