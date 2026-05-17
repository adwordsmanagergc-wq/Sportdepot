'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/products';

export default function AddToCartPanel({ product }) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSize = product.sizes.find((s) => s.size === size);
  const maxQty = selectedSize?.stock ?? 0;
  const canAdd = size && maxQty > 0 && !product.isSoldOut;
  const unitPrice = product.onSale ? product.salePrice : product.price;

  function addToCart() {
    if (!canAdd) return;
    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      size,
      quantity: Math.min(qty, maxQty),
      unitPrice,
      imageUrl: product.images?.[0] || null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function buyNow() {
    if (!canAdd) return;
    addToCart();
    router.push('/cart');
  }

  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-3">
        {product.onSale ? (
          <>
            <span className="text-3xl font-bold text-accent">{formatPrice(product.salePrice)}</span>
            <span className="text-gray-400 line-through">{formatPrice(product.price)}</span>
            <span className="badge-sale">
              -{Math.round((1 - product.salePrice / product.price) * 100)}%
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        )}
      </div>

      {product.colors?.length > 0 && (
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide mb-2">
            Colour
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <span key={c} className="border border-gray-300 rounded px-3 py-1.5 text-sm">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold uppercase tracking-wide">Size</span>
          <a href="#" className="text-xs text-accent hover:underline">Size guide</a>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {product.sizes.map((s) => {
            const out = s.stock === 0;
            const selected = size === s.size;
            return (
              <button
                key={s.size}
                disabled={out}
                onClick={() => { setSize(s.size); setQty(1); }}
                className={`relative border-2 py-2 text-sm font-semibold rounded ${
                  selected
                    ? 'border-accent text-accent'
                    : out
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed line-through'
                    : 'border-gray-300 hover:border-ink'
                }`}
              >
                {s.size}
                {!out && s.stock <= 3 && (
                  <span className="absolute -top-1 -right-1 text-[9px] bg-accent text-white rounded-full px-1">
                    {s.stock}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {size && selectedSize && (
          <p className="text-xs text-gray-600 mt-2">
            {selectedSize.stock > 0
              ? `${selectedSize.stock} pair${selectedSize.stock === 1 ? '' : 's'} in stock`
              : 'Out of stock'}
          </p>
        )}
      </div>

      <div>
        <div className="text-sm font-semibold uppercase tracking-wide mb-2">Quantity</div>
        <div className="inline-flex border border-gray-300 rounded overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-gray-100"
            aria-label="Decrease"
          >−</button>
          <span className="px-4 py-2 min-w-[3rem] text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(maxQty || 1, q + 1))}
            disabled={!canAdd || qty >= maxQty}
            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
            aria-label="Increase"
          >+</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={addToCart} disabled={!canAdd} className="btn-primary flex-1">
          {product.isSoldOut ? 'Sold Out' : added ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>
        <button onClick={buyNow} disabled={!canAdd} className="btn-dark flex-1">
          Buy Now
        </button>
      </div>

      <ul className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-200">
        <li>✓ Free shipping on orders over $150</li>
        <li>✓ 30-day free returns</li>
        <li>✓ Authentic guarantee</li>
      </ul>
    </div>
  );
}
