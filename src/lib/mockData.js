// Fallback data used when DATABASE_URL isn't configured or the DB is
// unreachable. Lets the storefront render in "demo mode" so the design
// can be reviewed without backend setup.

const STANDARD_SIZES = ['6', '7', '8', '9', '10', '11', '12'];

function sizes(stocks) {
  return STANDARD_SIZES.map((s) => ({ size: s, stock: stocks[s] ?? 0 }))
    .filter((row) => row.stock !== undefined);
}

const RAW = [
  {
    id: 'demo-1', name: 'Air Velocity Pro', brand: 'Nike',
    description: 'Lightweight neutral road runner with responsive ZoomX foam and breathable engineered mesh upper. Built for tempo days and daily mileage.',
    price: 219.95, salePrice: 179.0, category: 'men', sportType: 'running',
    colors: ['Black/Volt', 'White/Crimson'],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900'],
    isNew: true, isFeatured: true, popularity: 92,
    sizes: sizes({ '6': 4, '7': 8, '8': 12, '9': 0, '10': 6, '11': 3, '12': 0 }),
  },
  {
    id: 'demo-2', name: 'Ultraboost Glow', brand: 'Adidas',
    description: 'Plush Boost cushioning meets a Primeknit upper for an adaptive, energy-returning ride.',
    price: 259.0, salePrice: null, category: 'women', sportType: 'running',
    colors: ['Cloud White', 'Solar Pink'],
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900'],
    isFeatured: true, popularity: 88,
    sizes: sizes({ '6': 5, '7': 7, '8': 4, '9': 2, '10': 0, '11': 0 }),
  },
  {
    id: 'demo-3', name: 'Court Vision Hi', brand: 'Jordan',
    description: 'Iconic high-top silhouette with full-grain leather upper and encapsulated Air-Sole heel cushioning.',
    price: 289.95, salePrice: 219.95, category: 'men', sportType: 'basketball',
    colors: ['Bred', 'Royal Blue'],
    images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=900'],
    isFeatured: true, popularity: 95,
    sizes: sizes({ '7': 3, '8': 5, '9': 8, '10': 4, '11': 2, '12': 1 }),
  },
  {
    id: 'demo-4', name: 'Predator Strike FG', brand: 'Adidas',
    description: 'Firm-ground soccer boot with controlskin upper and rubber strike zones for precision shooting.',
    price: 199.0, salePrice: null, category: 'men', sportType: 'soccer',
    colors: ['Solar Red', 'Black'],
    images: ['https://images.unsplash.com/photo-1511886929837-354d827aae26?w=900'],
    popularity: 70,
    sizes: sizes({ '7': 2, '8': 6, '9': 9, '10': 5, '11': 0 }),
  },
  {
    id: 'demo-5', name: 'Metcon Train 7', brand: 'Nike',
    description: 'Cross-training workhorse with a wide, stable heel for lifts and a flexible forefoot for sprints and plyos.',
    price: 179.0, salePrice: 139.0, category: 'women', sportType: 'training',
    colors: ['Black/Volt', 'Mint'],
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=900'],
    popularity: 78,
    sizes: sizes({ '6': 4, '7': 6, '8': 0, '9': 0, '10': 2 }),
  },
  {
    id: 'demo-6', name: 'Classic Leather', brand: 'Reebok',
    description: 'A timeless silhouette in soft leather with a die-cut EVA midsole. An everyday icon since 1983.',
    price: 129.95, salePrice: null, category: 'women', sportType: 'lifestyle',
    colors: ['Chalk White', 'Sand'],
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900'],
    isNew: true, popularity: 65,
    sizes: sizes({ '6': 5, '7': 5, '8': 5, '9': 5, '10': 3 }),
  },
  {
    id: 'demo-7', name: 'Suede Classic Mini', brand: 'Puma',
    description: 'Kid-sized version of the legendary Suede. Premium suede upper, rubber outsole and a hook-and-loop strap.',
    price: 79.95, salePrice: 59.95, category: 'kids', sportType: 'lifestyle',
    colors: ['Black/White', 'Royal Blue'],
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900'],
    isNew: true, popularity: 60,
    sizes: sizes({ '6': 6, '7': 6, '8': 6, '9': 0 }),
  },
  {
    id: 'demo-8', name: 'Gel-Cumulus 26', brand: 'Asics',
    description: 'Daily trainer with FF BLAST PLUS ECO cushioning and PureGEL technology for a soft landing.',
    price: 229.95, salePrice: null, category: 'men', sportType: 'running',
    colors: ['Deep Ocean', 'Carrier Grey'],
    images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900'],
    popularity: 82,
    sizes: sizes({ '7': 5, '8': 8, '9': 10, '10': 6, '11': 3, '12': 2 }),
  },
  {
    id: 'demo-9', name: 'RS-X Reinvention', brand: 'Puma',
    description: 'Chunky retro runner with bold colour blocking and Running System cushioning.',
    price: 189.0, salePrice: 129.0, category: 'men', sportType: 'lifestyle',
    colors: ['White/Blue/Red', 'Triple Black'],
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900'],
    popularity: 73,
    sizes: sizes({ '8': 5, '9': 6, '10': 0, '11': 0, '12': 1 }),
  },
  {
    id: 'demo-10', name: 'Fresh Foam X 1080', brand: 'New Balance',
    description: 'Premium daily trainer with Fresh Foam X cushioning and a Hypoknit upper for plush comfort.',
    price: 259.95, salePrice: 209.95, category: 'men', sportType: 'running',
    colors: ['Eclipse', 'White Mint'],
    images: ['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=900'],
    isNew: true, popularity: 90,
    sizes: sizes({ '7': 4, '8': 7, '9': 9, '10': 5, '11': 2, '12': 1 }),
  },
  {
    id: 'demo-11', name: 'Kids Revolution 7', brand: 'Nike',
    description: 'Lightweight everyday runner for kids with a soft foam midsole and single-pull lace closure.',
    price: 79.95, salePrice: null, category: 'kids', sportType: 'running',
    colors: ['Pink Foam', 'Photon Blue'],
    images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=900'],
    popularity: 50,
    sizes: sizes({ '6': 6, '7': 6, '8': 6, '9': 6 }),
  },
  {
    id: 'demo-12', name: 'GEL-Resolution Tennis', brand: 'Asics',
    description: 'Court stability shoe for aggressive baseliners with DYNAWALL technology.',
    price: 209.0, salePrice: null, category: 'women', sportType: 'tennis',
    colors: ['White/Pink', 'Black'],
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900'],
    popularity: 55,
    sizes: sizes({ '6': 0, '7': 3, '8': 4, '9': 2, '10': 0 }),
  },
];

function shape(p) {
  const totalStock = p.sizes.reduce((a, s) => a + s.stock, 0);
  return {
    ...p,
    isActive: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    totalStock,
    isSoldOut: totalStock === 0,
    onSale: p.salePrice != null && p.salePrice < p.price,
  };
}

export const MOCK_PRODUCTS = RAW.map(shape);

export function mockProduct(id) {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function mockByCategory(slug) {
  if (slug === 'all') return MOCK_PRODUCTS;
  if (slug === 'sale') return MOCK_PRODUCTS.filter((p) => p.onSale);
  if (slug === 'new') return MOCK_PRODUCTS.filter((p) => p.isNew);
  return MOCK_PRODUCTS.filter((p) => p.category === slug);
}

export const MOCK_BRANDS = [...new Set(MOCK_PRODUCTS.map((p) => p.brand))].sort();
