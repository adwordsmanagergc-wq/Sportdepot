import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">No products match your filters.</p>
        <p className="text-sm mt-2">Try clearing some filters or browsing another category.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
