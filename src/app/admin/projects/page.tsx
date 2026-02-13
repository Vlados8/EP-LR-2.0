'use client';

import { useEffect, useState } from 'react';
import { FolderOpen, Search, Sun, Wind, CheckCircle, XCircle, Clock, Eye, Globe, UserCircle, X, MapPin, Phone, Mail, Calendar, User, FileText, Hash } from 'lucide-react';

const ANSWER_LABELS: Record<string, string> = {
  dachflaeche: 'Dachfläche',
  stromverbrauch: 'Stromverbrauch',
  dachausrichtung: 'Dachausrichtung',
  batteriespeicher: 'Batteriespeicher',
  batterie_kwh: 'Batterie kWh',
  eauto: 'E-Auto',
  wallbox: 'Wallbox',
  gebaeudetyp: 'Gebäudetyp',
  baujahr: 'Baujahr',
  waermepumpentyp: 'Wärmepumpentyp',
  warmwasser: 'Warmwasser',
  heizflaeche: 'Heizfläche',
  building_type: 'Gebäudetyp',
  building_year: 'Baujahr',
  heat_pump_type: 'Wärmepumpentyp',
  hot_water: 'Warmwasser',
  heating_area: 'Heizfläche',
  roof_area: 'Dachfläche',
  power_consumption: 'Stromverbrauch',
  roof_orientation: 'Dachausrichtung',
  battery: 'Batteriespeicher',
  battery_kwh: 'Batterie kWh',
  e_auto: 'E-Auto',
  notes: 'Notizen',
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('status', filter);
    if (typeFilter !== 'all') params.set('type', typeFilter);
    if (search) params.set('search', search);

    const res = await fetch(`/api/admin/projects?${params}`);
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [filter, typeFilter]);

  const handleAction = async (id: number, status: 'approved' | 'rejected') => {
    await fetch(`/api/admin/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setSelectedProject(null);
    fetchProjects();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Projektverwaltung</h1>
        <p className="text-gray-500">Projekte prüfen und genehmigen</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Alle' },
            { key: 'pending', label: 'Ausstehend' },
            { key: 'approved', label: 'Genehmigt' },
            { key: 'rejected', label: 'Abgelehnt' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Alle Typen' },
            { key: 'PV', label: 'Photovoltaik' },
            { key: 'WP', label: 'Wärmepumpe' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                typeFilter === key ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <form onSubmit={(e) => { e.preventDefault(); fetchProjects(); }} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche nach Kunde, Ersteller (Name, E-Mail, ID)..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
            Suchen
          </button>
        </form>
      </div>

      {/* Projects table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Keine Projekte gefunden</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Typ</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Quelle</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Kunde</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Ersteller</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Adresse</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Datum</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p: any) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition" onClick={() => setSelectedProject(p)}>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2">
                          {p.service_type === 'PV' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Wind className="w-4 h-4 text-blue-500" />}
                          {p.service_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.source === 'website' ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                            <Globe className="w-3 h-3" /> Webseite
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-700">
                            <UserCircle className="w-3 h-3" /> Partner
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium">{p.client_name}</p>
                          <p className="text-xs text-gray-400">{p.phone}</p>
                          {p.email && <p className="text-xs text-gray-400">{p.email}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {p.user_name ? (
                          <><p>{p.user_name}</p><p className="text-xs text-gray-400">{p.user_email}</p><p className="text-xs text-gray-300 font-mono">ID: {p.user_id}</p></>
                        ) : (
                          <span className="text-gray-400 italic text-xs">– Webseite –</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.address}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                          p.status === 'approved' ? 'bg-green-100 text-green-700' :
                          p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {p.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                          p.status === 'rejected' ? <XCircle className="w-3 h-3" /> :
                          <Clock className="w-3 h-3" />}
                          {p.status === 'approved' ? 'Genehmigt' : p.status === 'rejected' ? 'Abgelehnt' : 'Ausstehend'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(p.created_at).toLocaleDateString('de-DE')}
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProject(p)}
                            className="text-gray-400 hover:text-indigo-600 p-1"
                            title="Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {p.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAction(p.id, 'approved')}
                                className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-600 transition"
                              >
                                Genehmigen
                              </button>
                              <button
                                onClick={() => handleAction(p.id, 'rejected')}
                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-600 transition"
                              >
                                Ablehnen
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {projects.map((p: any) => (
                <div key={p.id} className="p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition" onClick={() => setSelectedProject(p)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {p.service_type === 'PV' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Wind className="w-5 h-5 text-blue-500" />}
                      <div>
                        <p className="font-medium text-sm">{p.client_name}</p>
                        <p className="text-xs text-gray-400">{p.phone}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                      p.status === 'approved' ? 'bg-green-100 text-green-700' :
                      p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                      p.status === 'rejected' ? <XCircle className="w-3 h-3" /> :
                      <Clock className="w-3 h-3" />}
                      {p.status === 'approved' ? 'Genehmigt' : p.status === 'rejected' ? 'Abgelehnt' : 'Ausstehend'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p className="truncate">{p.address}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {p.source === 'website' ? (
                        <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700"><Globe className="w-3 h-3" /> Web</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700"><UserCircle className="w-3 h-3" /> {p.user_name || 'Partner'}</span>
                      )}
                      <span className="text-gray-400">· {new Date(p.created_at).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProject(p)}
                      className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-gray-100"
                      title="Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {p.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(p.id, 'approved')}
                          className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-600 transition"
                        >
                          Genehmigen
                        </button>
                        <button
                          onClick={() => handleAction(p.id, 'rejected')}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-600 transition"
                        >
                          Ablehnen
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Project detail modal */}
      {selectedProject && (() => {
        const isPV = selectedProject.service_type === 'PV';
        const gradient = isPV ? 'from-yellow-500 to-orange-600' : 'from-blue-500 to-cyan-600';
        let answers: Record<string, any> = {};
        try {
          answers = typeof selectedProject.answers === 'string' ? JSON.parse(selectedProject.answers) : (selectedProject.answers || {});
        } catch { answers = {}; }

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProject(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${gradient} p-6 rounded-t-2xl relative`}>
                <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 text-white/80 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    {isPV ? <Sun className="w-6 h-6 text-white" /> : <Wind className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Projekttyp</p>
                    <h2 className="text-xl font-bold text-white">{isPV ? 'Photovoltaik' : 'Wärmepumpe'}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    selectedProject.status === 'approved' ? 'bg-green-400/20 text-green-100 border-green-300/30' :
                    selectedProject.status === 'rejected' ? 'bg-red-400/20 text-red-100 border-red-300/30' :
                    'bg-yellow-400/20 text-yellow-100 border-yellow-300/30'
                  }`}>
                    {selectedProject.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> :
                     selectedProject.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> :
                     <Clock className="w-3.5 h-3.5" />}
                    {selectedProject.status === 'approved' ? 'Genehmigt' : selectedProject.status === 'rejected' ? 'Abgelehnt' : 'Ausstehend'}
                  </span>
                  {selectedProject.source === 'website' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/20">
                      <Globe className="w-3.5 h-3.5" /> Webseite
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/20">
                      <UserCircle className="w-3.5 h-3.5" /> Partner
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Client Info */}
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Kundendaten</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400">Kunde</p>
                        <p className="text-sm font-medium">{selectedProject.client_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400">Telefon</p>
                        <p className="text-sm font-medium">{selectedProject.phone}</p>
                      </div>
                    </div>
                    {selectedProject.email && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400">E-Mail</p>
                          <p className="text-sm font-medium truncate">{selectedProject.email}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400">Adresse</p>
                        <p className="text-sm font-medium">{selectedProject.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    {selectedProject.source === 'website' ? <Globe className="w-4 h-4 text-blue-600" /> : <UserCircle className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Ersteller</p>
                    <p className="text-sm font-medium">{selectedProject.source === 'website' ? 'Webseite (Konfigurator)' : `${selectedProject.user_name} (${selectedProject.user_email})`}</p>
                    {selectedProject.user_id && (
                      <p className="text-xs text-gray-400 font-mono mt-0.5">User-ID: {selectedProject.user_id}</p>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Erstellt am</p>
                    <p className="text-sm font-medium">{new Date(selectedProject.created_at).toLocaleString('de-DE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                {/* Answers */}
                {Object.keys(answers).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Konfigurator-Antworten</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl overflow-hidden divide-y divide-gray-100">
                      {Object.entries(answers).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center px-4 py-2.5">
                          <span className="text-sm text-gray-500">{ANSWER_LABELS[key] || key}</span>
                          <span className="text-sm font-medium text-gray-800">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedProject.status === 'pending' && (
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => handleAction(selectedProject.id, 'approved')}
                      className="flex-1 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Genehmigen
                    </button>
                    <button
                      onClick={() => handleAction(selectedProject.id, 'rejected')}
                      className="flex-1 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition text-sm flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Ablehnen
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
