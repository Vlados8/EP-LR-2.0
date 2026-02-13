'use client';

import { useEffect, useState } from 'react';
import { Users, FolderOpen, Coins, Clock, CheckCircle, TrendingUp, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        setStats(d.stats);
        setRecentUsers(d.recentUsers || []);
        setRecentProjects(d.recentProjects || []);
      });
  }, []);

  if (!stats) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full"></div></div>;
  }

  const cards = [
    { label: 'Benutzer gesamt', value: stats.totalUsers, icon: Users, gradient: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-500/20' },
    { label: 'Ausstehende Benutzer', value: stats.pendingUsers, icon: Clock, gradient: 'from-yellow-400 to-orange-500', shadow: 'shadow-yellow-500/20' },
    { label: 'Projekte gesamt', value: stats.totalProjects, icon: FolderOpen, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-500/20' },
    { label: 'Ausstehende Projekte', value: stats.pendingProjects, icon: Clock, gradient: 'from-orange-400 to-red-500', shadow: 'shadow-orange-500/20' },
    { label: 'Genehmigte Projekte', value: stats.approvedProjects, icon: CheckCircle, gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20' },
    { label: 'Punkte verteilt', value: stats.totalPoints, icon: Coins, gradient: 'from-purple-400 to-pink-500', shadow: 'shadow-purple-500/20' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
        </div>
        <p className="text-gray-500 ml-[52px]">Überblick über die Plattform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {cards.map(({ label, value, icon: Icon, gradient, shadow }, i) => (
          <div key={label} className={`group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow} group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" /> Neueste Benutzer
            </h2>
          </div>
          <div className="p-6 space-y-3">
            {recentUsers.map((u: any) => (
              <div key={u.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-500/20">
                  {u.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">{new Date(u.created_at).toLocaleDateString('de-DE')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent projects */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-gray-400" /> Neueste Projekte
            </h2>
          </div>
          <div className="p-6 space-y-3">
            {recentProjects.map((p: any) => (
              <div key={p.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                  p.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                  p.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                  'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  {p.service_type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.client_name}</p>
                  <p className="text-xs text-gray-400 truncate">von {p.user_name}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  p.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                  p.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}>
                  {p.status === 'approved' ? 'Genehmigt' : p.status === 'rejected' ? 'Abgelehnt' : 'Ausstehend'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
