'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile } from '@/lib/types';
import { Users, ShieldCheck, ChevronLeft, Search, CheckCircle2, UserPlus } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.institution && u.institution.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link href="/admin" className="hover:text-amber-800 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> অ্যাডমিন ড্যাশবোর্ড
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">ব্যবহারকারী ও রোল ম্যানেজমেন্ট</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ব্যবহারকারী ও রোল পারমিশন ব্যবস্থাপনা
        </h1>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="নাম, ইমেইল বা প্রতিষ্ঠান দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 text-sm focus:outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            নিবন্ধিত ইউজার তালিকা ({filteredUsers.length} জন)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-4">ব্যবহারকারী</th>
                <th className="p-4">একাডেমিক স্তর</th>
                <th className="p-4">প্রতিষ্ঠান</th>
                <th className="p-4">নিবন্ধন তারিখ</th>
                <th className="p-4">বর্তমান রোল</th>
                <th className="p-4 text-right">অনুমতি পরিবর্তন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                      {u.full_name.charAt(0)}
                    </div>
                    <div>
                      <div>{u.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{u.email}</div>
                    </div>
                  </td>
                  <td className="p-4 uppercase font-bold text-teal-800">
                    {u.academic_level}
                  </td>
                  <td className="p-4 text-slate-500">
                    {u.institution || '—'}
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(u.created_at).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role === 'admin' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={u.role}
                      disabled={updatingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                    >
                      <option value="student">শিক্ষার্থী (Student)</option>
                      <option value="editor">এডিটর (Editor)</option>
                      <option value="admin">অ্যাডমিন (Admin)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
