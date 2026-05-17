import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="relative bg-ink text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 grid md:grid-cols-2 gap-8">
        <div>
          <span className="badge bg-brand text-white mb-4">NEW SEASON DROP</span>
          <h1 className="font-display text-5xl md:text-7xl leading-none tracking-wide mt-3">
            RUN FASTER.<br/>
            HIT HARDER.<br/>
            <span className="text-yellow-300">GEAR UP.</span>
          </h1>
          <p className="mt-6 text-gray-200 max-w-md text-lg">
            Performance footwear from Nike, Adidas, Asics, Puma and more — engineered for every sport.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop/new" className="btn-primary">Shop New Arrivals</Link>
            <Link href="/shop/sale" className="btn-outline border-white text-white hover:bg-white hover:text-ink">
              View Sale
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
