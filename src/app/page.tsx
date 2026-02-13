'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import {
  Zap,
  Sun,
  Wind,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Star,
  Plug,
  Loader2,
  Shield,
  TrendingUp,
  Users,
  Sparkles,
  ArrowUpRight,
  Compass,
  Battery,
  Home,
  Thermometer,
  Droplets,
  Calendar,
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBySection />
        <ConfiguratorSection />
        <PackagesSection />
        <FeaturesSection />
      </main>
      <Footer />
    </>
  );
}

function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950" />
      
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-float-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] animate-float-slow" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="animate-fade-in-up stagger-1 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm text-white/90 mb-8 border border-white/10">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Nachhaltige Energie für alle</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
        </div>

        {/* Heading */}
        <h1 className="animate-fade-in-up stagger-2 text-5xl sm:text-6xl md:text-8xl font-extrabold text-white mb-8 leading-[1.05] tracking-tight">
          Ihre Energie.
          <br />
          <span className="gradient-text-gold">Ihre Zukunft.</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-in-up stagger-3 text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
          Photovoltaik & Wärmepumpen — konfigurieren Sie Ihre Lösung in 
          <span className="text-white font-semibold"> 60 Sekunden</span> und treten Sie unserem 
          <span className="text-white font-semibold"> Partnerprogramm</span> bei.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up stagger-4 flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-0.5"
            >
              <Zap className="w-5 h-5 text-indigo-600" /> Zum Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-0.5"
              >
                Jetzt starten 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/partner"
                className="group inline-flex items-center gap-2 border border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
              >
                Partnerprogramm
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up stagger-5 mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: '500+', label: 'Projekte' },
            { value: '98%', label: 'Zufriedenheit' },
            { value: '24/7', label: 'Support' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

function TrustedBySection() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-center text-gray-400 text-sm font-medium mb-8 uppercase tracking-wider">Trusted by innovative teams</p>
        <div className="flex items-center justify-center gap-12 md:gap-16 flex-wrap opacity-40 grayscale">
          {['SolarTech', 'GreenHome', 'EcoBuild', 'EnergyPlus', 'CleanPower'].map(name => (
            <div key={name} className="text-xl font-bold text-gray-600 tracking-tight">{name}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConfiguratorSection() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<'pv' | 'wp' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form data state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');

  const setAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!contactName || !contactPhone || !contactAddress) {
      setSubmitError('Bitte füllen Sie Name, Telefon und PLZ/Ort aus.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/configurator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: type === 'pv' ? 'PV' : 'WP',
          client_name: contactName,
          phone: contactPhone,
          email: contactEmail,
          address: contactAddress,
          answers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler');
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-2 block w-full rounded-xl border-gray-200 border p-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm';
  const labelClass = 'text-gray-700 text-sm font-semibold';
  const nextBtnClass = 'w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all font-semibold flex items-center justify-center gap-2';

  const steps = [
    {
      title: 'Wählen Sie den Typ',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => { setType('pv'); setStep(1); }}
            className={`group p-8 rounded-2xl border-2 transition-all text-left hover:shadow-xl hover:-translate-y-1 ${
              type === 'pv' ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10' : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
              <Sun className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Photovoltaik</h3>
            <p className="text-gray-500 text-sm">Solaranlage für Ihr Dach</p>
          </button>
          <button
            onClick={() => { setType('wp'); setStep(1); }}
            className={`group p-8 rounded-2xl border-2 transition-all text-left hover:shadow-xl hover:-translate-y-1 ${
              type === 'wp' ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10' : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Wind className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Wärmepumpe</h3>
            <p className="text-gray-500 text-sm">Effiziente Heiztechnik</p>
          </button>
        </div>
      ),
    },
    {
      title: type === 'pv' ? 'Ihr Dach' : 'Ihr Gebäude',
      content: (
        <div className="space-y-5 max-w-md mx-auto">
          {type === 'pv' ? (
            <>
              <label className="block">
                <span className={labelClass}>Dachtyp</span>
                <select className={inputClass} value={answers.dachtyp || 'Satteldach'} onChange={e => setAnswer('dachtyp', e.target.value)}>
                  <option>Satteldach</option>
                  <option>Flachdach</option>
                  <option>Pultdach</option>
                  <option>Walmdach</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Dachfläche (m²)</span>
                <input type="number" placeholder="z.B. 80" className={inputClass} value={answers.dachflaeche || ''} onChange={e => setAnswer('dachflaeche', e.target.value)} />
              </label>
              <label className="block">
                <span className={labelClass}>
                  <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-indigo-500" /> Dachausrichtung</span>
                </span>
                <select className={inputClass} value={answers.dachausrichtung || 'Süd'} onChange={e => setAnswer('dachausrichtung', e.target.value)}>
                  <option>Süd</option>
                  <option>Süd-Ost</option>
                  <option>Süd-West</option>
                  <option>Ost</option>
                  <option>West</option>
                  <option>Nord</option>
                </select>
              </label>
            </>
          ) : (
            <>
              <label className="block">
                <span className={labelClass}>
                  <span className="flex items-center gap-1.5"><Home className="w-4 h-4 text-indigo-500" /> Gebäudetyp</span>
                </span>
                <select className={inputClass} value={answers.gebaeudetyp || 'Einfamilienhaus'} onChange={e => setAnswer('gebaeudetyp', e.target.value)}>
                  <option>Einfamilienhaus</option>
                  <option>Mehrfamilienhaus</option>
                  <option>Reihenhaus</option>
                  <option>Doppelhaushälfte</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Wohnfläche (m²)</span>
                <input type="number" placeholder="z.B. 120" className={inputClass} value={answers.wohnflaeche || ''} onChange={e => setAnswer('wohnflaeche', e.target.value)} />
              </label>
              <label className="block">
                <span className={labelClass}>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-500" /> Baujahr des Gebäudes</span>
                </span>
                <select className={inputClass} value={answers.baujahr || 'Nach 2010'} onChange={e => setAnswer('baujahr', e.target.value)}>
                  <option>Vor 1970</option>
                  <option>1970 – 1990</option>
                  <option>1990 – 2010</option>
                  <option>Nach 2010</option>
                </select>
              </label>
            </>
          )}
          <button onClick={() => setStep(2)} className={nextBtnClass}>
            Weiter <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ),
    },
    {
      title: type === 'pv' ? 'Energiebedarf & Speicher' : 'Heizung & Bedarf',
      content: (
        <div className="space-y-5 max-w-md mx-auto">
          {type === 'pv' ? (
            <>
              <label className="block">
                <span className={labelClass}>Jährlicher Stromverbrauch (kWh)</span>
                <input type="number" placeholder="z.B. 4000" className={inputClass} value={answers.stromverbrauch || ''} onChange={e => setAnswer('stromverbrauch', e.target.value)} />
              </label>
              <label className="block">
                <span className={labelClass}>Verschattung des Dachs</span>
                <select className={inputClass} value={answers.verschattung || 'Keine Verschattung'} onChange={e => setAnswer('verschattung', e.target.value)}>
                  <option>Keine Verschattung</option>
                  <option>Teilweise verschattet</option>
                  <option>Stark verschattet</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>
                  <span className="flex items-center gap-1.5"><Battery className="w-4 h-4 text-indigo-500" /> Batteriespeicher gewünscht?</span>
                </span>
                <select className={inputClass} value={answers.batteriespeicher || 'Ja, mit Speicher'} onChange={e => setAnswer('batteriespeicher', e.target.value)}>
                  <option>Ja, mit Speicher</option>
                  <option>Nein, ohne Speicher</option>
                  <option>Bin mir unsicher</option>
                </select>
              </label>
              {(answers.batteriespeicher || 'Ja, mit Speicher') !== 'Nein, ohne Speicher' && (
                <label className="block">
                  <span className={labelClass}>
                    <span className="flex items-center gap-1.5"><Battery className="w-4 h-4 text-green-500" /> Gewünschte Speicherkapazität (kWh)</span>
                  </span>
                  <select className={inputClass} value={answers.speicherkapazitaet || 'Bin mir unsicher'} onChange={e => setAnswer('speicherkapazitaet', e.target.value)}>
                    <option>5 kWh</option>
                    <option>10 kWh</option>
                    <option>15 kWh</option>
                    <option>20 kWh oder mehr</option>
                    <option>Bin mir unsicher</option>
                  </select>
                </label>
              )}
              <label className="block">
                <span className={labelClass}>Haben Sie ein Elektroauto oder planen Sie eins?</span>
                <select className={inputClass} value={answers.elektroauto || 'Nein'} onChange={e => setAnswer('elektroauto', e.target.value)}>
                  <option>Nein</option>
                  <option>Ja, bereits vorhanden</option>
                  <option>Ja, in Planung</option>
                </select>
              </label>
              {(answers.elektroauto && answers.elektroauto !== 'Nein') && (
                <label className="block">
                  <span className={labelClass}>
                    <span className="flex items-center gap-1.5"><Plug className="w-4 h-4 text-indigo-500" /> Wallbox gewünscht?</span>
                  </span>
                  <select className={inputClass} value={answers.wallbox || 'Ja'} onChange={e => setAnswer('wallbox', e.target.value)}>
                    <option>Ja</option>
                    <option>Nein, bereits vorhanden</option>
                    <option>Nein, nicht benötigt</option>
                    <option>Bin mir unsicher</option>
                  </select>
                </label>
              )}
            </>
          ) : (
            <>
              <label className="block">
                <span className={labelClass}>
                  <span className="flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-indigo-500" /> Aktuelle Heizungsart</span>
                </span>
                <select className={inputClass} value={answers.heizungsart || 'Gas'} onChange={e => setAnswer('heizungsart', e.target.value)}>
                  <option>Gas</option>
                  <option>Öl</option>
                  <option>Elektro</option>
                  <option>Fernwärme</option>
                  <option>Sonstige</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Anzahl Personen im Haushalt</span>
                <input type="number" placeholder="z.B. 4" min="1" className={inputClass} value={answers.personen || ''} onChange={e => setAnswer('personen', e.target.value)} />
              </label>
              <label className="block">
                <span className={labelClass}>
                  <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-indigo-500" /> Warmwasser über Wärmepumpe?</span>
                </span>
                <select className={inputClass} value={answers.warmwasser || 'Ja, Heizung + Warmwasser'} onChange={e => setAnswer('warmwasser', e.target.value)}>
                  <option>Ja, Heizung + Warmwasser</option>
                  <option>Nein, nur Heizung</option>
                  <option>Bin mir unsicher</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Bevorzugter Wärmepumpentyp</span>
                <select className={inputClass} value={answers.waermepumpentyp || 'Luft-Wasser-Wärmepumpe'} onChange={e => setAnswer('waermepumpentyp', e.target.value)}>
                  <option>Luft-Wasser-Wärmepumpe</option>
                  <option>Erdwärmepumpe (Sole)</option>
                  <option>Wasser-Wasser-Wärmepumpe</option>
                  <option>Bin mir unsicher</option>
                </select>
              </label>
            </>
          )}
          <button onClick={() => setStep(3)} className={nextBtnClass}>
            Weiter <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ),
    },
    {
      title: 'Zusätzliche Angaben',
      content: (
        <div className="space-y-5 max-w-md mx-auto">
          {type === 'pv' ? (
            <>
              <label className="block">
                <span className={labelClass}>Eigentumsform</span>
                <select className={inputClass} value={answers.eigentumsform || 'Eigentümer'} onChange={e => setAnswer('eigentumsform', e.target.value)}>
                  <option>Eigentümer</option>
                  <option>Mieter</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Umsetzungszeitraum</span>
                <select className={inputClass} value={answers.zeitraum || 'So schnell wie möglich'} onChange={e => setAnswer('zeitraum', e.target.value)}>
                  <option>So schnell wie möglich</option>
                  <option>In den nächsten 3 Monaten</option>
                  <option>In den nächsten 6 Monaten</option>
                  <option>Nur informieren</option>
                </select>
              </label>
            </>
          ) : (
            <>
              <label className="block">
                <span className={labelClass}>Zustand der Gebäudedämmung</span>
                <select className={inputClass} value={answers.daemmung || 'Gut gedämmt (Neubau / saniert)'} onChange={e => setAnswer('daemmung', e.target.value)}>
                  <option>Gut gedämmt (Neubau / saniert)</option>
                  <option>Teilweise gedämmt</option>
                  <option>Kaum / nicht gedämmt</option>
                  <option>Unbekannt</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Umsetzungszeitraum</span>
                <select className={inputClass} value={answers.zeitraum || 'So schnell wie möglich'} onChange={e => setAnswer('zeitraum', e.target.value)}>
                  <option>So schnell wie möglich</option>
                  <option>In den nächsten 3 Monaten</option>
                  <option>In den nächsten 6 Monaten</option>
                  <option>Nur informieren</option>
                </select>
              </label>
            </>
          )}
          <button onClick={() => setStep(4)} className={nextBtnClass}>
            Weiter <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ),
    },
    {
      title: 'Kontaktdaten',
      content: (
        <div className="space-y-5 max-w-md mx-auto">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Vielen Dank!</h3>
              <p className="text-gray-500">Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.</p>
            </div>
          ) : (
            <>
              <input type="text" placeholder="Ihr Name *" className={inputClass} value={contactName} onChange={e => setContactName(e.target.value)} />
              <input type="email" placeholder="E-Mail-Adresse" className={inputClass} value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
              <input type="tel" placeholder="Telefonnummer *" className={inputClass} value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
              <input type="text" placeholder="PLZ / Ort *" className={inputClass} value={contactAddress} onChange={e => setContactAddress(e.target.value)} />
              {submitError && (
                <p className="text-red-500 text-sm text-center">{submitError}</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`${nextBtnClass} ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Wird gesendet...</>
                ) : (
                  'Anfrage absenden'
                )}
              </button>
              <p className="text-xs text-gray-400 text-center">* Pflichtfelder</p>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <section className="py-28 bg-gray-50/80" id="configurator">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" /> Schnell & einfach
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">60-Sekunden-Konfigurator</h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">Finden Sie die perfekte Lösung für Ihr Zuhause</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i <= step 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 h-1 mx-1.5 rounded-full transition-all duration-500 ${i < step ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
          <h3 className="text-xl font-bold mb-8 text-center">{steps[step].title}</h3>
          {steps[step].content}
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="mt-6 text-gray-400 hover:text-indigo-600 text-sm mx-auto block transition font-medium">
              ← Zurück
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function PackagesSection() {
  const { user } = useAuth();

  const packages = [
    {
      key: 'starter',
      name: 'Starter',
      price: 'Kostenlos',
      features: ['Zugang zur Plattform', 'Projekte hinzufügen', 'Eingeschränkte Statistik'],
      disabled: ['Teameinsicht', 'Referral-Boni'],
      popular: false,
      gradient: 'from-gray-500 to-gray-600',
    },
    {
      key: 'popular',
      name: 'Popular',
      subtitle: 'Start Pack',
      price: '€49',
      features: ['Volle Statistik', 'Teamübersicht', 'Referral-Boni (Standard)', 'Projekte hinzufügen'],
      disabled: [],
      popular: true,
      gradient: 'from-indigo-500 to-blue-600',
    },
    {
      key: 'business',
      name: 'Business',
      subtitle: 'Standard Pack',
      price: '€99',
      features: ['Alles aus Popular', 'Erhöhte Boni (+50%)', 'Erweiterte Analytik', 'Prioritäts-Support'],
      disabled: [],
      popular: false,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      key: 'premium',
      name: 'Premium',
      price: '€199',
      features: ['Alles aus Business', 'Doppelte Boni (x2)', 'VIP-Support', 'Exklusiver Zugang'],
      disabled: [],
      popular: false,
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            <Star className="w-4 h-4" /> Preise
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Wählen Sie Ihren Plan</h2>
          <p className="text-gray-500 text-lg">Starten Sie kostenlos und wachsen Sie mit uns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-3xl transition-all duration-300 hover:-translate-y-2 ${
                pkg.popular
                  ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-indigo-500/30 scale-[1.03] z-10'
                  : 'bg-white border border-gray-200 hover:shadow-xl hover:border-gray-300'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-current" /> BELIEBT
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                {pkg.subtitle && (
                  <p className={`text-sm ${pkg.popular ? 'text-white/60' : 'text-gray-400'}`}>{pkg.subtitle}</p>
                )}
                <div className="text-4xl font-extrabold mt-4 mb-1">{pkg.price}</div>
                <p className={`text-xs mb-8 ${pkg.popular ? 'text-white/50' : 'text-gray-400'}`}>einmalig</p>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${pkg.popular ? 'text-yellow-300' : 'text-green-500'}`} />
                      {f}
                    </li>
                  ))}
                  {pkg.disabled.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400 line-through">
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={
                    pkg.key === 'starter'
                      ? '/register'
                      : user
                        ? `/dashboard/shop?package=${pkg.key}`
                        : '/register'
                  }
                  className={`block text-center py-3.5 rounded-xl font-semibold transition-all ${
                    pkg.popular
                      ? 'bg-white text-indigo-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r ' + pkg.gradient + ' text-white hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5'
                  }`}
                >
                  {pkg.key === 'starter' ? 'Registrieren' : 'Auswählen'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { 
      icon: Sun, 
      title: 'Photovoltaik', 
      desc: 'Solaranlagen für Ihr Dach — sauber und effizient. Wir beraten Sie individuell.',
      gradient: 'from-yellow-400 to-orange-500',
      shadow: 'shadow-yellow-500/20',
    },
    { 
      icon: Wind, 
      title: 'Wärmepumpen', 
      desc: 'Moderne Heiztechnik für niedrige Betriebskosten und maximalen Komfort.',
      gradient: 'from-blue-400 to-cyan-500',
      shadow: 'shadow-blue-500/20',
    },
    { 
      icon: TrendingUp, 
      title: 'Partnerprogramm', 
      desc: 'Verdienen Sie mit jedem Projekt Ihrer Empfehlungen — 3-stufige Bonusstruktur.',
      gradient: 'from-indigo-500 to-purple-600',
      shadow: 'shadow-indigo-500/20',
    },
    { 
      icon: Shield, 
      title: 'Sicherheit', 
      desc: 'Ihre Daten sind bei uns sicher. Verschlüsselte Übertragung und strenger Datenschutz.',
      gradient: 'from-green-400 to-emerald-500',
      shadow: 'shadow-green-500/20',
    },
    { 
      icon: Users, 
      title: 'Team-Übersicht', 
      desc: 'Verfolgen Sie Ihr Team über 3 Levels — vollständige Transparenz in Echtzeit.',
      gradient: 'from-pink-400 to-rose-500',
      shadow: 'shadow-pink-500/20',
    },
    { 
      icon: Sparkles, 
      title: 'Moderne Plattform', 
      desc: 'Intuitives Dashboard, Echtzeit-Daten und automatisierte Bonusberechnung.',
      gradient: 'from-violet-400 to-purple-500',
      shadow: 'shadow-violet-500/20',
    },
  ];

  return (
    <section className="py-28 bg-gray-50/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" /> Features
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Warum EP?</h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">Alles was Sie für nachhaltigen Erfolg brauchen</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc, gradient, shadow }) => (
            <div key={title} className="group bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg ${shadow} group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
