import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// body: { updates: [{ productId, size, stock }] }
export async function POST(req) {
  const { updates = [] } = await req.json();
  for (const u of updates) {
    if (!u.productId || !u.size) continue;
    const existing = await prisma.productSize.findUnique({
      where: { productId_size: { productId: u.productId, size: String(u.size) } },
    });
    if (existing) {
      await prisma.productSize.update({
        where: { id: existing.id },
        data: { stock: Number(u.stock || 0) },
      });
    } else {
      await prisma.productSize.create({
        data: { productId: u.productId, size: String(u.size), stock: Number(u.stock || 0) },
      });
    }
  }
  return NextResponse.json({ updated: updates.length });
}
