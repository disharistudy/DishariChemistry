'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FlaskConical, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [academicLevel, setAcademicLevel] = useState<'ssc' | 'hsc' | 'honors'>('hsc');
  const [institution, setInstitution] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          profile: {
            full_name: fullName,
            email,
            academic_level: academicLevel,
            institution,
            role: 'student',
          }
        }),
      });

      if (res.ok) {
        router.push('/my-learning');
        router.refresh();
      } else {
        setError('নিবন্ধন সম্পন্ন করা যায়নি। পুনরায় চেষ্টা করুন।');
      }
    } catch (e) {
      setError('সার্ভারে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-teal-900 p-8 text-white text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-teal-300 mb-2">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">নতুন শিক্ষার্থী নিবন্ধন</h2>
          <p className="text-xs text-teal-200">
            দিশারী কেমিস্ট্রি প্ল্যাটফর্মে যুক্ত হয়ে নিজের মেধা বিকাশ করুন
          </p>
        </div>

        <div className="p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="যেমন: সামিয়া ইসলাম"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="samia@example.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">একাডেমিক স্তর:</label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="ssc">এসএসসি রসায়ন (নবম-দশম)</option>
                <option value="hsc">এইচএসসি রসায়ন ১ম ও ২য় পত্র</option>
                <option value="honors">অনার্স রসায়ন (স্নাতক স্তর)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাপ্রতিষ্ঠান:</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="যেমন: মতিঝিল আইডিয়াল স্কুল বা রাজউক উত্তরা মডেল কলেজ"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? 'নিবন্ধন হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            পূর্বেই অ্যাকাউন্ট রয়েছে?{' '}
            <Link href="/login" className="font-bold text-teal-700 hover:underline">
              লগইন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
