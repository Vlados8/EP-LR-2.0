'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, ChevronRight, Lock, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  points: number;
  package_type: string;
  level: number;
  children: TeamMember[];
}

export default function TeamPage() {
  const { user } = useAuth();
  const [teamData, setTeamData] = useState<{ referrals: any[]; tree: TeamMember[]; totalTeam: number }>({
    referrals: [],
    tree: [],
    totalTeam: 0,
  });
  const isRestricted = user?.package_type === 'starter';

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(d => setTeamData(d));
  }, []);

  if (isRestricted) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-extrabold mb-8">Mein Team</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold mb-2">Zugriff eingeschränkt</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Upgraden Sie auf das Popular-Paket oder höher, um Ihre Teamstruktur zu sehen.
          </p>
          <Link href="/dashboard/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
            <Zap className="w-4 h-4" /> Upgrade <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Mein Team</h1>
        <p className="text-gray-500">Ihre Referral-Struktur — <span className="font-semibold text-indigo-600">{teamData.totalTeam}</span> Mitglieder gesamt</p>
      </div>

      {/* Direct referrals */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          Direkte Empfehlungen ({teamData.referrals.length})
        </h2>
        {teamData.referrals.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Noch keine direkten Empfehlungen</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamData.referrals.map((ref: any) => (
              <div key={ref.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-transparent hover:border-gray-200">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
                  {ref.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{ref.name}</p>
                  <p className="text-xs text-gray-400 truncate">{ref.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{ref.points} Pkt.</p>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{ref.package_type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team tree */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-5">Teamstruktur</h2>
        {teamData.tree.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm font-medium">Noch kein Team</p>
          </div>
        ) : (
          <div className="space-y-2">
            {teamData.tree.map((member) => (
              <TreeNode key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TreeNode({ member }: { member: TeamMember }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = member.children && member.children.length > 0;

  const levelColors: Record<number, string> = {
    1: 'border-l-indigo-400',
    2: 'border-l-blue-400',
    3: 'border-l-green-400',
  };

  return (
    <div className={`border-l-4 ${levelColors[member.level] || 'border-l-gray-200'} pl-4`}>
      <div
        className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-xl px-3 -ml-1 transition"
        onClick={() => setExpanded(!expanded)}
      >
        {hasChildren && (
          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
        )}
        <div className="w-9 h-9 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center text-sm font-bold text-gray-600">
          {member.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{member.name}</p>
          <p className="text-xs text-gray-400">Level {member.level}</p>
        </div>
        <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-lg font-medium">{member.package_type}</span>
        <span className="text-sm font-bold text-gray-700">{member.points} Pkt.</span>
      </div>
      {expanded && hasChildren && (
        <div className="ml-4 mt-1 space-y-1">
          {member.children.map((child) => (
            <TreeNode key={child.id} member={child} />
          ))}
        </div>
      )}
    </div>
  );
}
