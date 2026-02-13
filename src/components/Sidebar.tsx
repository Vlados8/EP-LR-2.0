'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FolderPlus,
  Users,
  Coins,
  ShoppingBag,
  Link as LinkIcon,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Übersicht', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: 'Projekte', icon: FolderPlus },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/points', label: 'Punkte', icon: Coins },
  { href: '/dashboard/referral', label: 'Empfehlung', icon: LinkIcon },
  { href: '/dashboard/shop', label: 'Shop', icon: ShoppingBag },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const packageColors: Record<string, string> = {
    starter: 'from-gray-400 to-gray-500',
    popular: 'from-blue-500 to-indigo-600',
    business: 'from-purple-500 to-pink-600',
    premium: 'from-amber-400 to-orange-500',
  };

  const sidebarContent = (
    <>
      {/* User card */}
      {user && (
        <div className="px-5 mb-6">
          <div className="bg-gradient-to-br from-gray-50 to-indigo-50/50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${packageColors[user.package_type] || packageColors.starter} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
              <Zap className="w-3 h-3" />
              {user.package_type?.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="px-3 space-y-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 transition ${active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'}`} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-4 h-4 text-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-5 pb-6 mt-auto">
        <div className="h-px bg-gray-100 mb-4" />
        <p className="text-[11px] text-gray-400 text-center">EP Energy Platform v1.0</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] pt-6 hidden lg:flex flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white pt-6 flex flex-col shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between px-5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">EP</span>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
