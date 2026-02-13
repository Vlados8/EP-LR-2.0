'use client';

import { useEffect, useState } from 'react';
import { Zap, Mail, MapPin, Phone, ArrowUpRight, Headphones } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const [s, setS] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setS(d.settings || {})).catch(() => {});
  }, []);

  const contactEmail = s.contact_email || 'info@energy-platform.de';
  const companyName = s.company_name || 'EP Energy Platform';

  const links = [
    { label: 'Startseite', href: '/' },
    { label: 'Partnerprogramm', href: '/partner' },
    { label: 'Support', href: '/support' },
    { label: 'Anmelden', href: '/login' },
    { label: 'Registrieren', href: '/register' },
  ];

  const legalLinks = [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'AGB', href: '/agb' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-slate-900 to-black text-gray-400 overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

      {/* Decorative orbs */}
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xl font-extrabold tracking-tight">EP  Energy Platform</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm mb-6">
              Ihre Plattform für nachhaltige Energieprojekte und Partnerprogramme. Wachsen Sie mit uns und profitieren Sie von unserem einzigartigen Bonussystem.
            </p>
            <div className="flex gap-3">
              <a href={`mailto:${contactEmail}`} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all">
                <Mail className="w-4 h-4" />
              </a>
              <a href="tel:+49123456789" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Navigation</h4>
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-1.5 text-sm hover:text-white transition-colors">
                    <span>{label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Rechtliches</h4>
            <ul className="space-y-3">
              {legalLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-1.5 text-sm hover:text-white transition-colors">
                    <span>{label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-bold text-sm uppercase tracking-wider mt-6 mb-3">Kontakt</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                <span>{contactEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                <span>Deutschland</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {companyName}. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/impressum" className="hover:text-white transition">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white transition">Datenschutz</Link>
            <Link href="/agb" className="hover:text-white transition">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
