import Link from 'next/link';
import AdminLogout from '@/components/admin/AdminLogout';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/products/new', label: 'Add Product' },
  { href: '/admin/stock', label: 'Stock' },
  { href: '/admin/orders', label: 'Orders' },
];

export default function AdminPanelLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6 flex-wrap">
          <Link href="/admin" className="font-display text-2xl tracking-wider">
            SPORT<span className="text-accent">DEPOT</span>{' '}
            <span className="text-xs uppercase text-gray-400">Admin</span>
          </Link>
          <nav className="flex gap-5 flex-wrap">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm uppercase tracking-wide hover:text-accent"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="text-xs uppercase text-gray-300 hover:text-white">
              View Store
            </Link>
            <AdminLogout />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
