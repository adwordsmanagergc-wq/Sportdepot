import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { serializeProduct } from '@/lib/products';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const includeArchived = searchParams.get('archived') === 'true';
  const where = includeArchived ? {} : { isArchived: false };
  const rows = await prisma.product.findMany({
    where,
    include: { sizes: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ products: rows.map(serializeProduct) });
}

export async function POST(req) {
  const body = await req.json();
  const {
    name, brand, description, price, salePrice, category, sportType,
    colors = [], images = [], sizes = [],
    isNew = false, isFeatured = false, isActive = true,
  } = body;

  if (!name || !brand || !category || !sportType || price == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name, brand, description: description || '',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      category, sportType,
      colors: JSON.stringify(colors),
      images: JSON.stringify(images),
      isNew: !!isNew,
      isFeatured: !!isFeatured,
      isActive: !!isActive,
      sizes: {
        create: sizes
          .filter((s) => s && s.size)
          .map((s) => ({ size: String(s.size), stock: Number(s.stock || 0) })),
      },
    },
    include: { sizes: true },
  });

  return NextResponse.json({ product: serializeProduct(product) });
}
