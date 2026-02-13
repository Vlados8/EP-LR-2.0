'use client';

import { useEffect, useState } from 'react';
import {
  Settings,
  Building2,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Save,
  CheckCircle,
  Loader2,
  MapPin,
  User,
  Clock,
  FileText,
} from 'lucide-react';

interface SettingsGroup {
  title: string;
  icon: any;
  color: string;
  fields: { key: string; label: string; type?: string; placeholder?: string }[];
}

const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    title: 'Firmendaten',
    icon: Building2,
    color: 'from-indigo-500 to-purple-600',
    fields: [
      { key: 'company_name', label: 'Firmenname', placeholder: 'EP Energy Platform GmbH' },
      { key: 'company_address', label: 'Adresse', placeholder: 'Musterstraße 123' },
      { key: 'company_zip', label: 'PLZ', placeholder: '12345' },
      { key: 'company_city', label: 'Stadt', placeholder: 'Musterstadt' },
      { key: 'company_country', label: 'Land', placeholder: 'Deutschland' },
      { key: 'company_ceo', label: 'Geschäftsführer', placeholder: 'Max Mustermann' },
      { key: 'company_register', label: 'Handelsregister', placeholder: 'AG Musterstadt, HRB 123456' },
      { key: 'company_vat', label: 'USt-IdNr.', placeholder: 'DE123456789' },
    ],
  },
  {
    title: 'Kontaktdaten',
    icon: Phone,
    color: 'from-green-500 to-emerald-600',
    fields: [
      { key: 'contact_email', label: 'E-Mail', type: 'email', placeholder: 'info@example.de' },
      { key: 'contact_phone', label: 'Telefon', placeholder: '+49 123 456 789' },
      { key: 'contact_website', label: 'Website', placeholder: 'www.example.de' },
      { key: 'support_hours', label: 'Servicezeiten', placeholder: 'Mo – Fr, 9:00 – 17:00 Uhr' },
    ],
  },
  {
    title: 'Bankverbindung',
    icon: CreditCard,
    color: 'from-amber-500 to-orange-600',
    fields: [
      { key: 'bank_recipient', label: 'Empfänger', placeholder: 'EP Energy Platform GmbH' },
      { key: 'bank_iban', label: 'IBAN', placeholder: 'DE89 3704 0044 0532 0130 00' },
      { key: 'bank_bic', label: 'BIC', placeholder: 'COBADEFFXXX' },
      { key: 'bank_name', label: 'Bank', placeholder: 'Commerzbank' },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/settings');
    if (res.ok) {
      const data = await res.json();
      setSettings(data.settings || {});
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Einstellungen</h1>
          <p className="text-gray-500 text-sm">Firmen-, Kontakt- und Bankdaten verwalten</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
            saved
              ? 'bg-green-600 text-white shadow-green-500/20'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
          } disabled:opacity-50`}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Speichern...' : saved ? 'Gespeichert!' : 'Speichern'}
        </button>
      </div>

      <div className="space-y-8">
        {SETTINGS_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div key={group.title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Group Header */}
              <div className={`bg-gradient-to-r ${group.color} px-6 py-4 flex items-center gap-3`}>
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <GroupIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">{group.title}</h2>
              </div>

              {/* Fields */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {group.fields.map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                        {field.label}
                      </label>
                      <input
                        type={field.type || 'text'}
                        value={settings[field.key] || ''}
                        onChange={(e) => updateSetting(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none hover:border-gray-300 transition bg-gray-50/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Save */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
            saved
              ? 'bg-green-600 text-white shadow-green-500/20'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
          } disabled:opacity-50`}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Speichern...' : saved ? 'Gespeichert!' : 'Alle Einstellungen speichern'}
        </button>
      </div>
    </div>
  );
}
