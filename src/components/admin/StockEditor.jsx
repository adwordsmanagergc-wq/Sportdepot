'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ALL_SIZES } from '@/lib/products';

export default function StockEditor({ products }) {
  const router = useRouter();
  const [edits, setEdits] = useState({}); // key: `${productId}-${size}` -> stock
  const [saving, setSaving] = useState(false);

  function setStock(productId, size, value) {
    setEdits((e) => ({ ...e, [`${productId}-${size}`]: Number(value) || 0 }));
  }

  function valueFor(p, size) {
    const k = `${p.id}-${size}`;
    if (edits[k] != null) return edits[k];
    return p.sizes.find((s) => s.size === size)?.stock ?? 0;
  }

  const dirtyCount = useMemo(() => Object.keys(edits).length, [edits]);

  async function save() {
    if (!dirtyCount) return;
    setSaving(true);
    const updates = Object.entries(edits).map(([k, stock]) => {
      const [productId, size] = k.split('-');
      return { productId, size, stock };
    });
    await fetch('/api/admin/stock/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });
    setEdits({});
    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-3 mb-3">
        <span className="text-sm text-gray-500">{dirtyCount} pending change{dirtyCount === 1 ? '' : 's'}</span>
        <button onClick={save} disabled={!dirtyCount || saving} className="btn-primary py-2 px-4 text-sm">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="p-3">Product</th>
              {ALL_SIZES.map((s) => (
                <th key={s} className="p-3 text-center w-16">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="p-3">
                  <div className="font-medium">{p.brand} — {p.name}</div>
                </td>
                {ALL_SIZES.map((s) => (
                  <td key={s} className="p-2 text-center">
                    <input
                      type="number"
                      min="0"
                      value={valueFor(p, s)}
                      onChange={(e) => setStock(p.id, s, e.target.value)}
                      className="input w-16 text-center"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
