'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Zap, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Ein Fehler ist aufgetreten');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative flex items-center justify-center px-4 pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/3 -right-40 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] animate-float-delay" />
        </div>

        <div className="relative z-10 w-full max-w-md animate-scale-in">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-10 border border-white/50">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30 mb-5">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Willkommen zurück</h1>
              <p className="text-gray-500 mt-1.5 text-sm">Melden Sie sich bei Ihrem Konto an</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 animate-fade-in-up">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Passwort</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                    placeholder="Ihr Passwort"
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Anmelden <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-gray-400 font-medium">oder</span></div>
            </div>

            <p className="text-center text-gray-500 text-sm">
              Noch kein Konto?{' '}
              <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                Registrieren
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
