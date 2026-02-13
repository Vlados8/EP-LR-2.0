import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText } from 'lucide-react';

const sections = [
  {
    title: '§ 1 Geltungsbereich',
    content: 'Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Geschäftsbeziehungen zwischen der EP Energy Platform GmbH (nachfolgend „Anbieter") und dem Nutzer (nachfolgend „Kunde") in ihrer zum Zeitpunkt der Registrierung gültigen Fassung.',
  },
  {
    title: '§ 2 Registrierung und Vertragsschluss',
    content: `(1) Die Nutzung der Plattform setzt eine Registrierung voraus. Mit der Registrierung gibt der Kunde ein Angebot zum Abschluss eines Nutzungsvertrages ab.\n\n(2) Der Anbieter bestätigt den Eingang der Registrierung per E-Mail. Die Freischaltung des Kontos erfolgt nach Prüfung und Genehmigung durch den Administrator.\n\n(3) Der Kunde ist verpflichtet, bei der Registrierung wahrheitsgemäße und vollständige Angaben zu machen und diese aktuell zu halten.\n\n(4) Der Kunde ist für die Geheimhaltung seiner Zugangsdaten selbst verantwortlich.`,
  },
  {
    title: '§ 3 Leistungspakete',
    content: `(1) Der Anbieter bietet verschiedene Leistungspakete an:\n\n• Starter – Kostenloser Basiszugang\n• Popular – Erweiterter Zugang (€49)\n• Business – Professionelle Funktionen (€99)\n• Premium – Vollumfänglicher Zugang (€199)\n\n(2) Die Inhalte und Preise der jeweiligen Pakete ergeben sich aus der aktuellen Beschreibung auf der Website.\n\n(3) Ein Upgrade auf ein höherwertiges Paket ist jederzeit möglich. Ein Downgrade ist ausgeschlossen.`,
  },
  {
    title: '§ 4 Zahlungsbedingungen',
    content: `(1) Die Zahlung für Leistungspakete erfolgt per Banküberweisung auf das in der Bestellung angegebene Konto.\n\n(2) Die Freischaltung des Pakets erfolgt nach Eingang der Zahlung und Bestätigung durch den Administrator.\n\n(3) Alle genannten Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.`,
  },
  {
    title: '§ 5 Punktesystem und Auszahlungen',
    content: `(1) Registrierte Nutzer können über das Referral-System und durch das Einreichen von Projekten Punkte sammeln.\n\n(2) Punkte haben einen Wert von 1 Punkt = 1,00 € und können zur Auszahlung beantragt werden.\n\n(3) Auszahlungen erfolgen nach Antragstellung und Genehmigung durch den Administrator auf die vom Kunden angegebene Bankverbindung (IBAN).\n\n(4) Der Anbieter behält sich das Recht vor, Auszahlungsanträge zu prüfen und bei begründetem Verdacht auf Missbrauch abzulehnen.\n\n(5) Ein Anspruch auf Auszahlung besteht erst nach erfolgter Genehmigung.`,
  },
  {
    title: '§ 6 Referral-Programm',
    content: `(1) Jeder registrierte Nutzer erhält einen individuellen Referral-Code, mit dem er neue Teilnehmer werben kann.\n\n(2) Bei erfolgreicher Vermittlung erhält der Werbende Bonuspunkte gemäß dem aktuellen Bonusplan auf bis zu 3 Ebenen.\n\n(3) Eine Manipulation des Referral-Systems (z.B. Selbstreferrals oder Fake-Accounts) führt zum sofortigen Ausschluss und Verlust aller Punkte.`,
  },
  {
    title: '§ 7 Pflichten des Kunden',
    content: `(1) Der Kunde verpflichtet sich, die Plattform nur für die vorgesehenen Zwecke zu nutzen.\n\n(2) Es ist untersagt:\n• Falsche oder irreführende Angaben zu machen\n• Das System oder andere Nutzer zu manipulieren\n• Inhalte zu veröffentlichen, die gegen geltendes Recht verstoßen\n• Automatisierte Zugriffe auf die Plattform durchzuführen\n\n(3) Bei Verstößen ist der Anbieter berechtigt, das Konto des Kunden vorübergehend oder dauerhaft zu sperren.`,
  },
  {
    title: '§ 8 Haftungsbeschränkung',
    content: `(1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit.\n\n(2) Für leichte Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten, begrenzt auf den vertragstypischen, vorhersehbaren Schaden.\n\n(3) Die Haftung für mittelbare Schäden und entgangenen Gewinn ist ausgeschlossen.`,
  },
  {
    title: '§ 9 Kündigung',
    content: `(1) Der Kunde kann sein Konto jederzeit durch Kontaktaufnahme mit dem Support kündigen.\n\n(2) Der Anbieter ist berechtigt, den Nutzungsvertrag mit einer Frist von 14 Tagen zu kündigen.\n\n(3) Bei schwerwiegenden Vertragsverstößen ist eine fristlose Kündigung durch den Anbieter möglich.\n\n(4) Mit Beendigung des Vertrages verfallen nicht ausgezahlte Punkte, sofern kein genehmigter Auszahlungsantrag vorliegt.`,
  },
  {
    title: '§ 10 Schlussbestimmungen',
    content: `(1) Es gilt das Recht der Bundesrepublik Deutschland.\n\n(2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.\n\n(3) Gerichtsstand ist der Sitz des Anbieters, soweit der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.\n\nStand: Februar 2026`,
  },
];

export default function AGBPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
        {/* Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/30 mb-8">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Allgemeine Geschäftsbedingungen
            </h1>
            <p className="text-lg text-gray-400">AGB der EP Energy Platform GmbH</p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="space-y-6">
            {sections.map((section, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
