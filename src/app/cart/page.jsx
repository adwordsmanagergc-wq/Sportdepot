'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/products';

export default function CartPage() {
  const { items, hydrate, hydrated, updateQuantity, removeItem, subtotal } = useCart();

  useEffect(() => { hydrate(); }, [hydrate]);

  if (!hydrated) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">Loading…</main>
        <Footer />
      </>
    );
  }

  const sub = subtotal();
  const shipping = sub >= 150 || sub === 0 ? 0 : 12.95;
  const total = sub + shipping;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="font-display text-4xl tracking-wider mb-8">YOUR CART</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-6">Your cart is empty.</p>
            <Link href="/" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="card p-4 flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl || '/placeholder.svg'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="text-xs uppercase text-gray-500">{item.brand}</div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">Size {item.size}</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="inline-flex border border-gray-300 rounded overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.quantity - 1)
                          }
                          className="px-2 hover:bg-gray-100"
                        >−</button>
                        <span className="px-3 py-1 min-w-[2.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.size, item.quantity + 1)
                          }
                          className="px-2 hover:bg-gray-100"
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="text-sm text-gray-500 hover:text-accent"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>
                    <div className="text-xs text-gray-500">{formatPrice(item.unitPrice)} each</div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="card p-6 h-fit sticky top-32">
              <h2 className="font-bold uppercase tracking-wide mb-4">Order Summary</h2>
              <Row label="Subtotal" value={formatPrice(sub)} />
              <Row label="Shipping" value={shipping === 0 ? 'FREE' : formatPrice(shipping)} />
              <div className="border-t border-gray-200 my-3" />
              <Row label="Total" value={formatPrice(total)} bold />
              <Link href="/checkout" className="btn-primary w-full mt-6">
                Checkout
              </Link>
              <Link href="/" className="block text-center text-sm text-gray-600 mt-3 hover:text-accent">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between text-sm py-1 ${bold ? 'font-bold text-base' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
