'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';

const NAV = [
  { href: '/shop/men', label: 'Men' },
  { href: '/shop/women', label: 'Women' },
  { href: '/shop/kids', label: 'Kids' },
  { href: '/shop/brands', label: 'Brands' },
  { href: '/shop/sale', label: 'Sale', accent: true },
  { href: '/shop/new', label: 'New Arrivals' },
];

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const hydrate = useCart((s) => s.hydrate);
  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));

  useEffect(() => { hydrate(); }, [hydrate]);

  function submitSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/shop/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="bg-ink text-white text-center text-xs py-2 px-4">
        FREE SHIPPING ON ORDERS OVER $150 · 30-DAY RETURNS
      </div>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <button
          className="md:hidden p-2 -ml-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink" />
        </button>

        <Link href="/" className="font-display text-3xl tracking-wider">
          SPORT<span className="text-accent">DEPOT</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-6">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm font-semibold uppercase tracking-wide hover:text-accent ${
                n.accent ? 'text-accent' : 'text-ink'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="hidden lg:flex flex-1 max-w-sm ml-auto">
          <input
            className="input rounded-r-none"
            placeholder="Search shoes, brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="bg-ink text-white px-4 rounded-r font-semibold">Go</button>
        </form>

        <div className="ml-auto lg:ml-2 flex items-center gap-3">
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          >
            <span className="text-sm font-semibold uppercase">Cart</span>
            <span className="bg-accent text-white text-xs rounded-full px-2 py-0.5 min-w-[24px] text-center">
              {count}
            </span>
          </Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 border-b border-gray-100 text-sm font-semibold uppercase ${
                  n.accent ? 'text-accent' : 'text-ink'
                }`}
              >
                {n.label}
              </Link>
            ))}
            <form onSubmit={submitSearch} className="p-4 flex">
              <input
                className="input rounded-r-none"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="bg-ink text-white px-4 rounded-r">Go</button>
            </form>
          </nav>
        </div>
      )}
    </header>
  );
}
