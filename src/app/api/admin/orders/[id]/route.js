import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ALLOWED = ['pending', 'shipped', 'delivered', 'cancelled'];

export async function PUT(req, { params }) {
  const { status } = await req.json();
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json({ order });
}
