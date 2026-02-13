'use client';

import { useAuth } from '@/context/AuthContext';
import { Copy, Check, Share2, Link, Gift, UserPlus, Coins } from 'lucide-react';
import { useState } from 'react';

export default function ReferralPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${user?.referral_code}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Empfehlungslink</h1>
        <p className="text-gray-500">Teilen Sie Ihren Link und verdienen Sie Punkte</p>
      </div>

      {/* Referral link display */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Link className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Ihr Empfehlungscode</h2>
            <p className="text-indigo-600 font-mono text-xl font-bold tracking-wider">{user?.referral_code}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none font-mono"
          />
          <button
            onClick={copyLink}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              copied
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Kopiert!' : 'Kopieren'}
          </button>
        </div>

        <div className="flex gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Werde Teil des EP-Teams! ${referralLink}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-all text-sm font-semibold hover:shadow-lg hover:shadow-green-500/20"
          >
            <Share2 className="w-4 h-4" /> WhatsApp
          </a>
          <a
            href={`mailto:?subject=EP Einladung&body=${encodeURIComponent(`Werde Teil des EP-Teams! ${referralLink}`)}`}
            className="flex items-center gap-2 bg-gray-700 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all text-sm font-semibold"
          >
            <Share2 className="w-4 h-4" /> E-Mail
          </a>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="text-lg font-bold mb-8">So funktioniert es</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Teilen', desc: 'Senden Sie Ihren Link an Freunde und Bekannte.', icon: Gift, gradient: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-500/20' },
            { step: '2', title: 'Registrierung', desc: 'Ihre Empfehlungen registrieren sich über den Link.', icon: UserPlus, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-500/20' },
            { step: '3', title: 'Verdienen', desc: 'Erhalten Sie Punkte für jedes genehmigte Projekt.', icon: Coins, gradient: 'from-yellow-400 to-orange-500', shadow: 'shadow-yellow-500/20' },
          ].map(({ step, title, desc, icon: Icon, gradient, shadow }, i) => (
            <div key={step} className={`text-center animate-fade-in-up stagger-${i + 1}`}>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-4 shadow-lg ${shadow}`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs font-bold text-indigo-600 bg-indigo-50 w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-3">{step}</div>
              <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
