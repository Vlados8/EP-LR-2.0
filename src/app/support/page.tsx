'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Headphones,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  CheckCircle,
  Loader2,
  Zap,
} from 'lucide-react';

const faqs = [
  {
    q: 'Wie kann ich mich registrieren?',
    a: 'Klicken Sie oben rechts auf „Registrieren", füllen Sie das Formular aus und warten Sie auf die Genehmigung durch den Administrator.',
  },
  {
    q: 'Was ist das Referral-System?',
    a: 'Jeder Benutzer erhält einen eindeutigen Referral-Code. Wenn sich jemand mit Ihrem Code registriert, profitieren Sie von Bonuspunkten auf bis zu 3 Ebenen.',
  },
  {
    q: 'Wie kann ich meine Punkte auszahlen?',
    a: 'Gehen Sie in Ihrem Dashboard auf „Punkte" und klicken Sie auf „Punkte auszahlen". Füllen Sie das Formular mit Ihren Bankdaten (IBAN) aus.',
  },
  {
    q: 'Welche Pakete gibt es?',
    a: 'Wir bieten vier Pakete an: Starter (kostenlos), Popular (€49), Business (€99) und Premium (€199). Jedes Paket bietet unterschiedliche Boni und Funktionen.',
  },
  {
    q: 'Wie lange dauert die Genehmigung?',
    a: 'Die Genehmigung erfolgt in der Regel innerhalb von 24–48 Stunden nach der Registrierung.',
  },
  {
    q: 'Kann ich mein Paket upgraden?',
    a: 'Ja, Sie können Ihr Paket jederzeit im Dashboard upgraden. Die Differenz wird bei der nächsten Bestellung berechnet.',
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.settings || {}));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSent(false), 4000);
      }
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 -right-40 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30 mb-8">
              <Headphones className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Wie können wir <span className="gradient-text">helfen?</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Unser Team steht Ihnen bei Fragen und Anliegen jederzeit zur Verfügung.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="relative max-w-6xl mx-auto px-4 -mt-4 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Mail, title: 'E-Mail', desc: settings.contact_email || 'info@energy-platform.de', sub: 'Antwort innerhalb 24h', color: 'from-blue-500 to-cyan-500' },
              { icon: Phone, title: 'Telefon', desc: settings.contact_phone || '+49 123 456 789', sub: settings.support_hours || 'Mo–Fr, 9:00–17:00 Uhr', color: 'from-green-500 to-emerald-500' },
              { icon: Clock, title: 'Servicezeiten', desc: settings.support_hours ? settings.support_hours.split(',')[0] : 'Mo – Fr', sub: settings.support_hours ? settings.support_hours.split(',').slice(1).join(',').trim() || '9:00 – 17:00 Uhr' : '9:00 – 17:00 Uhr', color: 'from-purple-500 to-pink-500' },
            ].map(({ icon: Icon, title, desc, sub, color }) => (
              <div key={title} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all hover:-translate-y-1 group">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${color} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                <p className="text-gray-300 font-medium">{desc}</p>
                <p className="text-gray-500 text-sm mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ + Contact Form */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* FAQ */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Häufige Fragen</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden transition-all hover:border-white/20"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left text-white font-medium text-sm"
                    >
                      <span>{f.q}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="px-5 pb-4 text-sm text-gray-400 leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-white">Nachricht senden</h2>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Nachricht gesendet!</h3>
                    <p className="text-gray-400 text-sm">Wir werden uns so schnell wie möglich bei Ihnen melden.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">Name</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Ihr Name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">E-Mail</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="name@email.de"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">Betreff</label>
                      <input
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Worum geht es?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">Nachricht</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Ihre Nachricht..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {sending ? 'Wird gesendet...' : 'Nachricht senden'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
