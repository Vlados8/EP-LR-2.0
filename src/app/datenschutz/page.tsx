'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck } from 'lucide-react';

function buildSections(s: Record<string, string>) {
  const companyName = s.company_name || 'EP Energy Platform GmbH';
  const companyAddress = s.company_address || 'Musterstraße 123';
  const companyZip = s.company_zip || '12345';
  const companyCity = s.company_city || 'Musterstadt';
  const companyCountry = s.company_country || 'Deutschland';
  const contactEmail = s.contact_email || 'info@energy-platform.de';

  return [
  {
    title: '1. Datenschutz auf einen Blick',
    content: `Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.`,
  },
  {
    title: '2. Allgemeine Hinweise und Pflichtinformationen',
    subsections: [
      {
        subtitle: 'Datenschutz',
        text: 'Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.',
      },
      {
        subtitle: 'Verantwortliche Stelle',
        text: `Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:\n\n${companyName}\n${companyAddress}\n${companyZip} ${companyCity}\n${companyCountry}\n\nE-Mail: ${contactEmail}`,
      },
      {
        subtitle: 'Widerruf Ihrer Einwilligung zur Datenverarbeitung',
        text: 'Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.',
      },
    ],
  },
  {
    title: '3. Datenerfassung auf dieser Website',
    subsections: [
      {
        subtitle: 'Cookies',
        text: 'Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. Wir verwenden ausschließlich technisch notwendige Cookies (z.B. Authentifizierungstoken), die für den Betrieb der Seite erforderlich sind.',
      },
      {
        subtitle: 'Registrierung auf dieser Website',
        text: 'Sie können sich auf unserer Website registrieren, um zusätzliche Funktionen auf der Seite zu nutzen. Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes, für das Sie sich registriert haben. Die bei der Registrierung abgefragten Pflichtangaben müssen vollständig angegeben werden. Anderenfalls werden wir die Registrierung ablehnen.',
      },
      {
        subtitle: 'Kontaktformular',
        text: 'Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.',
      },
    ],
  },
  {
    title: '4. Speicherung und Verarbeitung',
    subsections: [
      {
        subtitle: 'Welche Daten speichern wir?',
        text: '• Name und E-Mail-Adresse bei der Registrierung\n• Referral-Code und Sponsor-Zuordnung\n• Projektdaten (Kundenname, Kontaktdaten, Serviceart)\n• Bestellungen und Paketinformationen\n• Punktetransaktionen und Auszahlungsanträge (inkl. IBAN)',
      },
      {
        subtitle: 'Wie lange speichern wir Ihre Daten?',
        text: 'Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Erfüllung des Zwecks erforderlich ist oder gesetzliche Aufbewahrungsfristen es verlangen. Nach Ablauf dieser Fristen werden die Daten routinemäßig gelöscht.',
      },
    ],
  },
  {
    title: '5. Ihre Rechte',
    content: `Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.\n\nIhre Rechte im Einzelnen:\n• Recht auf Auskunft (Art. 15 DSGVO)\n• Recht auf Berichtigung (Art. 16 DSGVO)\n• Recht auf Löschung (Art. 17 DSGVO)\n• Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)\n• Recht auf Datenübertragbarkeit (Art. 20 DSGVO)\n• Recht auf Widerspruch (Art. 21 DSGVO)`,
  },
  {
    title: '6. SSL-/TLS-Verschlüsselung',
    content: 'Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die SSL-/TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.',
  },
  ];
}

export default function DatenschutzPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { setSettings(d.settings || {}); setLoaded(true); }).catch(() => setLoaded(true));
  }, []);

  const sections = buildSections(settings);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
        {/* Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/30 mb-8">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Datenschutzerklärung</h1>
            <p className="text-lg text-gray-400">Schutz Ihrer persönlichen Daten hat für uns höchste Priorität</p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="space-y-6">
            {sections.map((section, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                {section.content && (
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
                )}
                {section.subsections && (
                  <div className="space-y-5">
                    {section.subsections.map((sub, j) => (
                      <div key={j}>
                        <h3 className="text-white font-semibold text-sm mb-2">{sub.subtitle}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{sub.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
