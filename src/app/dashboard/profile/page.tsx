'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate password match
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwörter stimmen nicht überein' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Neues Passwort muss mindestens 6 Zeichen lang sein' });
      return;
    }

    if (newPassword && !currentPassword) {
      setMessage({ type: 'error', text: 'Bitte geben Sie Ihr aktuelles Passwort ein' });
      return;
    }

    setLoading(true);
    try {
      const body: any = { name, email, phone };
      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil erfolgreich aktualisiert' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        await refreshUser();
      } else {
        setMessage({ type: 'error', text: data.error || 'Fehler beim Aktualisieren' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Netzwerkfehler' });
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Profil bearbeiten</h1>
        <p className="text-gray-500 mt-1">Aktualisieren Sie Ihre persönlichen Daten</p>
      </div>

      {/* User Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-white/80 text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 border border-white/20">
                <Shield className="w-3 h-3" /> {user.role === 'admin' ? 'Administrator' : 'Benutzer'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 border border-white/20">
                {user.package_type?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-3 animate-fade-in-up ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" /> Persönliche Daten
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                placeholder="Ihr Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">E-Mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                placeholder="name@email.de"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                placeholder="+49 123 456 789"
              />
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-500" /> Passwort ändern
          </h3>
          <p className="text-sm text-gray-400 -mt-2">Lassen Sie die Felder leer, wenn Sie das Passwort nicht ändern möchten</p>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Aktuelles Passwort</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-11 pr-12 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Neues Passwort</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                className="w-full border border-gray-200 rounded-xl pl-11 pr-12 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                placeholder="Mindestens 6 Zeichen"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Passwort bestätigen</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-gray-50/50 transition-all hover:border-gray-300"
                placeholder="Passwort wiederholen"
              />
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1.5">Passwörter stimmen nicht überein</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" /> Änderungen speichern
            </>
          )}
        </button>
      </form>
    </div>
  );
}
