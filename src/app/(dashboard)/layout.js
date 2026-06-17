'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Device Management</h1>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link href="/admin/licenses" className="hover:text-blue-600">Licenses</Link>
          <Link href="/admin/roles" className="hover:text-blue-600">Roles</Link>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
