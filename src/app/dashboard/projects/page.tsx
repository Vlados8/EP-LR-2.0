'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FolderPlus, Sun, Wind, CheckCircle, XCircle, Clock, Plus, X,
  ChevronRight, ChevronLeft, Compass, Home, Calendar, Battery,
  Thermometer, Droplets, Plug, Loader2, Zap, Eye, Send
} from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Multi-step form state
  const [formStep, setFormStep] = useState(0);
  const [serviceType, setServiceType] = useState<'PV' | 'WP' | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  const setAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || []));
  };

  const resetForm = () => {
    setFormStep(0);
    setServiceType(null);
    setAnswers({});
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setClientAddress('');
  };

  const handleSubmit = async () => {
    if (!clientName || !clientPhone || !clientAddress) {
      setMessage('Bitte füllen Sie Name, Telefon und Adresse aus.');
      return;
    }
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_type: serviceType,
        client_name: clientName,
        phone: clientPhone,
        address: clientAddress,
        answers: { ...answers, email: clientEmail || undefined },
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage('Projekt erfolgreich erstellt!');
      setShowForm(false);
      resetForm();
      fetchProjects();
      setTimeout(() => setMessage(''), 4000);
    } else {
      setMessage(data.error || 'Fehler beim Erstellen');
    }
  };

  const statusBadge = (status: string) => {
    const base = 'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full';
    switch (status) {
      case 'approved': return `${base} bg-green-50 text-green-700 border border-green-200`;
      case 'rejected': return `${base} bg-red-50 text-red-700 border border-red-200`;
      default: return `${base} bg-yellow-50 text-yellow-700 border border-yellow-200`;
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'rejected': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Genehmigt';
      case 'rejected': return 'Abgelehnt';
      default: return 'Ausstehend';
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';
  const selectClass = inputClass;

  // ── Step definitions ──
  const totalSteps = 5;

  const renderStepContent = () => {
    switch (formStep) {
      // Step 0: Type selection
      case 0:
        return (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Wählen Sie den Servicetyp</h3>
            <p className="text-sm text-gray-400 text-center mb-8">Welche Energielösung benötigt Ihr Kunde?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <button
                type="button"
                onClick={() => { setServiceType('PV'); setFormStep(1); }}
                className={`group p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg hover:-translate-y-0.5 ${
                  serviceType === 'PV' ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100' : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-gray-800">Photovoltaik</div>
                <div className="text-xs text-gray-400 mt-1">Solaranlage für das Dach</div>
              </button>
              <button
                type="button"
                onClick={() => { setServiceType('WP'); setFormStep(1); }}
                className={`group p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg hover:-translate-y-0.5 ${
                  serviceType === 'WP' ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100' : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-gray-800">Wärmepumpe</div>
                <div className="text-xs text-gray-400 mt-1">Effiziente Heiztechnik</div>
              </button>
            </div>
          </div>
        );

      // Step 1: Building / Roof info
      case 1:
        return (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">
              {serviceType === 'PV' ? 'Dach & Gebäude' : 'Gebäudeinformationen'}
            </h3>
            <p className="text-sm text-gray-400 text-center mb-6">Angaben zum Objekt des Kunden</p>
            <div className="space-y-4 max-w-md mx-auto">
              {serviceType === 'PV' ? (
                <>
                  <div>
                    <label className={labelClass}>Dachtyp</label>
                    <select className={selectClass} value={answers.dachtyp || 'Satteldach'} onChange={e => setAnswer('dachtyp', e.target.value)}>
                      <option>Satteldach</option>
                      <option>Flachdach</option>
                      <option>Pultdach</option>
                      <option>Walmdach</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Dachfläche (m²)</label>
                    <input type="number" placeholder="z.B. 80" className={inputClass} value={answers.dachflaeche || ''} onChange={e => setAnswer('dachflaeche', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-indigo-500" /> Dachausrichtung</span>
                    </label>
                    <select className={selectClass} value={answers.dachausrichtung || 'Süd'} onChange={e => setAnswer('dachausrichtung', e.target.value)}>
                      <option>Süd</option>
                      <option>Süd-Ost</option>
                      <option>Süd-West</option>
                      <option>Ost</option>
                      <option>West</option>
                      <option>Nord</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1.5"><Home className="w-4 h-4 text-indigo-500" /> Gebäudetyp</span>
                    </label>
                    <select className={selectClass} value={answers.gebaeudetyp || 'Einfamilienhaus'} onChange={e => setAnswer('gebaeudetyp', e.target.value)}>
                      <option>Einfamilienhaus</option>
                      <option>Mehrfamilienhaus</option>
                      <option>Reihenhaus</option>
                      <option>Doppelhaushälfte</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Wohnfläche (m²)</label>
                    <input type="number" placeholder="z.B. 120" className={inputClass} value={answers.wohnflaeche || ''} onChange={e => setAnswer('wohnflaeche', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-500" /> Baujahr des Gebäudes</span>
                    </label>
                    <select className={selectClass} value={answers.baujahr || 'Nach 2010'} onChange={e => setAnswer('baujahr', e.target.value)}>
                      <option>Vor 1970</option>
                      <option>1970 – 1990</option>
                      <option>1990 – 2010</option>
                      <option>Nach 2010</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      // Step 2: Energy & Storage (PV) / Heating (WP)
      case 2:
        return (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">
              {serviceType === 'PV' ? 'Energiebedarf & Speicher' : 'Heizung & Bedarf'}
            </h3>
            <p className="text-sm text-gray-400 text-center mb-6">Technische Details zum Energiebedarf</p>
            <div className="space-y-4 max-w-md mx-auto">
              {serviceType === 'PV' ? (
                <>
                  <div>
                    <label className={labelClass}>Jährlicher Stromverbrauch (kWh)</label>
                    <input type="number" placeholder="z.B. 4000" className={inputClass} value={answers.stromverbrauch || ''} onChange={e => setAnswer('stromverbrauch', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Verschattung des Dachs</label>
                    <select className={selectClass} value={answers.verschattung || 'Keine Verschattung'} onChange={e => setAnswer('verschattung', e.target.value)}>
                      <option>Keine Verschattung</option>
                      <option>Teilweise verschattet</option>
                      <option>Stark verschattet</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1.5"><Battery className="w-4 h-4 text-indigo-500" /> Batteriespeicher gewünscht?</span>
                    </label>
                    <select className={selectClass} value={answers.batteriespeicher || 'Ja, mit Speicher'} onChange={e => setAnswer('batteriespeicher', e.target.value)}>
                      <option>Ja, mit Speicher</option>
                      <option>Nein, ohne Speicher</option>
                      <option>Bin mir unsicher</option>
                    </select>
                  </div>
                  {(answers.batteriespeicher || 'Ja, mit Speicher') !== 'Nein, ohne Speicher' && (
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-1.5"><Battery className="w-4 h-4 text-green-500" /> Gewünschte Speicherkapazität (kWh)</span>
                      </label>
                      <select className={selectClass} value={answers.speicherkapazitaet || 'Bin mir unsicher'} onChange={e => setAnswer('speicherkapazitaet', e.target.value)}>
                        <option>5 kWh</option>
                        <option>10 kWh</option>
                        <option>15 kWh</option>
                        <option>20 kWh oder mehr</option>
                        <option>Bin mir unsicher</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Elektroauto vorhanden / geplant?</label>
                    <select className={selectClass} value={answers.elektroauto || 'Nein'} onChange={e => setAnswer('elektroauto', e.target.value)}>
                      <option>Nein</option>
                      <option>Ja, bereits vorhanden</option>
                      <option>Ja, in Planung</option>
                    </select>
                  </div>
                  {(answers.elektroauto && answers.elektroauto !== 'Nein') && (
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-1.5"><Plug className="w-4 h-4 text-indigo-500" /> Wallbox gewünscht?</span>
                      </label>
                      <select className={selectClass} value={answers.wallbox || 'Ja'} onChange={e => setAnswer('wallbox', e.target.value)}>
                        <option>Ja</option>
                        <option>Nein, bereits vorhanden</option>
                        <option>Nein, nicht benötigt</option>
                        <option>Bin mir unsicher</option>
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-indigo-500" /> Aktuelle Heizungsart</span>
                    </label>
                    <select className={selectClass} value={answers.heizungsart || 'Gas'} onChange={e => setAnswer('heizungsart', e.target.value)}>
                      <option>Gas</option>
                      <option>Öl</option>
                      <option>Elektro</option>
                      <option>Fernwärme</option>
                      <option>Sonstige</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Anzahl Personen im Haushalt</label>
                    <input type="number" placeholder="z.B. 4" min="1" className={inputClass} value={answers.personen || ''} onChange={e => setAnswer('personen', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-indigo-500" /> Warmwasser über Wärmepumpe?</span>
                    </label>
                    <select className={selectClass} value={answers.warmwasser || 'Ja, Heizung + Warmwasser'} onChange={e => setAnswer('warmwasser', e.target.value)}>
                      <option>Ja, Heizung + Warmwasser</option>
                      <option>Nein, nur Heizung</option>
                      <option>Bin mir unsicher</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Bevorzugter Wärmepumpentyp</label>
                    <select className={selectClass} value={answers.waermepumpentyp || 'Luft-Wasser-Wärmepumpe'} onChange={e => setAnswer('waermepumpentyp', e.target.value)}>
                      <option>Luft-Wasser-Wärmepumpe</option>
                      <option>Erdwärmepumpe (Sole)</option>
                      <option>Wasser-Wasser-Wärmepumpe</option>
                      <option>Bin mir unsicher</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      // Step 3: Additional info
      case 3:
        return (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">Zusätzliche Angaben</h3>
            <p className="text-sm text-gray-400 text-center mb-6">Weitere Informationen zum Projekt</p>
            <div className="space-y-4 max-w-md mx-auto">
              {serviceType === 'PV' ? (
                <>
                  <div>
                    <label className={labelClass}>Eigentumsform</label>
                    <select className={selectClass} value={answers.eigentumsform || 'Eigentümer'} onChange={e => setAnswer('eigentumsform', e.target.value)}>
                      <option>Eigentümer</option>
                      <option>Mieter</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Bestehende PV-Anlage?</label>
                    <select className={selectClass} value={answers.bestehendeAnlage || 'Nein'} onChange={e => setAnswer('bestehendeAnlage', e.target.value)}>
                      <option>Nein</option>
                      <option>Ja</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Umsetzungszeitraum</label>
                    <select className={selectClass} value={answers.zeitraum || 'So schnell wie möglich'} onChange={e => setAnswer('zeitraum', e.target.value)}>
                      <option>So schnell wie möglich</option>
                      <option>In den nächsten 3 Monaten</option>
                      <option>In den nächsten 6 Monaten</option>
                      <option>Nur informieren</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>Zustand der Gebäudedämmung</label>
                    <select className={selectClass} value={answers.daemmung || 'Gut gedämmt (Neubau / saniert)'} onChange={e => setAnswer('daemmung', e.target.value)}>
                      <option>Gut gedämmt (Neubau / saniert)</option>
                      <option>Teilweise gedämmt</option>
                      <option>Kaum / nicht gedämmt</option>
                      <option>Unbekannt</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Heizkörpertyp im Gebäude</label>
                    <select className={selectClass} value={answers.heizkoerper || 'Fußbodenheizung'} onChange={e => setAnswer('heizkoerper', e.target.value)}>
                      <option>Fußbodenheizung</option>
                      <option>Heizkörper (Radiatoren)</option>
                      <option>Gemischt</option>
                      <option>Unbekannt</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Umsetzungszeitraum</label>
                    <select className={selectClass} value={answers.zeitraum || 'So schnell wie möglich'} onChange={e => setAnswer('zeitraum', e.target.value)}>
                      <option>So schnell wie möglich</option>
                      <option>In den nächsten 3 Monaten</option>
                      <option>In den nächsten 6 Monaten</option>
                      <option>Nur informieren</option>
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className={labelClass}>Anmerkungen (optional)</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="Besonderheiten, Wünsche..."
                  value={answers.anmerkungen || ''}
                  onChange={e => setAnswer('anmerkungen', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      // Step 4: Contact data
      case 4:
        return (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">Kundendaten</h3>
            <p className="text-sm text-gray-400 text-center mb-6">Kontaktdaten des Kunden</p>
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className={labelClass}>Kundenname *</label>
                <input type="text" placeholder="Vor- und Nachname" className={inputClass} value={clientName} onChange={e => setClientName(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>E-Mail-Adresse</label>
                <input type="email" placeholder="kunde@beispiel.de" className={inputClass} value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Telefonnummer *</label>
                <input type="tel" placeholder="+49 123 456789" className={inputClass} value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Adresse / PLZ / Ort *</label>
                <input type="text" placeholder="Straße, PLZ Ort" className={inputClass} value={clientAddress} onChange={e => setClientAddress(e.target.value)} />
              </div>
              <p className="text-xs text-gray-400 text-center">* Pflichtfelder</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Meine Projekte</h1>
          <p className="text-gray-500 text-sm">Verwalten Sie Ihre Energieprojekte</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all font-semibold text-sm"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span className="hidden sm:inline">{showForm ? 'Schließen' : 'Neues Projekt'}</span>
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in-up ${
          message.includes('erfolgreich') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.includes('erfolgreich') ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {message}
        </div>
      )}

      {/* ── Multi-step Configurator Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 mb-8 animate-fade-in-up shadow-sm">
          {/* Header with type icon */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              serviceType === 'PV' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
              serviceType === 'WP' ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
              'bg-gradient-to-br from-indigo-400 to-purple-500'
            }`}>
              {serviceType === 'PV' ? <Sun className="w-5 h-5 text-white" /> :
               serviceType === 'WP' ? <Wind className="w-5 h-5 text-white" /> :
               <Zap className="w-5 h-5 text-white" />}
            </div>
            <h2 className="text-lg font-bold text-gray-800">Projekt-Konfigurator</h2>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                  i <= formStep
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {i < formStep ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-6 sm:w-12 h-1 mx-0.5 sm:mx-1 rounded-full transition-all duration-500 ${i < formStep ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-100'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[320px]">
            {renderStepContent()}
          </div>

          {/* Navigation buttons */}
          {formStep > 0 && (
            <div className="flex items-center justify-between mt-8 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setFormStep(formStep - 1)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-600 text-sm font-medium transition"
              >
                <ChevronLeft className="w-4 h-4" /> Zurück
              </button>

              {formStep < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={() => setFormStep(formStep + 1)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all text-sm font-semibold"
                >
                  Weiter <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all text-sm font-semibold ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Speichern...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Projekt erstellen</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Projects list ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {projects.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderPlus className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">Noch keine Projekte vorhanden</p>
            <p className="text-gray-300 text-sm mt-1">Erstellen Sie Ihr erstes Projekt</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Typ</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kunde</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Adresse</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p: any) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.service_type === 'PV' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                            {p.service_type === 'PV' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Wind className="w-4 h-4 text-blue-500" />}
                          </div>
                          <span className="text-sm font-medium">{p.service_type === 'PV' ? 'PV' : 'WP'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{p.client_name}</p>
                        <p className="text-xs text-gray-400">{p.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.address}</td>
                      <td className="px-6 py-4">
                        <span className={statusBadge(p.status)}>
                          {statusIcon(p.status)} {statusLabel(p.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(p.created_at).toLocaleDateString('de-DE')}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setSelectedProject(p)} className="text-gray-400 hover:text-indigo-600 transition p-1">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {projects.map((p: any) => (
                <div key={p.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${p.service_type === 'PV' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                        {p.service_type === 'PV' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Wind className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{p.client_name}</p>
                        <p className="text-xs text-gray-400">{p.phone}</p>
                      </div>
                    </div>
                    <span className={statusBadge(p.status)}>
                      {statusIcon(p.status)} {statusLabel(p.status)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{p.address}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('de-DE')}</span>
                    <button onClick={() => setSelectedProject(p)} className="text-indigo-500 hover:text-indigo-700 text-xs font-medium flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Project detail modal ── */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 max-h-[85vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedProject.service_type === 'PV' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-400 to-cyan-500'
                }`}>
                  {selectedProject.service_type === 'PV' ? <Sun className="w-5 h-5 text-white" /> : <Wind className="w-5 h-5 text-white" />}
                </div>
                <h2 className="text-lg font-bold">Projektdetails</h2>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Typ</label>
                  <p className="font-medium text-sm mt-0.5">{selectedProject.service_type === 'PV' ? 'Photovoltaik' : 'Wärmepumpe'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Status</label>
                  <p className="mt-0.5">
                    <span className={statusBadge(selectedProject.status)}>
                      {statusIcon(selectedProject.status)} {statusLabel(selectedProject.status)}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider">Kunde</label>
                <p className="font-medium text-sm mt-0.5">{selectedProject.client_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Telefon</label>
                  <p className="font-medium text-sm mt-0.5">{selectedProject.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Datum</label>
                  <p className="font-medium text-sm mt-0.5">{new Date(selectedProject.created_at).toLocaleDateString('de-DE')}</p>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider">Adresse</label>
                <p className="font-medium text-sm mt-0.5">{selectedProject.address}</p>
              </div>
              {selectedProject.answers && (() => {
                const parsed = typeof selectedProject.answers === 'string'
                  ? JSON.parse(selectedProject.answers) : selectedProject.answers;
                const entries = Object.entries(parsed).filter(([, v]) => v);
                if (entries.length === 0) return null;
                return (
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Projektdetails</label>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      {entries.map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm gap-4">
                          <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü')}</span>
                          <span className="font-medium text-right">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
