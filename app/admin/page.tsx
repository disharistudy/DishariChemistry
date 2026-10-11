import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import {
  ShieldCheck,
  BookOpen,
  Award,
  Users,
  Flag,
  Layers,
  ArrowRight,
  PlusCircle,
  FileText,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = db.getAdminStats();
  const activeUser = db.getActiveUser();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> সুরক্ষিত প্রশাসনিক নিয়ন্ত্রণ
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            অ্যাডমিন ড্যাশবোর্ড ও কন্টেন্ট ম্যানেজমেন্ট
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            অপারেটর: <strong className="text-white">{activeUser.full_name}</strong> • রোল: {activeUser.role}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/lessons"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> নতুন পাঠ তৈরি করুন
          </Link>
          <Link
            href="/admin/questions"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-amber-300" /> প্রশ্ন ব্যাংক পরিচালনা
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">প্রকাশিত কোর্স</span>
          <div className="text-3xl font-extrabold text-slate-900">{stats.publishedCourses} টি</div>
          <span className="text-[11px] text-teal-600 font-semibold">SSC, HSC ও Honors</span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">মোট রসায়ন পাঠ</span>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalLessons} টি</div>
          <span className="text-[11px] text-teal-600 font-semibold">{stats.publishedLessons}টি প্রকাশিত</span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">নিবন্ধিত শিক্ষার্থী</span>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalStudents} জন</div>
          <span className="text-[11px] text-blue-600 font-semibold">সক্রিয় লার্নার প্রোফাইল</span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-medium">কুইজ পরীক্ষা সম্পন্ন</span>
          <div className="text-3xl font-extrabold text-teal-700">{stats.totalAttempts} বার</div>
          <span className="text-[11px] text-amber-600 font-semibold">অটো-গ্রেডিং রেকর্ড</span>
        </div>
      </div>

      {/* Navigation Quick Links to Sub-panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/courses"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">কোর্স ও অধ্যায়</h4>
              <span className="text-xs text-slate-400">সিলেবাস ও অনুক্রম</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
        </Link>

        <Link
          href="/admin/lessons"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">পাঠ এডিটর</h4>
              <span className="text-xs text-slate-400">রিচ-টেক্সট ও সমীকরণ</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
        </Link>

        <Link
          href="/admin/questions"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">প্রশ্ন ব্যাংক</h4>
              <span className="text-xs text-slate-400">MCQ ও নম্বর কনফিগ</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
        </Link>

        <Link
          href="/admin/users"
          className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">ব্যবহারকারী ও রোল</h4>
              <span className="text-xs text-slate-400">শিক্ষার্থী ও পারমিশন</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300" />
        </Link>
      </div>

      {/* Two columns: Student Reports & System Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reported Content Errors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Flag className="w-4 h-4 text-rose-500" />
              শিক্ষার্থীদের দাখিলকৃত ত্রুটি রিপোর্ট ({stats.reports.length})
            </h3>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
              {stats.pendingReports}টি অমীমাংসিত
            </span>
          </div>

          <div className="space-y-3">
            {stats.reports.map((rep) => (
              <div key={rep.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rep.lesson_title}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rep.status === 'resolved' ? 'সংশোধিত' : 'বিচারাধীন'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  রিপোর্টার: {rep.user_name || 'বেনামী'} • ধরন: {rep.report_type}
                </div>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {rep.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            প্রশাসনিক অডিট লগ (Audit Activity Log)
          </h3>

          <div className="space-y-3">
            {stats.auditLogs.map((log) => (
              <div key={log.id} className="p-4 bg-white rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(log.created_at).toLocaleTimeString('bn-BD')}
                  </span>
                </div>
                <div className="text-[11px] text-teal-700 font-medium">
                  {log.admin_name} • লক্ষ্য: {log.target_entity}
                </div>
                <p className="text-slate-600">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
