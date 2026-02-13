'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, LogOut, LayoutDashboard, Shield, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-indigo-500/5 border-b border-gray-100' 
        : isLanding 
          ? 'bg-transparent' 
          : 'bg-white/80 backdrop-blur-xl border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all group-hover:scale-105`}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-extrabold tracking-tight ${scrolled || !isLanding ? 'text-gray-900' : 'text-white'}`}>
              E<span className="gradient-text">P</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Startseite' },
              { href: '/partner', label: 'Partner' },
            ].map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? scrolled || !isLanding ? 'text-indigo-600 bg-indigo-50' : 'text-white bg-white/20'
                    : scrolled || !isLanding ? 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith('/dashboard')
                      ? scrolled || !isLanding ? 'text-indigo-600 bg-indigo-50' : 'text-white bg-white/20'
                      : scrolled || !isLanding ? 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname.startsWith('/admin')
                        ? scrolled || !isLanding ? 'text-indigo-600 bg-indigo-50' : 'text-white bg-white/20'
                        : scrolled || !isLanding ? 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button
                  onClick={logout}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    scrolled || !isLanding ? 'text-gray-500 hover:text-red-500 hover:bg-red-50' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LogOut className="w-4 h-4" /> Abmelden
                </button>
              </>
            ) : (
              <>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <Link 
                  href="/login" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    scrolled || !isLanding ? 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Anmelden
                </Link>
                <Link 
                  href="/register" 
                  className="relative inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Sparkles className="w-4 h-4" />
                  Registrieren
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button 
            className={`md:hidden p-2 rounded-lg transition ${scrolled || !isLanding ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`} 
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-4 space-y-1 shadow-xl">
          {[
            { href: '/', label: 'Startseite' },
            { href: '/partner', label: 'Partner' },
          ].map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium">
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium">Dashboard</Link>
              {user.role === 'admin' && (
                <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium">Admin</Link>
              )}
              <button onClick={() => { logout(); setOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-medium">
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium">Anmelden</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center font-semibold mt-2">
                Registrieren
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
