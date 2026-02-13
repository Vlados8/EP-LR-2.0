'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import {
  ShoppingBag,
  CheckCircle,
  Star,
  Zap,
  Crown,
  Rocket,
  ArrowRight,
  XCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

const PACKAGE_LEVELS: Record<string, number> = {
  starter: 0,
  popular: 1,
  business: 2,
  premium: 3,
};

function ShopContent() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ordering, setOrdering] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [autoTriggered, setAutoTriggered] = useState(false);

  const packages = [
    {
      key: 'starter',
      name: 'Starter',
      price: 'Kostenlos',
      desc: 'Grundlegender Zugang',
      features: ['Projekte hinzufügen', 'Basis-Dashboard'],
      restricted: ['Statistik eingeschränkt', 'Kein Team-Zugriff', 'Keine Referral-Boni'],
      icon: Zap,
      gradient: 'from-gray-400 to-gray-500',
      shadow: 'shadow-gray-500/10',
    },
    {
      key: 'popular',
      name: 'Popular',
      subtitle: 'Start Pack',
      price: '€49',
      desc: 'Empfohlen für den Einstieg',
      features: ['Volle Statistik', 'Team-Übersicht', 'Standard Referral-Boni', 'Level 1-3 Boni'],
      restricted: [],
      popular: true,
      icon: Star,
      gradient: 'from-indigo-500 to-purple-600',
      shadow: 'shadow-indigo-500/20',
    },
    {
      key: 'business',
      name: 'Business',
      subtitle: 'Standard Pack',
      price: '€99',
      desc: 'Für ambitionierte Partner',
      features: ['Alles aus Popular', 'Erhöhte Boni (+50%)', 'Erweiterte Analyse', 'Prioritäts-Support'],
      restricted: [],
      icon: Rocket,
      gradient: 'from-blue-500 to-cyan-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      key: 'premium',
      name: 'Premium',
      price: '€199',
      desc: 'Maximale Vorteile',
      features: ['Alles aus Business', 'Doppelte Boni (x2)', 'VIP-Support', 'Exklusiver Zugang'],
      restricted: [],
      icon: Crown,
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
    },
  ];

  const currentPkg = user?.package_type || 'starter';
  const currentLevel = PACKAGE_LEVELS[currentPkg] ?? 0;

  // Auto-order if ?package= query param is present
  useEffect(() => {
    const selectedPackage = searchParams.get('package');
    if (selectedPackage && user && !autoTriggered && ['popular', 'business', 'premium'].includes(selectedPackage)) {
      const selectedLevel = PACKAGE_LEVELS[selectedPackage] ?? 0;
      setAutoTriggered(true);
      if (selectedLevel > currentLevel) {
        handleOrder(selectedPackage);
      } else {
        setError('Sie können nur ein höheres Paket als Ihr aktuelles wählen.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user]);

  const handleOrder = async (packageType: string) => {
    setError('');
    setOrdering(packageType);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Fehler bei der Bestellung');
        setOrdering(null);
        return;
      }

      // Refresh user data and redirect to payment page
      await refreshUser();
      router.push(`/payment/${data.orderId}`);
    } catch {
      setError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
      setOrdering(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          Shop
        </h1>
        <p className="text-gray-500 mt-2">
          Ihr aktuelles Paket:{' '}
          <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full text-sm">
            {currentPkg.toUpperCase()}
          </span>
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm font-medium">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, i) => {
          const isCurrent = pkg.key === currentPkg;
          const pkgLevel = PACKAGE_LEVELS[pkg.key] ?? 0;
          const isLowerOrEqual = pkgLevel <= currentLevel;
          const canUpgrade = pkgLevel > currentLevel && pkg.key !== 'starter';
          const Icon = pkg.icon;

          return (
            <div
              key={pkg.key}
              className={`group rounded-2xl p-6 transition-all duration-300 relative animate-fade-in-up stagger-${
                i + 1
              } hover:-translate-y-2 ${
                pkg.popular
                  ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-2xl shadow-indigo-500/30 ring-2 ring-indigo-400/50 scale-[1.02]'
                  : 'bg-white border border-gray-100 hover:shadow-xl hover:border-gray-200'
              } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
            >
              {/* Decorative orb for popular */}
              {pkg.popular && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              )}

              {isCurrent && (
                <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg shadow-green-500/20">
                  Aktuell
                </div>
              )}
              {pkg.popular && !isCurrent && (
                <div className="flex items-center gap-1 text-yellow-300 text-sm font-bold mb-1">
                  <Star className="w-4 h-4 fill-current" /> Beliebt
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  pkg.popular
                    ? 'bg-white/20'
                    : `bg-gradient-to-br ${pkg.gradient} shadow-lg ${pkg.shadow}`
                }`}
              >
                <Icon className={`w-6 h-6 ${pkg.popular ? 'text-white' : 'text-white'}`} />
              </div>

              <h3 className="text-lg font-extrabold relative z-10">{pkg.name}</h3>
              {pkg.subtitle && (
                <p
                  className={`text-xs font-medium ${
                    pkg.popular ? 'text-indigo-200' : 'text-gray-400'
                  }`}
                >
                  {pkg.subtitle}
                </p>
              )}
              <div className="text-3xl font-extrabold mt-3 mb-2 relative z-10">{pkg.price}</div>
              <p className={`text-sm mb-5 ${pkg.popular ? 'text-indigo-200' : 'text-gray-400'}`}>
                {pkg.desc}
              </p>

              <ul className="space-y-2.5 mb-6">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        pkg.popular ? 'text-yellow-300' : 'text-green-500'
                      }`}
                    />
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
                {pkg.restricted?.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-300" />
                    <span className="line-through">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div
                  className={`text-center py-3 rounded-xl font-semibold text-sm ${
                    pkg.popular ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  Aktives Paket
                </div>
              ) : isLowerOrEqual && pkg.key !== 'starter' ? (
                <div
                  className={`text-center py-3 rounded-xl font-semibold text-sm ${
                    pkg.popular ? 'bg-white/10 text-white/50' : 'bg-gray-50 text-gray-400'
                  } cursor-not-allowed`}
                >
                  Bereits enthalten
                </div>
              ) : canUpgrade ? (
                <button
                  disabled={ordering === pkg.key}
                  onClick={() => handleOrder(pkg.key)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'bg-white text-indigo-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20'
                  } ${ordering === pkg.key ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {ordering === pkg.key ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Wird bestellt...
                    </>
                  ) : (
                    <>
                      Upgrade <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <div
                  className={`text-center py-3 rounded-xl font-semibold text-sm ${
                    pkg.popular ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {pkg.key === 'starter' ? 'Standardpaket' : 'Kontaktieren'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-gray-50 to-indigo-50/50 rounded-2xl p-6 text-center text-gray-500 text-sm border border-gray-100">
        <Zap className="w-5 h-5 inline text-indigo-500 mr-1.5" />
        Paket-Upgrades werden vom Administrator nach Zahlungseingang freigeschaltet.
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
