import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function OrderSuccessPage({ searchParams }) {
  const id = searchParams?.id;
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="font-display text-4xl tracking-wider">ORDER PLACED!</h1>
        <p className="text-gray-600 mt-4">
          Thanks for shopping with Sport Depot. We&apos;ve received your order
          {id ? <> <strong>#{id.slice(0, 8).toUpperCase()}</strong></> : null} and will
          be in touch shortly with shipping details.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">Continue Shopping</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
