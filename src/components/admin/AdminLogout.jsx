'use client';

import { useRouter } from 'next/navigation';

export default function AdminLogout() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }
  return (
    <button onClick={logout} className="text-xs uppercase text-gray-300 hover:text-white">
      Logout
    </button>
  );
}
