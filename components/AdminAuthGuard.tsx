'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight, Home, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  useEffect(() => {
    // Check local session or cookie
    const checkAuth = async () => {
      const sessionVerified = sessionStorage.getItem('dishari_admin_auth') === 'verified';
      if (sessionVerified) {
        setIsAuthenticated(true);
        return;
      }

      try {
        const res = await fetch('/api/admin/verify-password');
        const data = await res.json();
        if (data.authenticated) {
          sessionStorage.setItem('dishari_admin_auth', 'verified');
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('dishari_admin_auth', 'verified');
        setIsAuthenticated(true);
        setPassword('');
        router.refresh();
      } else {
        setError(data.error || 'ভুল পাসওয়ার্ড! সঠিক অ্যাডমিন পাসওয়ার্ড প্রদান করুন।');
      }
    } catch (e) {
      setError('পাসওয়ার্ড যাচাই করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockAdmin = async () => {
    setIsLocking(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    sessionStorage.removeItem('dishari_admin_auth');
    setIsAuthenticated(false);
    setIsLocking(false);
    router.refresh();
  };

  // Checking initial authentication state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
          <Lock className="w-6 h-6 text-amber-600" />
        </div>
        <p className="text-sm font-semibold text-slate-600">অ্যাডমিন সিকিউরিটি যাচাই হচ্ছে...</p>
      </div>
    );
  }

  // Not authenticated: Render Admin Security Password Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-8 text-white text-center space-y-3 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-300 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> সিকিউরিটি গেটওয়ে
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                দিশারী কেমিস্ট্রি অ্যাডমিন প্যানেল
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                কোর্স তৈরি, পাঠ সম্পাদন, প্রশ্ন ব্যাংক ও ইউজার নিয়ন্ত্রণ সুরক্ষিত রাখতে পাসওয়ার্ড দিন
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-7 sm:p-8 space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-start gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="font-medium">{error}</div>
              </div>
            )}

            <form onSubmit={handleUnlock} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>অ্যাডমিন পাসওয়ার্ড (Admin Password):</span>
                  <span className="text-[11px] font-normal text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    সুরক্ষিত এনক্রিপশন
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    autoFocus
                    className="w-full pl-4 pr-11 py-3 bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                    title={showPassword ? 'লুকান' : 'দেখুন'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-slate-950 font-extrabold rounded-2xl text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>যাচাই হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>পাসওয়ার্ড দিয়ে আনলক করুন</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link
                href="/"
                className="hover:text-teal-700 flex items-center gap-1 font-semibold transition-colors"
              >
                <Home className="w-3.5 h-3.5" /> হোম পেজে ফিরে যান
              </Link>
              <Link
                href="/login"
                className="hover:text-amber-800 font-semibold transition-colors"
              >
                লগইন পেজ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: Render children with Admin Bar
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Admin Security Status Strip */}
      <div className="bg-slate-950 text-white border-b border-amber-500/30 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">
              অ্যাডমিন মোড সক্রিয়
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] border border-amber-500/30">
              সুরক্ষিত (SHSaydi@25)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            >
              <Home className="w-3.5 h-3.5" /> মূল সাইট
            </Link>
            <button
              type="button"
              onClick={handleLockAdmin}
              disabled={isLocking}
              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/30 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="অ্যাডমিন প্যানেল লক করুন"
            >
              <LogOut className="w-3 h-3" />
              <span>{isLocking ? 'লক হচ্ছে...' : 'প্যানেল লক করুন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      {children}
    </div>
  );
}
