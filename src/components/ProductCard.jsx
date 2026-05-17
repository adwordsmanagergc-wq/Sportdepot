import Link from 'next/link';
import { formatPrice } from '@/lib/products';

export default function ProductCard({ product }) {
  const img = product.images?.[0] || '/placeholder.svg';
  const inStockSizes = (product.sizes || []).filter((s) => s.stock > 0);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block card overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.onSale && <span className="badge-sale">Sale</span>}
          {product.isNew && <span className="badge-new">New</span>}
        </div>
        {product.isSoldOut && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-ink text-white text-sm px-3 py-1.5">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs uppercase tracking-wider text-gray-500">{product.brand}</div>
        <h3 className="font-semibold mt-1 line-clamp-2 min-h-[3rem]">{product.name}</h3>

        <div className="mt-2 flex items-baseline gap-2">
          {product.onSale ? (
            <>
              <span className="text-accent font-bold">{formatPrice(product.salePrice)}</span>
              <span className="text-gray-400 line-through text-sm">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-bold">{formatPrice(product.price)}</span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {inStockSizes.slice(0, 6).map((s) => (
            <span
              key={s.size}
              className="text-[10px] border border-gray-300 px-1.5 py-0.5 rounded text-gray-700"
            >
              {s.size}
            </span>
          ))}
          {inStockSizes.length === 0 && !product.isSoldOut && (
            <span className="text-[10px] text-gray-400">Sizes loading…</span>
          )}
        </div>
      </div>
    </Link>
  );
}
