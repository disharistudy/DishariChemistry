'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { User, Save, GraduationCap, Building, Mail, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [academicLevel, setAcademicLevel] = useState<'ssc' | 'hsc' | 'honors'>('hsc');
  const [bio, setBio] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setFullName(data.user.full_name);
        setInstitution(data.user.institution || '');
        setAcademicLevel(data.user.academic_level || 'hsc');
        setBio(data.user.bio || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          profile: {
            full_name: fullName,
            institution,
            academic_level: academicLevel,
            bio,
          }
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return <div className="p-12 text-center text-slate-400 text-sm">প্রোফাইল লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          প্রোফাইল ও একাডেমিক সেটিংস
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          আপনার নাম, শিক্ষাপ্রতিষ্ঠান ও পছন্দের একাডেমিক শ্রেণি নির্বাচন করুন।
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar and Email (Read-only) */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-teal-700 flex items-center justify-center text-white text-2xl font-bold">
              {fullName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-base text-slate-900">{profile.email}</div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  রোল: {profile.role === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'শিক্ষার্থী'}
                </span>
                <span>সদস্য হয়েছেন: {new Date(profile.created_at).toLocaleDateString('bn-BD')}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাপ্রতিষ্ঠান (School / College / University):</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="যেমন: নটর ডেম কলেজ, ঢাকা বা ঢাকা বিশ্ববিদ্যালয়"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পছন্দের একাডেমিক স্তর:</label>
            <select
              value={academicLevel}
              onChange={(e) => setAcademicLevel(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="ssc">এসএসসি রসায়ন (নবম-দশম)</option>
              <option value="hsc">এইচএসসি রসায়ন ১ম ও ২য় পত্র (একাদশ-দ্বাদশ)</option>
              <option value="honors">অনার্স রসায়ন (স্নাতক স্তর)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">বায়ো / সংক্ষিপ্ত পরিচয়:</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="নিজের সম্পর্কে সংক্ষিপ্ত তথ্য..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
            />
          </div>

          {isSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              প্রোফাইল তথ্য সফলভাবে হালনাগাদ করা হয়েছে!
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
