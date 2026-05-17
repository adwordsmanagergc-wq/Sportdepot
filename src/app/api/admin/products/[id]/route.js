import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { serializeProduct } from '@/lib/products';

export async function GET(_req, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { sizes: true },
  });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product: serializeProduct(product) });
}

export async function PUT(req, { params }) {
  const body = await req.json();
  const {
    name, brand, description, price, salePrice, category, sportType,
    colors, images, sizes,
    isNew, isFeatured, isActive, isArchived,
  } = body;

  const data = {};
  if (name !== undefined) data.name = name;
  if (brand !== undefined) data.brand = brand;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = Number(price);
  if (salePrice !== undefined) data.salePrice = salePrice ? Number(salePrice) : null;
  if (category !== undefined) data.category = category;
  if (sportType !== undefined) data.sportType = sportType;
  if (colors !== undefined) data.colors = JSON.stringify(colors);
  if (images !== undefined) data.images = JSON.stringify(images);
  if (isNew !== undefined) data.isNew = !!isNew;
  if (isFeatured !== undefined) data.isFeatured = !!isFeatured;
  if (isActive !== undefined) data.isActive = !!isActive;
  if (isArchived !== undefined) data.isArchived = !!isArchived;

  await prisma.product.update({ where: { id: params.id }, data });

  if (Array.isArray(sizes)) {
    // Upsert each size; delete missing ones.
    const existing = await prisma.productSize.findMany({ where: { productId: params.id } });
    const keep = new Set();
    for (const s of sizes) {
      if (!s || !s.size) continue;
      keep.add(String(s.size));
      const found = existing.find((e) => e.size === String(s.size));
      if (found) {
        await prisma.productSize.update({
          where: { id: found.id },
          data: { stock: Number(s.stock || 0) },
        });
      } else {
        await prisma.productSize.create({
          data: {
            productId: params.id,
            size: String(s.size),
            stock: Number(s.stock || 0),
          },
        });
      }
    }
    for (const e of existing) {
      if (!keep.has(e.size)) {
        await prisma.productSize.delete({ where: { id: e.id } });
      }
    }
  }

  const updated = await prisma.product.findUnique({
    where: { id: params.id },
    include: { sizes: true },
  });
  return NextResponse.json({ product: serializeProduct(updated) });
}

export async function DELETE(_req, { params }) {
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
