'use client';

import { useEffect, useState } from 'react';
import {
  Headphones,
  Search,
  Filter,
  Mail,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  Send,
  X,
  Loader2,
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface SupportMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'answered';
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG = {
  new: { label: 'Neu', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  read: { label: 'Gelesen', color: 'bg-yellow-100 text-yellow-700', icon: Eye },
  answered: { label: 'Beantwortet', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

export default function AdminSupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SupportMessage | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [statusFilter, search]);

  const fetchMessages = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (search) params.append('search', search);
    const res = await fetch(`/api/admin/support?${params}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
    }
    setLoading(false);
  };

  const openMessage = (msg: SupportMessage) => {
    setSelected(msg);
    setReply(msg.admin_reply || '');
    // Mark as read if new
    if (msg.status === 'new') {
      fetch(`/api/admin/support/${msg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      }).then(() => fetchMessages());
    }
  };

  const handleReply = async () => {
    if (!selected || !reply.trim()) return;
    setSending(true);
    const res = await fetch(`/api/admin/support/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'answered', reply: reply.trim() }),
    });
    setSending(false);
    if (res.ok) {
      setSelected(null);
      setReply('');
      fetchMessages();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Nachricht wirklich löschen?')) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/support/${id}`, { method: 'DELETE' });
    setDeleting(null);
    if (res.ok) {
      if (selected?.id === id) setSelected(null);
      fetchMessages();
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const newCount = messages.filter((m) => m.status === 'new').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Support-Nachrichten
            {newCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{newCount}</span>
            )}
          </h1>
          <p className="text-gray-500 text-sm">{messages.length} Nachrichten insgesamt</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Name, E-Mail oder Betreff suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Alle' },
            { key: 'new', label: 'Neu' },
            { key: 'read', label: 'Gelesen' },
            { key: 'answered', label: 'Beantwortet' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                statusFilter === f.key
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Headphones className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Keine Nachrichten gefunden</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Betreff</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">E-Mail</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">Datum</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-500">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => {
                  const cfg = STATUS_CONFIG[msg.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr
                      key={msg.id}
                      onClick={() => openMessage(msg)}
                      className={`border-b border-gray-50 cursor-pointer transition hover:bg-purple-50/50 ${
                        msg.status === 'new' ? 'bg-blue-50/30 font-medium' : ''
                      }`}
                    >
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">{msg.name}</td>
                      <td className="px-5 py-4 max-w-[200px] truncate">{msg.subject}</td>
                      <td className="px-5 py-4 text-gray-500">{msg.email}</td>
                      <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{formatDate(msg.created_at)}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(msg.id);
                          }}
                          className="text-red-400 hover:text-red-600 transition p-1"
                        >
                          {deleting === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {messages.map((msg) => {
              const cfg = STATUS_CONFIG[msg.status];
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition hover:shadow-md ${
                    msg.status === 'new' ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(msg.created_at)}</span>
                  </div>
                  <p className="font-semibold text-sm">{msg.name}</p>
                  <p className="text-sm text-gray-700 mt-0.5">{msg.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">{msg.email}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selected.subject}</h3>
                  <p className="text-white/70 text-sm">von {selected.name}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              {/* Info cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Name</p>
                    <p className="text-sm font-medium">{selected.name}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">E-Mail</p>
                    <p className="text-sm font-medium truncate">{selected.email}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Eingang</p>
                    <p className="text-sm font-medium">{formatDate(selected.created_at)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                  {(() => {
                    const cfg = STATUS_CONFIG[selected.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <>
                        <StatusIcon className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-semibold">Status</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Message */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] text-gray-400 uppercase font-semibold mb-2">Nachricht</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>

              {/* Previous Reply */}
              {selected.admin_reply && selected.status === 'answered' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-[10px] text-green-600 uppercase font-semibold mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Gesendete Antwort
                  </p>
                  <p className="text-sm text-green-800 whitespace-pre-wrap">{selected.admin_reply}</p>
                </div>
              )}

              {/* Reply */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  {selected.status === 'answered' ? 'Neue Antwort senden' : 'Antwort verfassen'}
                </label>
                <textarea
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Ihre Antwort eingeben..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 p-4 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDelete(selected.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" /> Löschen
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  Schließen
                </button>
                <button
                  onClick={handleReply}
                  disabled={sending || !reply.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50 shadow-lg shadow-purple-500/20"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Antwort senden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
