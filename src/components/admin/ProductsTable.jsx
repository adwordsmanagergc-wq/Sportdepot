'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatPrice } from '@/lib/products';

export default function ProductsTable({ products }) {
  const router = useRouter();
  const [busy, setBusy] = useState(null);

  async function archive(id, isArchived) {
    setBusy(id);
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isArchived: !isArchived }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(id) {
    if (!confirm('Permanently delete this product? This cannot be undone.')) return;
    setBusy(id);
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm min-w-[800px]">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="p-3">Product</th>
            <th className="p-3">Brand</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 flex items-center gap-3 min-w-[260px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.images?.[0] || '/placeholder.svg'}
                  alt=""
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div className="font-medium line-clamp-1">{p.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{p.sportType}</div>
                </div>
              </td>
              <td className="p-3">{p.brand}</td>
              <td className="p-3 capitalize">{p.category}</td>
              <td className="p-3">
                {p.onSale ? (
                  <>
                    <span className="text-accent font-semibold">{formatPrice(p.salePrice)}</span>{' '}
                    <span className="line-through text-gray-400 text-xs">{formatPrice(p.price)}</span>
                  </>
                ) : (
                  formatPrice(p.price)
                )}
              </td>
              <td className="p-3">
                <span className={p.totalStock === 0 ? 'text-red-600 font-semibold' : p.totalStock <= 5 ? 'text-accent font-semibold' : ''}>
                  {p.totalStock}
                </span>
              </td>
              <td className="p-3">
                {p.isArchived ? <span className="badge bg-gray-200 text-gray-700">Archived</span>
                  : p.isSoldOut ? <span className="badge-sold">Sold Out</span>
                  : <span className="badge bg-green-100 text-green-700">Active</span>}
              </td>
              <td className="p-3 text-right space-x-2 whitespace-nowrap">
                <Link href={`/admin/products/${p.id}`} className="text-accent hover:underline">
                  Edit
                </Link>
                <button
                  onClick={() => archive(p.id, p.isArchived)}
                  disabled={busy === p.id}
                  className="text-gray-600 hover:text-ink"
                >
                  {p.isArchived ? 'Restore' : 'Archive'}
                </button>
                <button
                  onClick={() => remove(p.id)}
                  disabled={busy === p.id}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan={7} className="p-8 text-center text-gray-500">No products yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
