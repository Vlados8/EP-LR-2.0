'use client';

import { useEffect, useState } from 'react';
import { Users, Search, CheckCircle, Clock, ChevronDown, X, Mail, Award, Calendar, Hash, Package, Star, Eye, ShieldOff, ShieldCheck, Power, Banknote, FolderOpen, Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userPayouts, setUserPayouts] = useState<any[]>([]);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [extraLoading, setExtraLoading] = useState(false);

  const PACKAGE_LABELS: Record<string, string> = {
    starter: 'Starter',
    popular: 'Popular',
    business: 'Business',
    premium: 'Premium',
  };

  const PACKAGE_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
    starter: { bg: 'bg-gray-100', text: 'text-gray-700', gradient: 'from-gray-500 to-gray-700' },
    popular: { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-500 to-blue-700' },
    business: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-500 to-purple-700' },
    premium: { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-500 to-amber-700' },
  };

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter === 'pending') params.set('status', 'pending');
    if (filter === 'approved') params.set('status', 'approved');
    if (search) params.set('search', search);

    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const approveUser = async (id: number) => {
    await fetch(`/api/admin/users/${id}/approve`, { method: 'POST' });
    fetchUsers();
  };

  const changePackage = async (id: number, packageType: string) => {
    await fetch(`/api/admin/users/${id}/package`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ package_type: packageType }),
    });
    fetchUsers();
  };

  const fetchUserExtra = async (userId: number) => {
    setExtraLoading(true);
    try {
      const [payoutsRes, projectsRes] = await Promise.all([
        fetch(`/api/admin/payouts?search=&status=all&user_id=${userId}`),
        fetch(`/api/admin/projects?user_id=${userId}`),
      ]);
      const payoutsData = await payoutsRes.json();
      const projectsData = await projectsRes.json();
      setUserPayouts(payoutsData.payouts || []);
      setUserProjects(projectsData.projects || []);
    } catch {
      setUserPayouts([]);
      setUserProjects([]);
    }
    setExtraLoading(false);
  };

  const handleSelectUser = (u: any) => {
    setSelectedUser(u);
    setUserPayouts([]);
    setUserProjects([]);
    fetchUserExtra(u.id);
  };

  const toggleActive = async (id: number) => {
    const res = await fetch(`/api/admin/users/${id}/toggle-active`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      // Update selectedUser if it's the toggled one
      if (selectedUser?.id === id) {
        setSelectedUser({ ...selectedUser, active: data.active });
      }
      fetchUsers();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Benutzerverwaltung</h1>
        <p className="text-gray-500">Benutzer verwalten und Pakete zuweisen</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Alle' },
            { key: 'pending', label: 'Ausstehend' },
            { key: 'approved', label: 'Genehmigt' },
            { key: 'disabled', label: 'Deaktiviert' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name oder E-Mail suchen..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
            Suchen
          </button>
        </form>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Keine Benutzer gefunden</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Benutzer</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Paket</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Punkte</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Datum</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition" onClick={() => handleSelectUser(u)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {u.approved ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4" /> Genehmigt
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-600 text-sm">
                              <Clock className="w-4 h-4" /> Ausstehend
                            </span>
                          )}
                          {!u.active && (
                            <span className="flex items-center gap-1 text-red-500 text-xs">
                              <ShieldOff className="w-3 h-3" /> Deaktiviert
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <select
                            value={u.package_type || 'starter'}
                            onChange={(e) => changePackage(u.id, e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm cursor-pointer hover:bg-gray-100"
                          >
                            <option value="starter">Starter</option>
                            <option value="popular">Popular</option>
                            <option value="business">Business</option>
                            <option value="premium">Premium</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {!u.approved && u.package_type && u.package_type !== 'starter' && (
                          <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                            Gewählt vom Benutzer
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">{u.points}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(u.created_at).toLocaleDateString('de-DE')}
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSelectUser(u)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-indigo-600"
                            title="Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleActive(u.id)}
                            className={`p-1.5 rounded-lg transition ${u.active ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-red-400 hover:text-green-500 hover:bg-green-50'}`}
                            title={u.active ? 'Deaktivieren' : 'Aktivieren'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          {!u.approved && (
                            <button
                              onClick={() => approveUser(u.id)}
                              className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
                            >
                              Genehmigen
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {users.map((u: any) => (
                <div key={u.id} className="p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition" onClick={() => handleSelectUser(u)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                    {u.approved ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Genehmigt
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-600 text-xs bg-yellow-50 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> Ausstehend
                      </span>
                    )}
                    {!u.active && (
                      <span className="flex items-center gap-1 text-red-500 text-xs bg-red-50 px-2 py-1 rounded-full">
                        <ShieldOff className="w-3 h-3" /> Off
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <select
                        value={u.package_type || 'starter'}
                        onChange={(e) => changePackage(u.id, e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm cursor-pointer"
                      >
                        <option value="starter">Starter</option>
                        <option value="popular">Popular</option>
                        <option value="business">Business</option>
                        <option value="premium">Premium</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-500">{u.points} Pkt.</span>
                    <span className="text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString('de-DE')}</span>
                    <button
                      onClick={() => toggleActive(u.id)}
                      className={`p-1.5 rounded-lg transition ${u.active ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-red-400 hover:text-green-500 hover:bg-green-50'}`}
                      title={u.active ? 'Deaktivieren' : 'Aktivieren'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    {!u.approved && (
                      <button
                        onClick={() => approveUser(u.id)}
                        className="ml-auto bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-600 transition"
                      >
                        Genehmigen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (() => {
        const pkgColor = PACKAGE_COLORS[selectedUser.package_type || 'starter'] || PACKAGE_COLORS.starter;
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${pkgColor.gradient} p-6 rounded-t-2xl relative`}>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30">
                    {selectedUser.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                    <p className="text-white/80 text-sm">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  {selectedUser.approved ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-400/20 text-green-100 border border-green-300/30">
                      <CheckCircle className="w-3.5 h-3.5" /> Genehmigt
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-100 border border-yellow-300/30">
                      <Clock className="w-3.5 h-3.5" /> Ausstehend
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/20">
                    <Package className="w-3.5 h-3.5" /> {PACKAGE_LABELS[selectedUser.package_type || 'starter']}
                  </span>
                  {!selectedUser.active && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-400/20 text-red-100 border border-red-300/30">
                      <ShieldOff className="w-3.5 h-3.5" /> Deaktiviert
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Star className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">Punkte</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{selectedUser.points}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">Registriert</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(selectedUser.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Detail Cards */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">E-Mail</p>
                      <p className="text-sm font-medium truncate">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Hash className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Referral Code</p>
                      <p className="text-sm font-mono font-medium">{selectedUser.referral_code || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Sponsor ID</p>
                      <p className="text-sm font-medium">{selectedUser.sponsor_id || 'Kein Sponsor'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Rolle</p>
                      <p className="text-sm font-medium capitalize">{selectedUser.role}</p>
                    </div>
                  </div>
                </div>

                {/* Package Selector */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Paket ändern</p>
                  <div className="relative">
                    <select
                      value={selectedUser.package_type || 'starter'}
                      onChange={(e) => {
                        changePackage(selectedUser.id, e.target.value);
                        setSelectedUser({ ...selectedUser, package_type: e.target.value });
                      }}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm cursor-pointer hover:bg-gray-100 font-medium"
                    >
                      <option value="starter">Starter</option>
                      <option value="popular">Popular</option>
                      <option value="business">Business</option>
                      <option value="premium">Premium</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Payout Stats */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Auszahlungen</span>
                  </div>
                  {extraLoading ? (
                    <div className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin text-gray-300 mx-auto" /></div>
                  ) : userPayouts.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-400">Keine Auszahlungen</div>
                  ) : (
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center bg-yellow-50 rounded-lg p-2.5">
                          <p className="text-lg font-bold text-yellow-600">{userPayouts.filter(p => p.status === 'pending').length}</p>
                          <p className="text-[10px] text-yellow-600 font-medium">Ausstehend</p>
                        </div>
                        <div className="text-center bg-green-50 rounded-lg p-2.5">
                          <p className="text-lg font-bold text-green-600">{userPayouts.filter(p => p.status === 'approved').length}</p>
                          <p className="text-[10px] text-green-600 font-medium">Genehmigt</p>
                        </div>
                        <div className="text-center bg-red-50 rounded-lg p-2.5">
                          <p className="text-lg font-bold text-red-600">{userPayouts.filter(p => p.status === 'rejected').length}</p>
                          <p className="text-[10px] text-red-600 font-medium">Abgelehnt</p>
                        </div>
                      </div>
                      <div className="text-center bg-indigo-50 rounded-lg p-2.5">
                        <p className="text-sm font-bold text-indigo-700">
                          {userPayouts.filter(p => p.status === 'approved').reduce((s: number, p: any) => s + Number(p.amount), 0).toFixed(2).replace('.', ',')} €
                        </p>
                        <p className="text-[10px] text-indigo-500 font-medium">Gesamt ausgezahlt</p>
                      </div>
                      <div className="max-h-40 overflow-auto space-y-1.5">
                        {userPayouts.map((p: any) => (
                          <div key={p.id} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                            <div>
                              <span className="font-medium">{p.first_name} {p.last_name}</span>
                              <span className="text-gray-400 ml-1">→ {p.recipient}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{Number(p.amount).toFixed(2).replace('.', ',')} €</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                p.status === 'approved' ? 'bg-green-100 text-green-700' :
                                p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {p.status === 'approved' ? 'OK' : p.status === 'rejected' ? 'Abg.' : 'Wart.'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Projects */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">Projekte</span>
                    {!extraLoading && <span className="ml-auto text-xs text-gray-400 font-medium">{userProjects.length}</span>}
                  </div>
                  {extraLoading ? (
                    <div className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin text-gray-300 mx-auto" /></div>
                  ) : userProjects.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-400">Keine Projekte</div>
                  ) : (
                    <div className="max-h-56 overflow-auto divide-y divide-gray-100">
                      {userProjects.map((proj: any) => (
                        <div key={proj.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                            proj.service_type === 'PV' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}>
                            {proj.service_type}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{proj.client_name}</p>
                            <p className="text-xs text-gray-400">{proj.phone} · {new Date(proj.created_at).toLocaleDateString('de-DE')}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            proj.status === 'approved' ? 'bg-green-100 text-green-700' :
                            proj.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {proj.status === 'approved' ? 'Genehmigt' : proj.status === 'rejected' ? 'Abgelehnt' : 'Ausstehend'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Toggle Active */}
                <button
                  onClick={() => toggleActive(selectedUser.id)}
                  className={`w-full py-3 font-medium rounded-xl transition flex items-center justify-center gap-2 ${
                    selectedUser.active
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  {selectedUser.active ? (
                    <><ShieldOff className="w-4 h-4" /> Benutzer deaktivieren</>
                  ) : (
                    <><ShieldCheck className="w-4 h-4" /> Benutzer aktivieren</>
                  )}
                </button>

                {/* Approve Button */}
                {!selectedUser.approved && (
                  <button
                    onClick={() => {
                      approveUser(selectedUser.id);
                      setSelectedUser({ ...selectedUser, approved: 1 });
                    }}
                    className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Benutzer genehmigen
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
