'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/products';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, hydrate, hydrated, subtotal, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 mb-6">Your cart is empty.</p>
          <Link href="/" className="btn-primary">Start Shopping</Link>
        </main>
        <Footer />
      </>
    );
  }

  const sub = subtotal();
  const shipping = sub >= 150 ? 0 : 12.95;
  const total = sub + shipping;

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.target).entries());
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Order failed');
      clear();
      router.push(`/order-success?id=${json.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="font-display text-4xl tracking-wider mb-8">CHECKOUT</h1>
        <form onSubmit={submit} className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Section title="Contact">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" name="customerName" required />
                <Field label="Email" name="customerEmail" type="email" required />
                <Field label="Phone" name="customerPhone" type="tel" />
              </div>
            </Section>

            <Section title="Shipping Address">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Address line 1" name="addressLine1" required full />
                <Field label="Address line 2 (optional)" name="addressLine2" full />
                <Field label="City" name="city" required />
                <Field label="State" name="state" required />
                <Field label="Postcode" name="postcode" required />
                <Field label="Country" name="country" defaultValue="Australia" required />
              </div>
            </Section>

            <Section title="Order Notes (optional)">
              <textarea
                name="notes"
                rows="3"
                className="input"
                placeholder="Any delivery instructions..."
              />
            </Section>

            <Section title="Payment">
              <p className="text-sm text-gray-600">
                This demo collects orders only — no real payment is processed.
                Production would integrate Stripe, PayPal, etc.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
                <strong>Cash on Delivery</strong> — pay when your order arrives.
              </div>
            </Section>

            {error && (
              <div className="border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <aside className="card p-6 h-fit sticky top-32">
            <h2 className="font-bold uppercase tracking-wide mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}`} className="flex gap-3 text-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.imageUrl || '/placeholder.svg'} alt="" className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">{i.name}</div>
                    <div className="text-xs text-gray-500">Size {i.size} · Qty {i.quantity}</div>
                  </div>
                  <div className="font-semibold">{formatPrice(i.unitPrice * i.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3">
              <Row label="Subtotal" value={formatPrice(sub)} />
              <Row label="Shipping" value={shipping === 0 ? 'FREE' : formatPrice(shipping)} />
              <div className="border-t border-gray-200 my-3" />
              <Row label="Total" value={formatPrice(total)} bold />
            </div>
            <button disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? 'Placing order…' : 'Place Order'}
            </button>
          </aside>
        </form>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className="card p-6">
      <h2 className="font-bold uppercase tracking-wide mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, name, type = 'text', required, defaultValue, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="label">{label}{required && ' *'}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="input"
      />
    </div>
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
