'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, Star, Zap, Crown, Clock, Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectPack = async (packageType: string) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType }),
      });
      const data = await res.json();
      setSubmitting(false);
      if (res.ok && data.orderId) {
        setSelectedPack(packageType);
        setSubmitted(true);
        refreshUser();
        // Redirect to payment page
        router.push(`/payment/${data.orderId}`);
      }
    } catch {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) return null;

  // Not approved
  if (!user.approved) {
    const currentPack = selectedPack || (user.package_type !== 'starter' ? user.package_type : null);
    const alreadyChosen = currentPack != null;

    const packages = [
      {
        key: 'popular',
        name: 'Popular',
        subtitle: 'Start Pack',
        price: '€49',
        icon: Star,
        color: 'from-blue-500 to-indigo-600',
        ring: 'ring-indigo-500',
        features: ['Volle Statistik', 'Teamübersicht', 'Standard Referral-Boni', 'Level 1–3 Boni'],
      },
      {
        key: 'business',
        name: 'Business',
        subtitle: 'Standard Pack',
        price: '€99',
        icon: Zap,
        color: 'from-indigo-500 to-purple-600',
        ring: 'ring-purple-500',
        popular: true,
        features: ['Alles aus Popular', 'Erhöhte Boni (+50%)', 'Erweiterte Analytik', 'Prioritäts-Support'],
      },
      {
        key: 'premium',
        name: 'Premium',
        subtitle: 'Premium Pack',
        price: '€199',
        icon: Crown,
        color: 'from-yellow-500 to-orange-500',
        ring: 'ring-yellow-500',
        features: ['Alles aus Business', 'Doppelte Boni (x2)', 'VIP-Support', 'Exklusiver Zugang'],
      },
    ];

    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 pb-12 bg-gray-50 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-10">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Warten auf Genehmigung</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Ihr Konto wird derzeit vom Administrator geprüft. Wählen Sie in der Zwischenzeit Ihr Paket — die Aktivierung erfolgt automatisch nach Genehmigung.
              </p>
            </div>

            {/* Success message */}
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Paket ausgewählt!</p>
                  <p className="text-green-700 text-sm">
                    Die Verarbeitung erfolgt automatisch. Nach Genehmigung durch den Administrator wird Ihr Paket sofort aktiviert.
                  </p>
                </div>
              </div>
            )}

            {/* Packages */}
            <h3 className="text-xl font-bold mb-6 text-center">Wählen Sie Ihr Paket</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const isSelected = currentPack === pkg.key;
                const Icon = pkg.icon;

                return (
                  <div
                    key={pkg.key}
                    className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-lg ${
                      isSelected ? `${pkg.ring} ring-2 border-transparent` : 'border-gray-100 hover:border-gray-200'
                    } ${pkg.popular && !isSelected ? 'shadow-md' : ''}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                        Empfohlen
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Ausgewählt
                      </div>
                    )}

                    <div className="p-8">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <h4 className="text-lg font-bold">{pkg.name}</h4>
                      <p className="text-gray-400 text-sm">{pkg.subtitle}</p>
                      <div className="text-3xl font-bold mt-3 mb-1">{pkg.price}</div>
                      <p className="text-gray-400 text-xs mb-6">einmalig</p>

                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSelectPack(pkg.key)}
                        disabled={submitting || isSelected}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                          isSelected
                            ? 'bg-green-50 text-green-700 cursor-default'
                            : `bg-gradient-to-r ${pkg.color} text-white hover:opacity-90 active:scale-[0.98]`
                        } disabled:opacity-60`}
                      >
                        {submitting ? 'Wird verarbeitet...' : isSelected ? 'Ausgewählt ✓' : 'Paket wählen'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-gray-400 text-sm mt-8">
              Sie können Ihr Paket jederzeit vor der Aktivierung ändern. Bei Fragen kontaktieren Sie uns.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex pt-16">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-4 inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <Menu className="w-5 h-5" />
            Menü
          </button>
          {children}
        </main>
      </div>
    </>
  );
}
