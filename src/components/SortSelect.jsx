'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const current = sp.get('sort') || 'newest';

  function change(e) {
    const next = new URLSearchParams(sp.toString());
    if (e.target.value === 'newest') next.delete('sort');
    else next.set('sort', e.target.value);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Sort:</span>
      <select value={current} onChange={change} className="input py-1.5 w-auto">
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
