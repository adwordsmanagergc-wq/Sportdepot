'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ALL_SIZES, CATEGORIES, SPORT_TYPES } from '@/lib/products';

const DEFAULT_SIZES = ALL_SIZES.map((s) => ({ size: s, stock: 0 }));

export default function ProductForm({ initial = null }) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    name: initial?.name || '',
    brand: initial?.brand || '',
    description: initial?.description || '',
    price: initial?.price ?? '',
    salePrice: initial?.salePrice ?? '',
    category: initial?.category || 'men',
    sportType: initial?.sportType || 'running',
    colors: (initial?.colors || []).join(', '),
    isNew: initial?.isNew || false,
    isFeatured: initial?.isFeatured || false,
    isActive: initial?.isActive ?? true,
  });

  const [images, setImages] = useState(initial?.images || []);
  const [sizes, setSizes] = useState(
    initial?.sizes?.length
      ? ALL_SIZES.map((s) => {
          const found = initial.sizes.find((x) => x.size === s);
          return { size: s, stock: found ? found.stock : 0 };
        })
      : DEFAULT_SIZES,
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function setSize(s, stock) {
    setSizes((xs) =>
      xs.map((row) => (row.size === s ? { ...row, stock: Number(stock) || 0 } : row)),
    );
  }

  async function uploadFiles(fileList) {
    if (!fileList?.length) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      [...fileList].forEach((f) => fd.append('files', f));
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setImages((cur) => [...cur, ...json.urls]);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx) {
    setImages((cur) => cur.filter((_, i) => i !== idx));
  }

  function moveImage(idx, delta) {
    setImages((cur) => {
      const arr = [...cur];
      const tgt = idx + delta;
      if (tgt < 0 || tgt >= arr.length) return arr;
      [arr[idx], arr[tgt]] = [arr[tgt], arr[idx]];
      return arr;
    });
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
        images,
        sizes,
      };
      const url = isEdit ? `/api/admin/products/${initial.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      router.push('/admin/products');
      router.refresh();
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <section className="card p-6 space-y-4">
          <h2 className="font-bold uppercase tracking-wide">Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product name" value={form.name} onChange={(v) => set('name', v)} required />
            <Field label="Brand" value={form.brand} onChange={(v) => set('brand', v)} required />
            <Field label="Price (AUD)" type="number" step="0.01" value={form.price} onChange={(v) => set('price', v)} required />
            <Field label="Sale price (optional)" type="number" step="0.01" value={form.salePrice} onChange={(v) => set('salePrice', v)} />
            <Select label="Category" value={form.category} onChange={(v) => set('category', v)}
              options={CATEGORIES.map((c) => [c.slug, c.label])} />
            <Select label="Sport type" value={form.sportType} onChange={(v) => set('sportType', v)}
              options={SPORT_TYPES.map((s) => [s.slug, s.label])} />
            <Field label="Colors (comma separated)" value={form.colors} onChange={(v) => set('colors', v)} full />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={5}
              className="input"
            />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-bold uppercase tracking-wide">Images</h2>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              uploadFiles(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragging ? 'border-accent bg-accent-light' : 'border-gray-300 hover:border-ink'
            }`}
            onClick={() => document.getElementById('file-input').click()}
          >
            <p className="text-sm text-gray-600">
              {uploading ? 'Uploading…' : 'Drag & drop images here, or click to browse'}
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadFiles(e.target.files)}
            />
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((src, i) => (
                <div key={src + i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="aspect-square w-full object-cover rounded" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 badge bg-ink text-white text-[10px]">Cover</span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                    <button type="button" onClick={() => moveImage(i, -1)} className="bg-white text-ink rounded px-2 py-1 text-xs">←</button>
                    <button type="button" onClick={() => moveImage(i, 1)} className="bg-white text-ink rounded px-2 py-1 text-xs">→</button>
                    <button type="button" onClick={() => removeImage(i)} className="bg-accent text-white rounded px-2 py-1 text-xs">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card p-6">
          <h2 className="font-bold uppercase tracking-wide mb-4">Stock per Size</h2>
          <p className="text-xs text-gray-500 mb-4">
            Setting a size to <strong>0</strong> marks it Sold Out. When every size is 0 the
            product is marked as fully sold out on the storefront.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {sizes.map((s) => (
              <div key={s.size}>
                <label className="label">Size {s.size}</label>
                <input
                  type="number"
                  min="0"
                  value={s.stock}
                  onChange={(e) => setSize(s.size, e.target.value)}
                  className="input"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="card p-6 space-y-3">
          <h2 className="font-bold uppercase tracking-wide">Flags</h2>
          <Toggle label="Active (visible on store)" checked={form.isActive} onChange={(v) => set('isActive', v)} />
          <Toggle label="Mark as NEW" checked={form.isNew} onChange={(v) => set('isNew', v)} />
          <Toggle label="Featured on homepage" checked={form.isFeatured} onChange={(v) => set('isFeatured', v)} />
        </section>

        {error && <div className="border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <button disabled={submitting || uploading} className="btn-primary w-full">
          {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </aside>
    </form>
  );
}

function Field({ label, value, onChange, type = 'text', required, step, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="label">{label}{required && ' *'}</label>
      <input
        type={type}
        step={step}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-accent"
      />
      {label}
    </label>
  );
}
