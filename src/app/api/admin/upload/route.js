import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/upload';

export async function POST(req) {
  const form = await req.formData();
  const files = form.getAll('files');
  if (!files.length) {
    return NextResponse.json({ error: 'No files' }, { status: 400 });
  }
  const urls = [];
  for (const f of files) {
    if (typeof f === 'string') continue;
    try {
      urls.push(await uploadImage(f));
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  return NextResponse.json({ urls });
}
