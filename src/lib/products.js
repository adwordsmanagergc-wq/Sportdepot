// Helpers for shaping Product DB rows into client-friendly objects.

export function serializeProduct(p) {
  if (!p) return null;
  const sizes = (p.sizes || []).slice().sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
  const totalStock = sizes.reduce((sum, s) => sum + s.stock, 0);
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    description: p.description,
    price: p.price,
    salePrice: p.salePrice,
    category: p.category,
    sportType: p.sportType,
    colors: safeParse(p.colors, []),
    images: safeParse(p.images, []),
    isActive: p.isActive,
    isArchived: p.isArchived,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    popularity: p.popularity,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    sizes,
    totalStock,
    isSoldOut: totalStock === 0,
    onSale: p.salePrice != null && p.salePrice < p.price,
  };
}

function safeParse(value, fallback) {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  try {
    const v = JSON.parse(value);
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function formatPrice(n) {
  if (n == null) return '';
  return `$${Number(n).toFixed(2)}`;
}

export const CATEGORIES = [
  { slug: 'men', label: 'Men' },
  { slug: 'women', label: 'Women' },
  { slug: 'kids', label: 'Kids' },
];

export const SPORT_TYPES = [
  { slug: 'running', label: 'Running' },
  { slug: 'basketball', label: 'Basketball' },
  { slug: 'training', label: 'Training' },
  { slug: 'soccer', label: 'Soccer' },
  { slug: 'tennis', label: 'Tennis' },
  { slug: 'lifestyle', label: 'Lifestyle' },
];

export const ALL_SIZES = ['6', '7', '8', '9', '10', '11', '12'];
