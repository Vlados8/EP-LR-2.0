'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Coins, TrendingUp, ArrowUpRight, Sparkles, Banknote, X, Send, CheckCircle, Clock, XCircle, Loader2, User, CreditCard, Hash } from 'lucide-react';

export default function PointsPage() {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    firstName: '',
    lastName: '',
    recipient: '',
    iban: '',
    points: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [payoutError, setPayoutError] = useState('');
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const isRestricted = user?.package_type === 'starter';

  useEffect(() => {
    fetch('/api/points').then(r => r.json()).then(d => setTransactions(d.transactions || []));
    fetchPayouts();
  }, []);

  const fetchPayouts = () => {
    fetch('/api/payouts').then(r => r.json()).then(d => setPayouts(d.payouts || []));
  };

  const pendingPayoutPoints = payouts.filter((p: any) => p.status === 'pending').reduce((s: number, p: any) => s + p.points, 0);
  const totalPoints = user?.points || 0;
  const availablePoints = totalPoints - pendingPayoutPoints;

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payoutForm),
      });
      const data = await res.json();

      if (res.ok) {
        setPayoutSuccess(true);
        setPayoutForm({ firstName: '', lastName: '', recipient: '', iban: '', points: '' });
        fetchPayouts();
        refreshUser();
        setTimeout(() => {
          setPayoutSuccess(false);
          setShowPayoutForm(false);
        }, 2000);
      } else {
        setPayoutError(data.error || 'Fehler beim Erstellen');
      }
    } catch {
      setPayoutError('Netzwerkfehler');
    } finally {
      setSubmitting(false);
    }
  };

  const PAYOUT_STATUS: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Ausstehend', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    approved: { label: 'Genehmigt', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    rejected: { label: 'Abgelehnt', color: 'bg-red-100 text-red-700', icon: XCircle },
  };

  const levelBreakdown = [0, 1, 2, 3].map((level) => ({
    level,
    label: level === 0 ? 'Eigene Projekte' : `Level ${level}`,
    total: transactions.filter((t: any) => t.level === level).reduce((sum: number, t: any) => sum + t.points, 0),
    count: transactions.filter((t: any) => t.level === level).length,
  }));

  const levelGradients = [
    'from-yellow-400 to-orange-500',
    'from-green-400 to-emerald-500',
    'from-blue-400 to-cyan-500',
    'from-purple-400 to-pink-500',
  ];
  const levelShadows = [
    'shadow-yellow-500/20',
    'shadow-green-500/20',
    'shadow-blue-500/20',
    'shadow-purple-500/20',
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Punkte</h1>
        <p className="text-gray-500">Ihre Punkteübersicht und Historie</p>
      </div>

      {/* Total points */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <p className="text-white/70 text-sm font-medium">Gesamtpunkte</p>
              </div>
              <p className={`text-5xl font-extrabold mt-1 ${isRestricted ? 'blur-md' : ''}`}>{totalPoints}</p>
              {pendingPayoutPoints > 0 && !isRestricted && (
                <p className="text-white/60 text-sm mt-2">
                  Verfügbar: <span className="font-bold text-white/90">{availablePoints}</span> · Reserviert: <span className="font-bold text-yellow-300">{pendingPayoutPoints}</span>
                </p>
              )}
            </div>
            {!isRestricted && availablePoints > 0 && (
              <button
                onClick={() => setShowPayoutForm(true)}
                className="flex items-center gap-2 bg-white/20 backdrop-blur hover:bg-white/30 text-white px-5 py-3 rounded-xl font-semibold transition border border-white/20 hover:border-white/40 shadow-lg"
              >
                <Banknote className="w-5 h-5" />
                Punkte auszahlen
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {levelBreakdown.map(({ level, label, total, count }, i) => (
          <div key={level} className={`group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up stagger-${i + 1} ${isRestricted ? 'blur-sm' : ''}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${levelGradients[i]} flex items-center justify-center shadow-md ${levelShadows[i]}`}>
                {level === 0 ? <Coins className="w-4 h-4 text-white" /> : <ArrowUpRight className="w-4 h-4 text-white" />}
              </div>
              <span className="text-sm text-gray-500 font-medium">{label}</span>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{total}</p>
            <p className="text-xs text-gray-400 mt-1">{count} Transaktionen</p>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50">
          <h2 className="font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" /> Transaktionsverlauf
          </h2>
        </div>
        {transactions.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Coins className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">Noch keine Transaktionen</p>
            <p className="text-gray-300 text-sm mt-1">Erstellen Sie Ihr erstes Projekt</p>
          </div>
        ) : (
          <div className={isRestricted ? 'blur-sm select-none' : ''}>
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Beschreibung</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Projekt</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Punkte</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t: any) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-sm font-medium">{t.level === 0 ? 'Eigenes Projekt' : `Referral-Bonus`}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{t.client_name || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        t.level === 0 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        Level {t.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">+{t.points}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-400">
                      {new Date(t.created_at).toLocaleDateString('de-DE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout History */}
      {payouts.length > 0 && !isRestricted && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-gray-50">
            <h2 className="font-bold flex items-center gap-2">
              <Banknote className="w-5 h-5 text-gray-400" /> Auszahlungen
            </h2>
          </div>
          {/* Desktop */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Empfänger</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">IBAN</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Punkte</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Betrag</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p: any) => {
                  const st = PAYOUT_STATUS[p.status] || PAYOUT_STATUS.pending;
                  const StIcon = st.icon;
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 text-sm font-medium">{p.first_name} {p.last_name} → {p.recipient}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono max-w-[200px] truncate">{p.iban}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-lg text-sm">-{p.points}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-sm">{Number(p.amount).toFixed(2).replace('.', ',')} €</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>
                          <StIcon className="w-3 h-3" /> {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-400">
                        {new Date(p.created_at).toLocaleDateString('de-DE')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mobile */}
          <div className="md:hidden divide-y divide-gray-100">
            {payouts.map((p: any) => {
              const st = PAYOUT_STATUS[p.status] || PAYOUT_STATUS.pending;
              const StIcon = st.icon;
              return (
                <div key={p.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{p.first_name} {p.last_name}</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>
                      <StIcon className="w-3 h-3" /> {st.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">→ {p.recipient} · {p.iban}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-red-500 font-bold text-sm">-{p.points} Pkt. ({Number(p.amount).toFixed(2).replace('.', ',')} €)</span>
                    <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('de-DE')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payout Form Modal */}
      {showPayoutForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowPayoutForm(false); setPayoutError(''); setPayoutSuccess(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl relative">
              <button
                onClick={() => { setShowPayoutForm(false); setPayoutError(''); setPayoutSuccess(false); }}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Punkte auszahlen</h2>
                  <p className="text-white/70 text-sm">1 Punkt = 1,00 €</p>
                </div>
              </div>
              <div className="mt-4 bg-white/20 rounded-xl p-3 text-center">
                <p className="text-white/70 text-xs">Verfügbare Punkte</p>
                <p className="text-2xl font-extrabold text-white">{availablePoints}</p>
              </div>
            </div>

            {payoutSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Antrag erstellt!</h3>
                <p className="text-gray-500 text-sm">Ihr Auszahlungsantrag wird bearbeitet.</p>
              </div>
            ) : (
              <form onSubmit={handlePayoutSubmit} className="p-6 space-y-4">
                {payoutError && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
                    {payoutError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Vorname</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={payoutForm.firstName}
                        onChange={(e) => setPayoutForm({ ...payoutForm, firstName: e.target.value })}
                        placeholder="Max"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Nachname</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={payoutForm.lastName}
                        onChange={(e) => setPayoutForm({ ...payoutForm, lastName: e.target.value })}
                        placeholder="Mustermann"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Empfänger (Kому)</label>
                  <div className="relative">
                    <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={payoutForm.recipient}
                      onChange={(e) => setPayoutForm({ ...payoutForm, recipient: e.target.value })}
                      placeholder="Name des Empfängers"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">IBAN</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={payoutForm.iban}
                      onChange={(e) => setPayoutForm({ ...payoutForm, iban: e.target.value })}
                      placeholder="DE89 3704 0044 0532 0130 00"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Anzahl Punkte</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      max={availablePoints}
                      value={payoutForm.points}
                      onChange={(e) => setPayoutForm({ ...payoutForm, points: e.target.value })}
                      placeholder={`Max. ${availablePoints}`}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  {payoutForm.points && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      Auszahlungsbetrag: <span className="font-bold text-green-600">{Number(payoutForm.points).toFixed(2).replace('.', ',')} €</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? 'Wird gesendet...' : 'Auszahlung beantragen'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
