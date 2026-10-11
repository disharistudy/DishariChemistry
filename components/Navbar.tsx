'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FlaskConical,
  Atom,
  BookOpen,
  Award,
  TableProperties,
  GraduationCap,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Bookmark,
  Calculator,
  Flame,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { useFirebase } from '@/components/FirebaseProvider';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user: fbUser, signInWithGoogle, logout: fbLogout, firestoreConnected } = useFirebase();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setAllUsers(data.allUsers || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const handleSwitchUser = async (userId: string) => {
    const targetUser = allUsers.find((u) => u.id === userId);
    if (targetUser?.role === 'admin') {
      const isVerified = typeof window !== 'undefined' && sessionStorage.getItem('dishari_admin_auth') === 'verified';
      if (!isVerified) {
        setIsAccountModalOpen(false);
        router.push('/admin');
        return;
      }
    }

    try {
      const res = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch', userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setIsAccountModalOpen(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { href: '/', label: 'হোম', icon: BookOpen },
    { href: '/courses', label: 'কোর্সসমূহ', icon: GraduationCap },
    { href: '/quiz', label: 'কুইজ', icon: Award },
    { href: '/periodic-table', label: 'পর্যায় সারণি', icon: TableProperties },
    { href: '/my-learning', label: 'আমার পড়াশোনা', icon: Bookmark },
    { href: '/profile', label: 'প্রোফাইল', icon: User },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Top announcement mini-bar */}
        <div className="bg-slate-950 text-white text-[11px] sm:text-xs py-1 px-3 text-center flex items-center justify-center gap-2 overflow-hidden border-b border-slate-800/60">
          <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] shrink-0 border border-teal-500/30">
            <Sparkles className="w-3 h-3 text-teal-400" /> দিশারী কেমিস্ট্রি
          </span>
          <span className="text-slate-300 truncate">
            “রসায়ন শিখি সহজভাবে, এগিয়ে যাই আত্মবিশ্বাসে” — এসএসসি, এইচএসসি ও অনার্স উন্মুক্ত পোর্টাল
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-teal-800 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform shrink-0">
                <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-teal-200" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg leading-tight tracking-tight text-slate-900 flex items-center gap-1">
                  দিশারী <span className="text-teal-600">কেমিস্ট্রি</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-wider">
                  DISHARI CHEMISTRY
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-teal-700 bg-teal-50 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}

              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <Atom className="w-4 h-4 text-teal-600" />
                  টুলস
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isToolsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <Link
                      href="/reactions"
                      onClick={() => setIsToolsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
                    >
                      <Flame className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="font-medium">বিক্রিয়া লাইব্রেরি</div>
                        <div className="text-xs text-slate-400">৮টি ক্যাটাগরির বিক্রিয়া</div>
                      </div>
                    </Link>
                    <Link
                      href="/formulas"
                      onClick={() => setIsToolsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
                    >
                      <Calculator className="w-4 h-4 text-teal-600" />
                      <div>
                        <div className="font-medium">ফর্মুলা ও ক্যালকুলেশন</div>
                        <div className="text-xs text-slate-400">লাইভ হিসাব ও সমীকরণ</div>
                      </div>
                    </Link>
                    <Link
                      href="/bookmarks"
                      onClick={() => setIsToolsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">বুকমার্ককৃত পাঠ</div>
                        <div className="text-xs text-slate-400">সংরক্ষিত লেসন তালিকা</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Right actions: Search + User Account + Mobile Menu Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Search button */}
              <Link
                href="/search"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-sm"
                title="সার্চ করুন"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600" />
                <span className="hidden md:inline text-xs text-slate-500 font-normal border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50">
                  অনুসন্ধান
                </span>
              </Link>

              {/* Admin Button if user is Admin */}
              {currentUser?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  অ্যাডমিন
                </Link>
              )}

              {/* Account Pill (Desktop) */}
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(true)}
                className="hidden sm:flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-colors text-left"
                title="প্রোফাইল পরিবর্তন করুন"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-teal-600 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                  {currentUser?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-none">
                    {currentUser?.full_name?.split(' ')[0] || 'শিক্ষার্থী'}
                  </span>
                  <span className="text-[10px] text-teal-700 uppercase font-medium">
                    {currentUser?.role === 'admin' ? 'অ্যাডমিন' : currentUser?.academic_level}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Account Avatar Button (Mobile Only) */}
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(true)}
                className="sm:hidden w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-teal-700 flex items-center justify-center text-white text-xs font-bold border-2 border-teal-500/30 shadow-xs"
                title="প্রোফাইল পরিবর্তন করুন"
              >
                {currentUser?.full_name?.charAt(0) || 'U'}
              </button>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Backdrop */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-24 bg-slate-900/60 backdrop-blur-xs z-30"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="fixed top-24 left-0 right-0 bg-white border-b border-slate-200 shadow-2xl z-40 max-h-[calc(100vh-6.5rem)] overflow-y-auto px-4 pt-3 pb-6 space-y-3">
              {/* Active student summary card inside mobile menu */}
              <div className="p-3 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-base">
                    {currentUser?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">{currentUser?.full_name || 'শিক্ষার্থী'}</div>
                    <div className="text-[11px] text-teal-300">
                      {currentUser?.role === 'admin' ? 'অ্যাডমিন অ্যাকাউন্ট' : `${currentUser?.academic_level?.toUpperCase()} শিক্ষার্থী`}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAccountModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold"
                >
                  প্রোফাইল পরিবর্তন
                </button>
              </div>

              {/* Main Nav Links Grid */}
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      pathname === item.href
                        ? 'bg-teal-50 text-teal-900 border border-teal-200'
                        : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-teal-600" />
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Additional Chemistry Tools */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  বিশেষায়িত রসায়ন টুলস:
                </div>
                <Link
                  href="/reactions"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    বিক্রিয়া লাইব্রেরি (৮ বিভাগ)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/formulas"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-teal-600" />
                    ফর্মুলা ও লাইভ ক্যালকুলেটর
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-blue-600" />
                    বুকমার্ককৃত পাঠ
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                {currentUser?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-sm text-amber-900 bg-amber-50 rounded-xl border border-amber-200 font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      অ্যাডমিন ড্যাশবোর্ড
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Demo Account Switcher Modal */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-teal-900 p-5 text-white flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">ব্যবহারকারী ও শিক্ষার্থী প্রোফাইল নির্বাচন</h3>
                <p className="text-xs text-teal-200 mt-1">
                  এসএসসি, এইচএসসি, অনার্স শিক্ষার্থী অথবা অ্যাডমিন অ্যাকাউন্টে এক ক্লিকে সুইচ করুন।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* Firebase Cloud Auth section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${firestoreConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    Firebase ক্লাউড ব্যাকএন্ড
                  </span>
                  <span className="text-[10px] text-teal-700 font-medium">
                    {firestoreConnected ? 'সক্রিয়' : 'কানেক্টেড'}
                  </span>
                </div>
                {fbUser ? (
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{fbUser.displayName || 'Google User'}</div>
                      <div className="text-[11px] text-slate-500">{fbUser.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fbLogout()}
                      className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      সাইন আউট
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await signInWithGoogle();
                        setIsAccountModalOpen(false);
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                    Google দিয়ে কানেক্ট করুন
                  </button>
                )}
              </div>

              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                উপলব্ধ প্রোফাইলসমূহ ({allUsers.length})
              </div>

              {allUsers.map((user) => {
                const isSelected = user.id === currentUser?.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSwitchUser(user.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                          {user.full_name}
                          {user.role === 'admin' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                        <div className="text-[11px] text-teal-700 font-medium">
                          {user.institution || 'বাংলাদেশ শিক্ষাক্রম'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase px-2 py-0.5 rounded-full font-bold bg-slate-200 text-slate-700">
                        {user.academic_level}
                      </span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px]">
                          ✓
                        </div>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/login"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="text-xs text-slate-600 hover:text-teal-700 font-medium"
                >
                  লগইন পেজে যান
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="text-xs text-teal-700 font-semibold hover:underline"
                >
                  নতুন অ্যাকাউন্ট খুলুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            pathname === '/' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${pathname === '/' ? 'text-teal-600 scale-110' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-0.5 leading-none">হোম</span>
        </Link>
        <Link
          href="/courses"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            pathname.startsWith('/courses') ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <GraduationCap className={`w-4 h-4 ${pathname.startsWith('/courses') ? 'text-teal-600 scale-110' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-0.5 leading-none">কোর্স</span>
        </Link>
        <Link
          href="/periodic-table"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            pathname.startsWith('/periodic-table') ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <TableProperties className={`w-4 h-4 ${pathname.startsWith('/periodic-table') ? 'text-teal-600 scale-110' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-0.5 leading-none">সারণি</span>
        </Link>
        <Link
          href="/quiz"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            pathname.startsWith('/quiz') ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Award className={`w-4 h-4 ${pathname.startsWith('/quiz') ? 'text-teal-600 scale-110' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-0.5 leading-none">কুইজ</span>
        </Link>
        <Link
          href="/my-learning"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            pathname.startsWith('/my-learning') || pathname.startsWith('/profile') ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <User className={`w-4 h-4 ${pathname.startsWith('/my-learning') || pathname.startsWith('/profile') ? 'text-teal-600 scale-110' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-0.5 leading-none">ড্যাশবোর্ড</span>
        </Link>
      </nav>
    </>
  );
}
