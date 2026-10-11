'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FlaskConical, ArrowRight, ShieldCheck, UserCheck, AlertCircle, Eye, EyeOff, Lock, X } from 'lucide-react';

import { useFirebase } from '@/components/FirebaseProvider';

export default function LoginPage() {
  const router = useRouter();
  const { user: fbUser, signInWithGoogle, firestoreConnected } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Admin Modal State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminModalPassword, setAdminModalPassword] = useState('');
  const [showAdminModalPassword, setShowAdminModalPassword] = useState(false);
  const [adminModalError, setAdminModalError] = useState('');
  const [isAdminVerifying, setIsAdminVerifying] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const profile = await signInWithGoogle();
      if (profile) {
        router.push(profile.role === 'admin' ? '/admin' : '/my-learning');
        router.refresh();
      }
    } catch (e: any) {
      setError(e?.message || 'গুগল লগইন সম্পন্ন করা যায়নি।');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDemoLogin = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch', userId }),
      });
      if (res.ok) {
        router.push('/my-learning');
        router.refresh();
      }
    } catch (e) {
      setError('লগইন ব্যর্থ হয়েছে।');
    }
  };

  const handleAdminVerifyAndLogin = async (pwdToVerify: string) => {
    try {
      const res = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwdToVerify }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('dishari_admin_auth', 'verified');
        router.push('/admin');
        router.refresh();
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  const handleAdminModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminModalError('');
    if (!adminModalPassword.trim()) {
      setAdminModalError('অ্যাডমিন পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setIsAdminVerifying(true);
    const success = await handleAdminVerifyAndLogin(adminModalPassword);
    setIsAdminVerifying(false);

    if (!success) {
      setAdminModalError('ভুল পাসওয়ার্ড! সঠিক অ্যাডমিন পাসওয়ার্ড প্রদান করুন।');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('ইমেইল প্রদান করুন।');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const isAdminEmail = trimmedEmail === 'disharistudy@gmail.com' || trimmedEmail.includes('admin');

    if (isAdminEmail) {
      if (!password) {
        setError('অ্যাডমিন অ্যাকাউন্টে প্রবেশ করতে পাসওয়ার্ড প্রয়োজন।');
        return;
      }
      const success = await handleAdminVerifyAndLogin(password);
      if (!success) {
        setError('ভুল পাসওয়ার্ড! সঠিক অ্যাডমিন পাসওয়ার্ড প্রদান করুন।');
        return;
      }
      return;
    }

    // Default student demo login
    handleDemoLogin('user-student-hsc');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-teal-900 p-8 text-white text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-teal-300 mb-2">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">দিশারী কেমিস্ট্রি লগইন</h2>
          <p className="text-xs text-teal-200">
            আপনার একাডেমিক একাউন্টে প্রবেশ করুন
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-teal-500 rounded-2xl font-bold text-slate-800 text-sm flex items-center justify-center gap-3 transition-all shadow-xs group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'লগইন হচ্ছে...' : 'গুগল দিয়ে লগইন করুন (Firebase ক্লাউড)'}</span>
          </button>

          {/* Backend Status indicator */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${firestoreConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              Firebase Firestore ব্যাকএন্ড:
            </span>
            <span className="font-semibold text-teal-800">
              {firestoreConnected ? 'অনলাইন ও সক্রিয়' : 'কানেক্টেড'}
            </span>
          </div>

          {/* Quick Profile Access */}
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2.5">
            <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block">
              এক ক্লিকে প্রাতিষ্ঠানিক অ্যাকাউন্টে প্রবেশ:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('user-student-hsc')}
                className="p-2.5 bg-white hover:bg-teal-100/60 border border-teal-300 rounded-xl font-semibold text-teal-950 transition-colors text-left"
              >
                🎓 তাহমিদ ইসলাম (HSC)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('user-student-ssc')}
                className="p-2.5 bg-white hover:bg-teal-100/60 border border-teal-300 rounded-xl font-semibold text-teal-950 transition-colors text-left"
              >
                🎒 সুমাইয়া জাহান (SSC)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('user-student-honors')}
                className="p-2.5 bg-white hover:bg-teal-100/60 border border-teal-300 rounded-xl font-semibold text-teal-950 transition-colors text-left"
              >
                🔬 নাজমুল হাসান (Honors)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminModalPassword('');
                  setAdminModalError('');
                  setIsAdminModalOpen(true);
                }}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl font-bold text-amber-900 transition-colors text-left flex items-center justify-between"
              >
                <span>👑 দিশারী কেয়ার (অ্যাডমিন)</span>
                <Lock className="w-3.5 h-3.5 text-amber-600" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">অথবা ইমেইল দিয়ে</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@dishari.edu.bd"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড:</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              লগইন করুন <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            অ্যাকাউন্ট নেই?{' '}
            <Link href="/register" className="font-bold text-teal-700 hover:underline">
              নিবন্ধন করুন
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Security Password Prompt Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-amber-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> অ্যাডমিন ভেরিফিকেশন
              </div>
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                অ্যাডমিন পাসওয়ার্ড প্রদান করুন
              </h3>
              <p className="text-xs text-slate-500">
                দিশারী কেমিস্ট্রি কেয়ার (অ্যাডমিন) ড্যাশবোর্ডে প্রবেশ করতে সিকিউরিটি পাসওয়ার্ডটি দিন।
              </p>
            </div>

            {adminModalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminModalError}</span>
              </div>
            )}

            <form onSubmit={handleAdminModalSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showAdminModalPassword ? 'text' : 'password'}
                  value={adminModalPassword}
                  onChange={(e) => {
                    setAdminModalPassword(e.target.value);
                    if (adminModalError) setAdminModalError('');
                  }}
                  autoFocus
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl text-sm focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminModalPassword(!showAdminModalPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showAdminModalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isAdminVerifying}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {isAdminVerifying ? 'যাচাই হচ্ছে...' : 'প্রবেশ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
