'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  CreditCard,
  User,
  Package,
  Calendar,
  ExternalLink,
  X,
  Hash,
  Mail,
  Banknote,
} from 'lucide-react';

interface Order {
  id: number;
  order_id: string;
  user_id: number;
  package_type: string;
  amount: number;
  status: string;
  created_at: string;
  user_name: string;
  user_email: string;
  user_package: string;
}

const PACKAGE_LABELS: Record<string, string> = {
  popular: 'Popular',
  business: 'Business',
  premium: 'Premium',
};

const PACKAGE_COLORS: Record<string, string> = {
  popular: 'bg-blue-100 text-blue-700',
  business: 'bg-purple-100 text-purple-700',
  premium: 'bg-amber-100 text-amber-700',
};

const PACKAGE_GRADIENTS: Record<string, string> = {
  popular: 'from-blue-500 to-blue-700',
  business: 'from-purple-500 to-purple-700',
  premium: 'from-amber-500 to-amber-700',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: {
    label: 'Ausstehend',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  paid: {
    label: 'Bezahlt',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Storniert',
    color: 'bg-red-100 text-red-700',
    icon: XCircle,
  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.settings || {}));
  }, []);

  const fetchOrders = async () => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search) params.set('search', search);

    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      fetchOrders();
      if (selectedOrder?.order_id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status } : null
        );
      }
    }
    setUpdating(null);
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const paidCount = orders.filter((o) => o.status === 'paid').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + Number(o.amount), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bestellungen</h1>

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
              <p className="text-sm text-gray-500">Bezahlt</p>
              <p className="text-2xl font-bold text-green-600">{paidCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Einnahmen</p>
              <p className="text-2xl font-bold text-indigo-600">
                {totalRevenue.toFixed(2).replace('.', ',')} €
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-600" />
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
              placeholder="Suchen (Bestell-ID, Name, E-Mail)..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <option value="paid">Bezahlt</option>
              <option value="cancelled">Storniert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Lade...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Keine Bestellungen gefunden</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Bestell-ID
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Benutzer
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Paket
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Betrag
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      Datum
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const statusCfg = STATUS_CONFIG[order.status];
                    const StatusIcon = statusCfg?.icon || Clock;
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono font-semibold text-indigo-600">
                            {order.order_id}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.user_name}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {order.user_email}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                              PACKAGE_COLORS[order.package_type] ||
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <Package className="w-3 h-3" />
                            {PACKAGE_LABELS[order.package_type] ||
                              order.package_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {Number(order.amount).toFixed(2).replace('.', ',')} €
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg?.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusCfg?.label || order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(order.created_at).toLocaleString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() =>
                                    updateOrderStatus(order.order_id, 'paid')
                                  }
                                  disabled={updating === order.order_id}
                                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                >
                                  {updating === order.order_id
                                    ? '...'
                                    : 'Als bezahlt'}
                                </button>
                                <button
                                  onClick={() =>
                                    updateOrderStatus(
                                      order.order_id,
                                      'cancelled'
                                    )
                                  }
                                  disabled={updating === order.order_id}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                                >
                                  Stornieren
                                </button>
                              </>
                            )}
                            {order.status === 'cancelled' && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(order.order_id, 'paid')
                                }
                                disabled={updating === order.order_id}
                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                              >
                                {updating === order.order_id ? '...' : 'Als bezahlt'}
                              </button>
                            )}
                            {order.status === 'paid' && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(order.order_id, 'cancelled')
                                }
                                disabled={updating === order.order_id}
                                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                              >
                                Stornieren
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
                              title="Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <a
                              href={`/payment/${order.order_id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
                              title="Zahlungsseite öffnen"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {orders.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status];
                const StatusIcon = statusCfg?.icon || Clock;
                return (
                  <div key={order.id} className="p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition" onClick={() => setSelectedOrder(order)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-semibold text-indigo-600 text-sm">
                          {order.order_id}
                        </span>
                        <p className="font-medium text-gray-900 text-sm mt-0.5">
                          {order.user_name}
                        </p>
                        <p className="text-gray-400 text-xs">{order.user_email}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg?.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg?.label || order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          PACKAGE_COLORS[order.package_type] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Package className="w-3 h-3" />
                        {PACKAGE_LABELS[order.package_type] || order.package_type}
                      </span>
                      <span className="font-semibold text-sm">
                        {Number(order.amount).toFixed(2).replace('.', ',')} €
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.order_id, 'paid')}
                            disabled={updating === order.order_id}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                          >
                            {updating === order.order_id ? '...' : 'Als bezahlt'}
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.order_id, 'cancelled')}
                            disabled={updating === order.order_id}
                            className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                          >
                            Stornieren
                          </button>
                        </>
                      )}
                      {order.status === 'cancelled' && (
                        <button
                          onClick={() => updateOrderStatus(order.order_id, 'paid')}
                          disabled={updating === order.order_id}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {updating === order.order_id ? '...' : 'Als bezahlt'}
                        </button>
                      )}
                      {order.status === 'paid' && (
                        <button
                          onClick={() => updateOrderStatus(order.order_id, 'cancelled')}
                          disabled={updating === order.order_id}
                          className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                        >
                          Stornieren
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600 ml-auto"
                        title="Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={`/payment/${order.order_id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
                        title="Zahlungsseite öffnen"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (() => {
        const statusCfg = STATUS_CONFIG[selectedOrder.status];
        const StatusIcon = statusCfg?.icon || Clock;
        const gradient = PACKAGE_GRADIENTS[selectedOrder.package_type] || 'from-indigo-500 to-indigo-700';
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${gradient} p-6 rounded-t-2xl relative`}>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Bestell-ID</p>
                    <p className="font-mono font-bold text-white text-lg">{selectedOrder.order_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    selectedOrder.status === 'paid' ? 'bg-green-400/20 text-green-100 border-green-300/30' :
                    selectedOrder.status === 'cancelled' ? 'bg-red-400/20 text-red-100 border-red-300/30' :
                    'bg-yellow-400/20 text-yellow-100 border-yellow-300/30'
                  }`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusCfg?.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/20">
                    <Package className="w-3.5 h-3.5" />
                    {PACKAGE_LABELS[selectedOrder.package_type] || selectedOrder.package_type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Betrag */}
                <div className="bg-gray-50 rounded-xl p-5 text-center">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Betrag</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {Number(selectedOrder.amount).toFixed(2).replace('.', ',')} <span className="text-lg">€</span>
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Benutzer</p>
                      <p className="text-sm font-medium">{selectedOrder.user_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">E-Mail</p>
                      <p className="text-sm font-medium truncate">{selectedOrder.user_email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Aktuelles Paket des Benutzers</p>
                      <p className="text-sm font-medium">{selectedOrder.user_package || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">Bestelldatum</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedOrder.created_at).toLocaleString('de-DE', {
                          day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Banknote className="w-4 h-4 text-indigo-600" />
                    <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide">Bankverbindung</p>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Empfänger</span><span className="font-medium">{settings.bank_recipient || 'EP Energy Platform GmbH'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">IBAN</span><span className="font-mono font-medium text-xs">{settings.bank_iban || 'DE89 3704 0044 0532 0130 00'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">BIC</span><span className="font-mono font-medium">{settings.bank_bic || 'COBADEFFXXX'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-medium">{settings.bank_name || 'Commerzbank'}</span></div>
                  </div>
                </div>

                {/* Payment Link */}
                <a
                  href={`/payment/${selectedOrder.order_id}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Zahlungsseite öffnen
                </a>

                {/* Actions */}
                {selectedOrder.status === 'pending' && (
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.order_id, 'paid');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Als bezahlt markieren
                    </button>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.order_id, 'cancelled');
                        setSelectedOrder(null);
                      }}
                      className="flex-1 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition text-sm flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Stornieren
                    </button>
                  </div>
                )}
                {selectedOrder.status === 'cancelled' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.order_id, 'paid');
                      setSelectedOrder(null);
                    }}
                    className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Als bezahlt markieren
                  </button>
                )}
                {selectedOrder.status === 'paid' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.order_id, 'cancelled');
                      setSelectedOrder(null);
                    }}
                    className="w-full py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition text-sm flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Stornieren
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
