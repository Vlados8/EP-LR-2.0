'use client';

import { useEffect, useState } from 'react';
import {
  Banknote,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  X,
  User,
  CreditCard,
  Hash,
  Mail,
  Calendar,
  Send,
  Filter,
} from 'lucide-react';

interface Payout {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  recipient: string;
  iban: string;
  points: number;
  amount: number;
  status: string;
  created_at: string;
  user_name: string;
  user_email: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; gradient: string }> = {
  pending: { label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-700', icon: Clock, gradient: 'from-yellow-400/20 to-yellow-100/20' },
  approved: { label: 'Genehmigt', color: 'bg-green-100 text-green-700', icon: CheckCircle, gradient: 'from-green-400/20 to-green-100/20' },
  rejected: { label: 'Abgelehnt', color: 'bg-red-100 text-red-700', icon: XCircle, gradient: 'from-red-400/20 to-red-100/20' },
};

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchPayouts();
  }, [statusFilter]);

  const fetchPayouts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search) params.set('search', search);

    const res = await fetch(`/api/admin/payouts?${params}`);
    const data = await res.json();
    setPayouts(data.payouts || []);
    setLoading(false);
  };

  const updatePayoutStatus = async (id: number, status: string) => {
    setUpdating(id);
    const res = await fetch(`/api/admin/payouts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      fetchPayouts();
      if (selectedPayout?.id === id) {
        setSelectedPayout(prev => prev ? { ...prev, status } : null);
      }
    }
    setUpdating(null);
  };

  const pendingCount = payouts.filter(p => p.status === 'pending').length;
  const approvedCount = payouts.filter(p => p.status === 'approved').length;
  const totalPaid = payouts
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Auszahlungen</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ausstehend</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Genehmigt</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ausgezahlt gesamt</p>
              <p className="text-2xl font-bold text-indigo-600">
                {totalPaid.toFixed(2).replace('.', ',')} €
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPayouts()}
              placeholder="Name, E-Mail, Empfänger suchen..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Alle Status</option>
              <option value="pending">Ausstehend</option>
              <option value="approved">Genehmigt</option>
              <option value="rejected">Abgelehnt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Lade...</div>
        ) : payouts.length === 0 ? (
          <div className="p-12 text-center">
            <Banknote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Keine Auszahlungen gefunden</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Benutzer</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Empfänger</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">IBAN</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Punkte</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Betrag</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Datum</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => {
                    const statusCfg = STATUS_CONFIG[payout.status];
                    const StatusIcon = statusCfg?.icon || Clock;
                    return (
                      <tr
                        key={payout.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => setSelectedPayout(payout)}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">{payout.user_name}</p>
                            <p className="text-gray-400 text-xs">{payout.user_email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{payout.first_name} {payout.last_name}</p>
                          <p className="text-gray-400 text-xs">→ {payout.recipient}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs font-mono max-w-[220px] truncate">{payout.iban}</td>
                        <td className="px-4 py-3 text-right font-semibold">{payout.points}</td>
                        <td className="px-4 py-3 text-right font-semibold">{Number(payout.amount).toFixed(2).replace('.', ',')} €</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg?.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusCfg?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(payout.created_at).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {payout.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updatePayoutStatus(payout.id, 'approved')}
                                  disabled={updating === payout.id}
                                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                >
                                  {updating === payout.id ? '...' : 'Genehmigen'}
                                </button>
                                <button
                                  onClick={() => updatePayoutStatus(payout.id, 'rejected')}
                                  disabled={updating === payout.id}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                                >
                                  Ablehnen
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setSelectedPayout(payout)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden divide-y divide-gray-100">
              {payouts.map((payout) => {
                const statusCfg = STATUS_CONFIG[payout.status];
                const StatusIcon = statusCfg?.icon || Clock;
                return (
                  <div key={payout.id} className="p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition" onClick={() => setSelectedPayout(payout)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{payout.user_name}</p>
                        <p className="text-xs text-gray-400">{payout.user_email}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg?.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg?.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>{payout.first_name} {payout.last_name} → {payout.recipient}</p>
                      <p className="truncate text-gray-400 font-mono">{payout.iban}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-sm">{payout.points} Pkt. · {Number(payout.amount).toFixed(2).replace('.', ',')} €</span>
                      <span className="text-xs text-gray-400">{new Date(payout.created_at).toLocaleDateString('de-DE')}</span>
                      {payout.status === 'pending' && (
                        <div className="flex gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => updatePayoutStatus(payout.id, 'approved')}
                            disabled={updating === payout.id}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                          >
                            {updating === payout.id ? '...' : 'Genehmigen'}
                          </button>
                          <button
                            onClick={() => updatePayoutStatus(payout.id, 'rejected')}
                            disabled={updating === payout.id}
                            className="px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                          >
                            Ablehnen
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPayout && (() => {
        const statusCfg = STATUS_CONFIG[selectedPayout.status];
        const StatusIcon = statusCfg?.icon || Clock;
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPayout(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl relative">
                <button onClick={() => setSelectedPayout(null)} className="absolute top-4 right-4 text-white/80 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Auszahlungsantrag</p>
                    <p className="text-xl font-bold text-white">#{selectedPayout.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    selectedPayout.status === 'approved' ? 'bg-green-400/20 text-green-100 border-green-300/30' :
                    selectedPayout.status === 'rejected' ? 'bg-red-400/20 text-red-100 border-red-300/30' :
                    'bg-yellow-400/20 text-yellow-100 border-yellow-300/30'
                  }`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusCfg?.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Amount */}
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Betrag</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {Number(selectedPayout.amount).toFixed(2).replace('.', ',')} <span className="text-lg">€</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{selectedPayout.points} Punkte</p>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Benutzer (Antragsteller)</p>
                      <p className="text-sm font-medium">{selectedPayout.user_name}</p>
                      <p className="text-xs text-gray-400">{selectedPayout.user_email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Antragsteller</p>
                      <p className="text-sm font-medium">{selectedPayout.first_name} {selectedPayout.last_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                      <Send className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Empfänger</p>
                      <p className="text-sm font-medium">{selectedPayout.recipient}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">IBAN</p>
                      <p className="text-sm font-medium font-mono">{selectedPayout.iban}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Datum</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedPayout.created_at).toLocaleString('de-DE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedPayout.status === 'pending' && (
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => {
                        updatePayoutStatus(selectedPayout.id, 'approved');
                        setSelectedPayout(null);
                      }}
                      className="flex-1 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Genehmigen
                    </button>
                    <button
                      onClick={() => {
                        updatePayoutStatus(selectedPayout.id, 'rejected');
                        setSelectedPayout(null);
                      }}
                      className="flex-1 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition text-sm flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Ablehnen
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
