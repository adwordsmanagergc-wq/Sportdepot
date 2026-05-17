const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const STANDARD_SIZES = ['6', '7', '8', '9', '10', '11', '12'];

const products = [
  {
    name: 'Air Velocity Pro',
    brand: 'Nike',
    description:
      'A lightweight neutral road runner with a responsive ZoomX foam midsole and breathable engineered mesh upper. Built for tempo days and daily mileage.',
    price: 219.95,
    salePrice: 179.0,
    category: 'men',
    sportType: 'running',
    colors: ['Black/Volt', 'White/Crimson'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900',
    ],
    isNew: true,
    isFeatured: true,
    popularity: 92,
    sizes: { 6: 4, 7: 8, 8: 12, 9: 0, 10: 6, 11: 3, 12: 0 },
  },
  {
    name: 'Ultraboost Glow',
    brand: 'Adidas',
    description:
      'Plush Boost cushioning meets a Primeknit upper for an adaptive, energy-returning ride. Perfect for long runs and street wear alike.',
    price: 259.0,
    salePrice: null,
    category: 'women',
    sportType: 'running',
    colors: ['Cloud White', 'Solar Pink'],
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900',
    ],
    isFeatured: true,
    popularity: 88,
    sizes: { 6: 5, 7: 7, 8: 4, 9: 2, 10: 0, 11: 0 },
  },
  {
    name: 'Court Vision Hi',
    brand: 'Jordan',
    description:
      'Iconic high-top silhouette with full-grain leather upper and encapsulated Air-Sole heel cushioning. Court-ready, street-approved.',
    price: 289.95,
    salePrice: 219.95,
    category: 'men',
    sportType: 'basketball',
    colors: ['Bred', 'Royal Blue'],
    images: [
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=900',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900',
    ],
    isFeatured: true,
    popularity: 95,
    sizes: { 7: 3, 8: 5, 9: 8, 10: 4, 11: 2, 12: 1 },
  },
  {
    name: 'Predator Strike FG',
    brand: 'Adidas',
    description:
      'Firm-ground soccer boot with controlskin upper and rubber strike zones for precision shooting. Lockdown fit, killer touch.',
    price: 199.0,
    salePrice: null,
    category: 'men',
    sportType: 'soccer',
    colors: ['Solar Red', 'Black'],
    images: [
      'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=900',
    ],
    popularity: 70,
    sizes: { 7: 2, 8: 6, 9: 9, 10: 5, 11: 0 },
  },
  {
    name: 'Metcon Train 7',
    brand: 'Nike',
    description:
      'Cross-training workhorse with a wide, stable heel for lifts and a flexible forefoot for sprints, plyos and rope climbs.',
    price: 179.0,
    salePrice: 139.0,
    category: 'women',
    sportType: 'training',
    colors: ['Black/Volt', 'Mint'],
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=900',
    ],
    popularity: 78,
    sizes: { 6: 4, 7: 6, 8: 0, 9: 0, 10: 2 },
  },
  {
    name: 'Classic Leather',
    brand: 'Reebok',
    description:
      'A timeless silhouette in soft leather with a die-cut EVA midsole. An everyday icon since 1983.',
    price: 129.95,
    salePrice: null,
    category: 'women',
    sportType: 'lifestyle',
    colors: ['Chalk White', 'Sand'],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900',
    ],
    isNew: true,
    popularity: 65,
    sizes: { 6: 5, 7: 5, 8: 5, 9: 5, 10: 3 },
  },
  {
    name: 'Suede Classic Mini',
    brand: 'Puma',
    description:
      'Kid-sized version of the legendary Suede. Premium suede upper, rubber outsole and a hook-and-loop strap for easy on/off.',
    price: 79.95,
    salePrice: 59.95,
    category: 'kids',
    sportType: 'lifestyle',
    colors: ['Black/White', 'Royal Blue'],
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900',
    ],
    isNew: true,
    popularity: 60,
    sizes: { 6: 6, 7: 6, 8: 6, 9: 0 },
  },
  {
    name: 'Gel-Cumulus 26',
    brand: 'Asics',
    description:
      'Daily trainer with FF BLAST PLUS ECO cushioning and PureGEL technology for a soft landing and smooth heel-to-toe transition.',
    price: 229.95,
    salePrice: null,
    category: 'men',
    sportType: 'running',
    colors: ['Deep Ocean', 'Carrier Grey'],
    images: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900',
    ],
    popularity: 82,
    sizes: { 7: 5, 8: 8, 9: 10, 10: 6, 11: 3, 12: 2 },
  },
  {
    name: 'GEL-Resolution Tennis',
    brand: 'Asics',
    description:
      'Court stability shoe for aggressive baseliners. DYNAWALL technology resists rollovers during lateral cuts.',
    price: 209.0,
    salePrice: null,
    category: 'women',
    sportType: 'tennis',
    colors: ['White/Pink', 'Black'],
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900',
    ],
    popularity: 55,
    sizes: { 6: 0, 7: 3, 8: 4, 9: 2, 10: 0 },
  },
  {
    name: 'RS-X Reinvention',
    brand: 'Puma',
    description:
      'Chunky retro runner with bold colour blocking and Running System cushioning. Built to turn heads.',
    price: 189.0,
    salePrice: 129.0,
    category: 'men',
    sportType: 'lifestyle',
    colors: ['White/Blue/Red', 'Triple Black'],
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900',
    ],
    popularity: 73,
    sizes: { 8: 5, 9: 6, 10: 0, 11: 0, 12: 1 },
  },
  {
    name: 'Fresh Foam X 1080',
    brand: 'New Balance',
    description:
      'Premium daily trainer with Fresh Foam X cushioning and a Hypoknit upper for plush comfort over the long haul.',
    price: 259.95,
    salePrice: 209.95,
    category: 'men',
    sportType: 'running',
    colors: ['Eclipse', 'White Mint'],
    images: [
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=900',
    ],
    isNew: true,
    popularity: 90,
    sizes: { 7: 4, 8: 7, 9: 9, 10: 5, 11: 2, 12: 1 },
  },
  {
    name: 'Kids Revolution 7',
    brand: 'Nike',
    description:
      'Lightweight everyday runner for kids with a soft foam midsole and a single-pull lace closure for a quick secure fit.',
    price: 79.95,
    salePrice: null,
    category: 'kids',
    sportType: 'running',
    colors: ['Pink Foam', 'Photon Blue'],
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=900',
    ],
    popularity: 50,
    sizes: { 6: 6, 7: 6, 8: 6, 9: 6 },
  },
];

function normalizeSizes(raw) {
  return STANDARD_SIZES.map((s) => ({
    size: s,
    stock: raw[s] ?? 0,
  })).filter((row) => row.stock !== undefined);
}

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@sportdepot.local';
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: 'Sport Depot Admin' },
  });

  console.log(`Admin ready: ${email} / ${password}`);

  // Clear existing products for an idempotent reseed
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        brand: p.brand,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        category: p.category,
        sportType: p.sportType,
        colors: JSON.stringify(p.colors),
        images: JSON.stringify(p.images),
        isNew: !!p.isNew,
        isFeatured: !!p.isFeatured,
        popularity: p.popularity || 0,
        sizes: { create: normalizeSizes(p.sizes) },
      },
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
