'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Zap, Eye, EyeOff, UserPlus, CheckCircle, Loader2 } from 'lucide-react';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(refCode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await register(name, email, password, referralCode, phone);
    setLoading(false);

    if (result.success) {
      setSuccess('Registrierung erfolgreich! Warten Sie auf die Genehmigung durch den Administrator.');
    } else {
      setError(result.error || 'Ein Fehler ist aufgetreten');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative flex items-center justify-center px-4 pt-16 pb-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px] animate-float-delay" />
        </div>

        <div className="relative z-10 w-full max-w-md animate-scale-in">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-10 border border-white/50">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30 mb-5">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Konto erstellen</h1>
              <p className="text-gray-500 mt-1.5 text-sm">Treten Sie unserem Netzwerk bei</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-5 text-sm border border-red-100 animate-fade-in-up">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-5 text-sm border border-green-100 animate-fade-in-up flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                  placeholder="Ihr vollständiger Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">E-Mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                  placeholder="name@email.de"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                  placeholder="+49 123 456 789"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Passwort</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                    placeholder="Mindestens 6 Zeichen"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Empfehlungscode <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                  placeholder="EP-XXXXX"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Registrieren
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-gray-400 font-medium">oder</span></div>
            </div>

            <p className="text-center text-gray-500 text-sm">
              Bereits ein Konto?{' '}
              <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                Anmelden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
