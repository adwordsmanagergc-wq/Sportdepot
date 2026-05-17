import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function saveLocalImage(file) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name || '').toLowerCase() || '.jpg';
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

export async function uploadToCloudinary(file) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) {
    throw new Error('Cloudinary env vars are missing');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'sport-depot';

  // signature = sha1("folder=...&timestamp=...{secret}")
  const toSign = `folder=${folder}&timestamp=${timestamp}${secret}`;
  const signature = crypto.createHash('sha1').update(toSign).digest('hex');

  const form = new FormData();
  form.append('file', base64);
  form.append('api_key', key);
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);
  form.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.status}`);
  const json = await res.json();
  return json.secure_url;
}

export async function uploadImage(file) {
  if (process.env.UPLOAD_PROVIDER === 'cloudinary') {
    return uploadToCloudinary(file);
  }
  return saveLocalImage(file);
}
