import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="inline-block bg-brand rounded-lg p-3 mb-4">
            <Image
              src="/logo.png"
              alt="Sport Depot"
              width={180}
              height={108}
              className="h-16 w-auto"
            />
          </div>
          <p className="text-sm text-gray-300">
            Performance footwear for every sport. Authentic gear from the brands you love.
          </p>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wide mb-3 text-sm">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/shop/men" className="hover:text-accent">Men</Link></li>
            <li><Link href="/shop/women" className="hover:text-accent">Women</Link></li>
            <li><Link href="/shop/kids" className="hover:text-accent">Kids</Link></li>
            <li><Link href="/shop/sale" className="hover:text-accent">Sale</Link></li>
            <li><Link href="/shop/new" className="hover:text-accent">New Arrivals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wide mb-3 text-sm">Help</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/help/shipping" className="hover:text-accent">Shipping & Delivery</Link></li>
            <li><Link href="/help/returns" className="hover:text-accent">Returns & Exchanges</Link></li>
            <li><Link href="/help/size-guide" className="hover:text-accent">Size Guide</Link></li>
            <li><Link href="/help/contact" className="hover:text-accent">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wide mb-3 text-sm">Get in Touch</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>1-800-SPORT-DEPOT</li>
            <li>support@sportdepot.com</li>
            <li>Mon–Sat 9am–6pm AEST</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-brand hover:border-brand">IG</a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-brand hover:border-brand">FB</a>
            <a href="#" aria-label="TikTok" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-brand hover:border-brand">TT</a>
            <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-brand hover:border-brand">YT</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-gray-400 flex flex-col md:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} Sport Depot. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/help/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/help/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
