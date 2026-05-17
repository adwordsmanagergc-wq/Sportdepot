'use client';

import { create } from 'zustand';

const STORAGE_KEY = 'sd_cart_v1';

function load() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(items) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const useCart = create((set, get) => ({
  items: [],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    set({ items: load(), hydrated: true });
  },

  addItem: (item) => {
    const items = [...get().items];
    const key = `${item.productId}-${item.size}`;
    const existing = items.find((i) => `${i.productId}-${i.size}` === key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push({ ...item });
    }
    persist(items);
    set({ items });
  },

  updateQuantity: (productId, size, quantity) => {
    const items = get()
      .items.map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, quantity: Math.max(1, quantity) }
          : i,
      );
    persist(items);
    set({ items });
  },

  removeItem: (productId, size) => {
    const items = get().items.filter(
      (i) => !(i.productId === productId && i.size === size),
    );
    persist(items);
    set({ items });
  },

  clear: () => {
    persist([]);
    set({ items: [] });
  },

  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),

  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
