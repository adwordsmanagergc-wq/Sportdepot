'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Login failed');
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ink px-4">
      <form
        onSubmit={submit}
        className="bg-white rounded-lg p-8 w-full max-w-sm shadow-card"
      >
        <div className="font-display text-3xl tracking-wider text-center mb-6">
          SPORT<span className="text-accent">DEPOT</span>
          <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">Admin</div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              autoFocus
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </form>
    </main>
  );
}
