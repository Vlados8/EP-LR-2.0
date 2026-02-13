'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Coins, Users, FolderOpen, TrendingUp, Clock, ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const isRestricted = user?.package_type === 'starter';

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || []));
    fetch('/api/points').then(r => r.json()).then(d => setTransactions(d.transactions || []));
  }, []);

  const stats = [
    { label: 'Punkte', value: user?.points || 0, icon: Coins, gradient: 'from-yellow-400 to-orange-500', shadow: 'shadow-yellow-500/20' },
    { label: 'Projekte', value: projects.length, icon: FolderOpen, gradient: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-500/20' },
    { label: 'Paket', value: user?.package_type?.toUpperCase(), icon: TrendingUp, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-500/20' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-extrabold text-gray-900">Willkommen, {user?.name}!</h1>
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
        <p className="text-gray-500">Hier ist Ihre Übersicht für heute</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, gradient, shadow }, i) => (
          <div key={label} className={`group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up stagger-${i + 1}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow} group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className={`text-2xl font-extrabold ${isRestricted && label === 'Punkte' ? 'blur-sm select-none' : ''}`}>
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Restricted banner */}
      {isRestricted && (
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8 animate-fade-in-up stagger-4">
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-yellow-300" />
              <h3 className="text-xl font-bold">Upgrade auf Popular oder höher</h3>
            </div>
            <p className="text-white/80 text-sm mb-5 max-w-lg">
              Schalten Sie volle Statistiken, Teamübersicht und Referral-Boni frei. Wachsen Sie mit unserem Partnerprogramm.
            </p>
            <Link href="/dashboard/shop" className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm">
              Pakete ansehen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-fade-in-up stagger-5">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" /> Letzte Transaktionen
          </h2>
        </div>
        <div className="p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Noch keine Transaktionen</p>
              <p className="text-gray-300 text-xs mt-1">Erstellen Sie Ihr erstes Projekt</p>
            </div>
          ) : (
            <div className={`space-y-3 ${isRestricted ? 'blur-sm select-none pointer-events-none' : ''}`}>
              {transactions.slice(0, 5).map((t: any, i: number) => (
                <div key={t.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      t.level === 0 ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                    }`}>
                      {t.level === 0 ? <FolderOpen className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.level === 0 ? 'Eigenes Projekt' : `Level ${t.level} Bonus`}
                      </p>
                      <p className="text-xs text-gray-400">{t.service_type} — {t.client_name}</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">+{t.points} Pkt.</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
