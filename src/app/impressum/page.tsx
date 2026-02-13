'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, Mail, Phone, MapPin, Globe, Scale, User, Loader2 } from 'lucide-react';

export default function ImpressumPage() {
  const [s, setS] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { setS(d.settings || {}); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
        {/* Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30 mb-8">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Impressum</h1>
            <p className="text-lg text-gray-400">Angaben gemäß § 5 TMG</p>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
        ) : (
        /* Content */
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Angaben gemäß § 5 TMG</h2>
              </div>
              <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                <p className="font-semibold text-white text-base">{s.company_name || 'EP Energy Platform GmbH'}</p>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <p>{s.company_address || 'Musterstraße 123'}</p>
                    <p>{s.company_zip || '12345'} {s.company_city || 'Musterstadt'}</p>
                    <p>{s.company_country || 'Deutschland'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Kontakt</h2>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-green-400 shrink-0" />
                  <span>{s.contact_phone || '+49 123 456 789'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-green-400 shrink-0" />
                  <span>{s.contact_email || 'info@energy-platform.de'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-green-400 shrink-0" />
                  <span>{s.contact_website || 'www.energy-platform.de'}</span>
                </div>
              </div>
            </div>

            {/* Representative */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Vertretungsberechtigter Geschäftsführer</h2>
              </div>
              <p className="text-gray-300 text-sm">{s.company_ceo || 'Max Mustermann'}</p>
            </div>

            {/* Register */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Handelsregister & Umsatzsteuer</h2>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                <p><span className="text-gray-500">Registergericht:</span> {s.company_register || 'AG Musterstadt, HRB 123456'}</p>
                <p><span className="text-gray-500">USt-IdNr.:</span> {s.company_vat || 'DE123456789'}</p>
              </div>
            </div>

            {/* Dispute Resolution */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4">Streitschlichtung</h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p>
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </div>

            {/* Liability */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4">Haftung für Inhalte</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4">Haftung für Links</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4">Urheberrecht</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>
          </div>
        </section>
        )}
      </main>
      <Footer />
    </>
  );
}
