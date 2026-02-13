'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CreditCard,
  Copy,
  Check,
  Package,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface OrderData {
  order_id: string;
  package_type: string;
  amount: number;
  status: string;
  created_at: string;
  user_name: string;
}

const PACKAGE_LABELS: Record<string, string> = {
  popular: 'Popular (Start Pack)',
  business: 'Business (Standard Pack)',
  premium: 'Premium Pack',
};

const PACKAGE_COLORS: Record<string, string> = {
  popular: 'from-blue-500 to-cyan-500',
  business: 'from-purple-500 to-pink-500',
  premium: 'from-amber-500 to-orange-500',
};

export default function PaymentPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchOrder();
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.settings || {}));
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || 'Bestellung nicht gefunden');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Bestellung nicht gefunden
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Zurück zum Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.status === 'paid';
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Dashboard
        </Link>

        {/* Status Banner */}
        {isPaid && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">
                Zahlung bestätigt!
              </p>
              <p className="text-green-600 text-sm">
                Ihr Paket wurde aktiviert.
              </p>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">
                Bestellung storniert
              </p>
              <p className="text-red-600 text-sm">
                Diese Bestellung wurde storniert.
              </p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${
              PACKAGE_COLORS[order.package_type] || 'from-indigo-500 to-purple-500'
            } p-8 text-white`}
          >
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Zahlungsdetails</h1>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Bestellung</p>
                <p className="text-xl font-mono font-bold">{order.order_id}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Betrag</p>
                <p className="text-3xl font-bold">
                  {Number(order.amount).toFixed(2).replace('.', ',')} €
                </p>
              </div>
            </div>
          </div>

          {/* Package Info */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-indigo-500" />
              <h2 className="font-semibold text-gray-900">Gewähltes Paket</h2>
            </div>
            <p className="text-lg font-medium text-gray-800 ml-8">
              {PACKAGE_LABELS[order.package_type] || order.package_type}
            </p>
          </div>

          {/* Payment Instructions */}
          {!isPaid && !isCancelled && (
            <div className="p-8">
              <h2 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Überweisungsdaten
              </h2>

              <div className="space-y-4">
                {/* Bank details */}
                {[
                  { label: 'Empfänger', value: settings.bank_recipient || 'EP Energy Platform GmbH' },
                  { label: 'IBAN', value: settings.bank_iban || 'DE89 3704 0044 0532 0130 00' },
                  { label: 'BIC', value: settings.bank_bic || 'COBADEFFXXX' },
                  { label: 'Bank', value: settings.bank_name || 'Commerzbank' },
                  {
                    label: 'Betrag',
                    value: `${Number(order.amount).toFixed(2).replace('.', ',')} €`,
                  },
                  {
                    label: 'Verwendungszweck',
                    value: order.order_id,
                    highlight: true,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      item.highlight
                        ? 'bg-indigo-50 border-2 border-indigo-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p
                        className={`font-semibold ${
                          item.highlight
                            ? 'text-indigo-700 text-lg font-mono'
                            : 'text-gray-900'
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="p-2 rounded-lg hover:bg-white transition text-gray-400 hover:text-indigo-600"
                      title="Kopieren"
                    >
                      {copiedField === item.label ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 mb-1">
                      Wichtiger Hinweis
                    </p>
                    <p className="text-amber-700 text-sm">
                      Bitte geben Sie unbedingt die Zahlungs-ID{' '}
                      <strong className="font-mono">{order.order_id}</strong> als
                      Verwendungszweck bei Ihrer Überweisung an. Nur so können
                      wir Ihre Zahlung zuordnen und Ihr Paket freischalten.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 animate-pulse text-amber-500" />
                  Warten auf Zahlungseingang...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order date */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Bestellung erstellt am{' '}
          {new Date(order.created_at).toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
