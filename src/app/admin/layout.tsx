'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart3,
  Loader2,
  ShoppingBag,
  Banknote,
  Menu,
  X,
  Zap,
  Headphones,
  Settings,
} from 'lucide-react';

const adminLinks = [
  { href: '/admin', label: 'Übersicht', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Benutzer', icon: Users },
  { href: '/admin/projects', label: 'Projekte', icon: FolderOpen },
  { href: '/admin/orders', label: 'Bestellungen', icon: ShoppingBag },
  { href: '/admin/payouts', label: 'Auszahlungen', icon: Banknote },
  { href: '/admin/support', label: 'Support', icon: Headphones },
  { href: '/admin/settings', label: 'Einstellungen', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const navContent = (
    <nav className="px-4 space-y-1">
      {adminLinks.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              active
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <Navbar />
      <div className="flex pt-16">
        {/* Desktop sidebar */}
        <aside className="w-64 bg-gray-900 text-white min-h-[calc(100vh-4rem)] pt-6 hidden lg:block">
          <div className="px-6 mb-8">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Admin Panel
            </h2>
          </div>
          {navContent}
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-gray-900 text-white pt-6 shadow-2xl animate-slide-in-left">
              <div className="flex items-center justify-between px-6 mb-8">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Admin Panel
                </h2>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {navContent}
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-4 inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <Menu className="w-5 h-5" />
            Admin Menü
          </button>
          {children}
        </main>
      </div>
    </>
  );
}
