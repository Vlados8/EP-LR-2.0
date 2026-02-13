'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Gift, BarChart3, HeadphonesIcon, Users, TrendingUp, Shield, CheckCircle, ArrowRight } from 'lucide-react';

export default function PartnerPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white py-24">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-8">
            <Users className="w-4 h-4" />
            Partnerprogramm
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Werden Sie unser
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Energie-Partner
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Profitieren Sie von hohen Provisionen, transparenter Analytik und erstklassigem Support.
            Bauen Sie Ihr Team auf und verdienen Sie an jedem Projekt.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-xl"
          >
            Partner werden <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ihre Vorteile als Partner</h2>
            <p className="text-gray-500 text-lg">Drei Säulen unseres Partnerprogramms</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Gift,
                title: 'Hohe Boni',
                desc: 'Erhalten Sie Provisionen auf bis zu 3 Ebenen Ihrer Teamstruktur. Bis zu x2 Multiplikator mit dem Premium-Paket.',
                color: 'text-yellow-600 bg-yellow-100',
              },
              {
                icon: BarChart3,
                title: 'Transparente Analytik',
                desc: 'Verfolgen Sie Ihre Einnahmen, Teamstruktur und Projektstatistiken in Echtzeit über Ihr Dashboard.',
                color: 'text-blue-600 bg-blue-100',
              },
              {
                icon: HeadphonesIcon,
                title: 'Persönlicher Support',
                desc: 'Unser Team steht Ihnen bei Fragen und Herausforderungen jederzeit zur Seite. Prioritäts-Support für Business & Premium.',
                color: 'text-green-600 bg-green-100',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} mb-6`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">So funktioniert es</h2>
          </div>

          <div className="space-y-8">
            {[
              { step: '01', title: 'Registrieren', desc: 'Erstellen Sie ein kostenloses Konto und wählen Sie Ihr Paket.' },
              { step: '02', title: 'Team aufbauen', desc: 'Teilen Sie Ihren Empfehlungslink und laden Sie Partner ein.' },
              { step: '03', title: 'Projekte einreichen', desc: 'Reichen Sie Photovoltaik- oder Wärmepumpen-Projekte ein.' },
              { step: '04', title: 'Verdienen', desc: 'Erhalten Sie Punkte für eigene und Team-Projekte nach Genehmigung.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shrink-0">
                  {step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{title}</h3>
                  <p className="text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus levels */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bonusstruktur</h2>
            <p className="text-gray-500 text-lg">Verdienen Sie auf mehreren Ebenen</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="text-left px-6 py-4">Ebene</th>
                  <th className="text-left px-6 py-4">Bonus</th>
                  <th className="text-left px-6 py-4">Beschreibung</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-semibold">Level 0</td>
                  <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">100 Punkte</span></td>
                  <td className="px-6 py-4 text-gray-500">Eigenes genehmigtes Projekt</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-semibold">Level 1</td>
                  <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">20%</span></td>
                  <td className="px-6 py-4 text-gray-500">Direkte Empfehlung</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-semibold">Level 2</td>
                  <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">10%</span></td>
                  <td className="px-6 py-4 text-gray-500">Zweite Ebene</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold">Level 3</td>
                  <td className="px-6 py-4"><span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">5%</span></td>
                  <td className="px-6 py-4 text-gray-500">Dritte Ebene</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            * Business-Paket: +50% auf Referral-Boni | Premium-Paket: x2 auf Referral-Boni
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Bereit durchzustarten?</h2>
          <p className="text-xl text-indigo-200 mb-10">
            Schließen Sie sich unserem wachsenden Netzwerk an und profitieren Sie von nachhaltiger Energie.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition shadow-xl"
          >
            Jetzt kostenlos registrieren <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
