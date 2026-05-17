import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req) {
  const body = await req.json();
  const {
    customerName, customerEmail, customerPhone,
    addressLine1, addressLine2, city, state, postcode, country,
    notes, items,
  } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }
  if (!customerName || !customerEmail || !addressLine1 || !city || !state || !postcode) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Validate stock and decrement atomically
  try {
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsCreate = [];

      for (const i of items) {
        const product = await tx.product.findUnique({
          where: { id: i.productId },
          include: { sizes: true },
        });
        if (!product || product.isArchived) {
          throw new Error(`Product no longer available: ${i.name}`);
        }
        const sizeRow = product.sizes.find((s) => s.size === i.size);
        if (!sizeRow || sizeRow.stock < i.quantity) {
          throw new Error(`Insufficient stock for ${product.name} size ${i.size}`);
        }
        const unitPrice =
          product.salePrice != null && product.salePrice < product.price
            ? product.salePrice
            : product.price;

        subtotal += unitPrice * i.quantity;
        orderItemsCreate.push({
          productId: product.id,
          productName: product.name,
          brand: product.brand,
          size: i.size,
          quantity: i.quantity,
          unitPrice,
          imageUrl: i.imageUrl || null,
        });

        await tx.productSize.update({
          where: { id: sizeRow.id },
          data: { stock: { decrement: i.quantity } },
        });
        await tx.product.update({
          where: { id: product.id },
          data: { popularity: { increment: i.quantity } },
        });
      }

      const shipping = subtotal >= 150 ? 0 : 12.95;
      const total = subtotal + shipping;

      return tx.order.create({
        data: {
          customerName, customerEmail, customerPhone,
          addressLine1, addressLine2, city, state, postcode,
          country: country || 'Australia',
          notes,
          subtotal, shipping, total,
          items: { create: orderItemsCreate },
        },
      });
    });

    return NextResponse.json({ id: order.id });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Order failed' },
      { status: 400 },
    );
  }
}
