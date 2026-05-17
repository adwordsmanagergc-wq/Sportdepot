'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ALL_SIZES, SPORT_TYPES } from '@/lib/products';

const COLOR_OPTIONS = ['Black', 'White', 'Red', 'Blue', 'Pink', 'Green'];

export default function FilterSidebar({ brands = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function setParam(key, value) {
    const next = new URLSearchParams(sp.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  }

  function toggleMulti(key, value) {
    const next = new URLSearchParams(sp.toString());
    const current = (next.get(key) || '').split(',').filter(Boolean);
    const has = current.includes(value);
    const updated = has ? current.filter((v) => v !== value) : [...current, value];
    if (updated.length) next.set(key, updated.join(','));
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const selectedBrands = (sp.get('brand') || '').split(',').filter(Boolean);
  const selectedSizes = (sp.get('size') || '').split(',').filter(Boolean);
  const selectedSports = (sp.get('sport') || '').split(',').filter(Boolean);
  const selectedColors = (sp.get('color') || '').split(',').filter(Boolean);

  return (
    <aside className="w-full lg:w-64 lg:sticky lg:top-32 lg:self-start">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold uppercase tracking-wide">Filters</h2>
        <button onClick={clearAll} className="text-xs text-accent hover:underline">
          Clear all
        </button>
      </div>

      <Section title="Brand">
        <div className="space-y-2">
          {brands.map((b) => (
            <Checkbox
              key={b}
              label={b}
              checked={selectedBrands.includes(b)}
              onChange={() => toggleMulti('brand', b)}
            />
          ))}
        </div>
      </Section>

      <Section title="Size">
        <div className="grid grid-cols-4 gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleMulti('size', s)}
              className={`border text-sm py-1.5 rounded ${
                selectedSizes.includes(s)
                  ? 'border-accent bg-accent text-white'
                  : 'border-gray-300 hover:border-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Color">
        <div className="space-y-2">
          {COLOR_OPTIONS.map((c) => (
            <Checkbox
              key={c}
              label={c}
              checked={selectedColors.includes(c)}
              onChange={() => toggleMulti('color', c)}
            />
          ))}
        </div>
      </Section>

      <Section title="Sport Type">
        <div className="space-y-2">
          {SPORT_TYPES.map((s) => (
            <Checkbox
              key={s.slug}
              label={s.label}
              checked={selectedSports.includes(s.slug)}
              onChange={() => toggleMulti('sport', s.slug)}
            />
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            defaultValue={sp.get('minPrice') || ''}
            onBlur={(e) => setParam('minPrice', e.target.value)}
            className="input"
          />
          <span>–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            defaultValue={sp.get('maxPrice') || ''}
            onBlur={(e) => setParam('maxPrice', e.target.value)}
            className="input"
          />
        </div>
      </Section>
    </aside>
  );
}

function Section({ title, children }) {
  return (
    <div className="border-t border-gray-200 py-4">
      <h3 className="font-semibold uppercase text-sm tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-accent"
      />
      {label}
    </label>
  );
}
