import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

const PAGES = {
  shipping: {
    title: 'Shipping & Delivery',
    body: [
      'Free standard shipping on all orders over $150. Orders under $150 ship for a flat $12.95.',
      'Standard delivery: 3–7 business days. Express: 1–3 business days.',
      'Orders placed before 1pm AEST on a business day are dispatched the same day.',
    ],
  },
  returns: {
    title: 'Returns & Exchanges',
    body: [
      'Unworn items can be returned within 30 days for a full refund or exchange.',
      'Items must be in their original box with all tags attached.',
      'Initiate a return by emailing returns@sportdepot.com with your order number.',
    ],
  },
  'size-guide': {
    title: 'Size Guide',
    body: [
      'Our sizes are listed in AU/UK. For US Men sizes, add 0.5. For US Women, add 1.5.',
      'For the best fit, measure your foot at the end of the day when it’s at its largest.',
    ],
  },
  contact: {
    title: 'Contact Us',
    body: [
      'Email: support@sportdepot.com',
      'Phone: 1-800-SPORT-DEPOT',
      'Hours: Mon–Sat 9am–6pm AEST',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: ['We only collect the personal information needed to process your order. We never sell your data.'],
  },
  terms: {
    title: 'Terms of Service',
    body: ['By using Sport Depot you agree to our standard e-commerce terms. Prices are in AUD and include GST.'],
  },
};

export default function HelpPage({ params }) {
  const page = PAGES[params.slug];
  if (!page) notFound();
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl tracking-wider mb-6">{page.title}</h1>
        <div className="prose max-w-none space-y-4 text-gray-700">
          {page.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </main>
      <Footer />
    </>
  );
}
