'use client';

import { Fragment, useState } from 'react';
import { formatPrice } from '@/lib/products';

const STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'];

export default function OrdersTable({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  async function updateStatus(id, status) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <Pill label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
        {STATUSES.map((s) => (
          <Pill
            key={s}
            label={`${s} (${orders.filter((o) => o.status === s).length})`}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Placed</th>
              <th className="p-3">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <Fragment key={o.id}>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="p-3">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-xs text-gray-500">{o.customerEmail}</div>
                  </td>
                  <td className="p-3">{o.items.length}</td>
                  <td className="p-3">{formatPrice(o.total)}</td>
                  <td className="p-3 text-gray-500">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="input py-1 text-xs capitalize"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                      className="text-accent hover:underline text-sm"
                    >
                      {expanded === o.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {expanded === o.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="p-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Items</h4>
                          <ul className="space-y-2">
                            {o.items.map((i) => (
                              <li key={i.id} className="flex justify-between text-sm">
                                <span>{i.brand} {i.productName} (size {i.size}) × {i.quantity}</span>
                                <span>{formatPrice(i.unitPrice * i.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 pt-3 border-t text-sm">
                            <Row label="Subtotal" value={formatPrice(o.subtotal)} />
                            <Row label="Shipping" value={o.shipping === 0 ? 'FREE' : formatPrice(o.shipping)} />
                            <Row label="Total" value={formatPrice(o.total)} bold />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Shipping address</h4>
                          <address className="text-sm not-italic text-gray-700 leading-relaxed">
                            {o.customerName}<br />
                            {o.addressLine1}<br />
                            {o.addressLine2 && <>{o.addressLine2}<br /></>}
                            {o.city}, {o.state} {o.postcode}<br />
                            {o.country}<br />
                            {o.customerPhone && <>📞 {o.customerPhone}</>}
                          </address>
                          {o.notes && (
                            <>
                              <h4 className="font-semibold mt-3 mb-1">Notes</h4>
                              <p className="text-sm text-gray-700">{o.notes}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">No orders.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs uppercase font-semibold px-3 py-1.5 rounded-full border capitalize ${
        active ? 'bg-ink text-white border-ink' : 'border-gray-300 hover:border-ink'
      }`}
    >
      {label}
    </button>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between py-0.5 ${bold ? 'font-bold' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
