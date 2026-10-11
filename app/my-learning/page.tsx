import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import {
  TrendingUp,
  BookOpen,
  Award,
  Bookmark,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MyLearningPage() {
  const activeUser = db.getActiveUser();
  const dashboard = db.getStudentDashboard(activeUser.id);
  const allCourses = db.getCourses();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
      {/* Student Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg">
            {activeUser.full_name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{activeUser.full_name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase border border-teal-500/30">
                {activeUser.academic_level} লেভেল
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {activeUser.email} • {activeUser.institution || 'বাংলাদেশ শিক্ষাক্রম'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-xs transition-colors"
          >
            প্রোফাইল এডিট
          </Link>
          <Link
            href="/quiz"
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-colors"
          >
            নতুন কুইজ দিন
          </Link>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">সম্পন্ন রসায়ন পাঠ</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {dashboard.completedLessonsCount} টি
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">ধারাবাহিক পড়াশোনা</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">কুইজ পরীক্ষার সংখ্যা</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {dashboard.totalAttempts} বার
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">সার্ভার স্কোরিং</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">সামগ্রিক গড় নম্বর</span>
          <div className="text-2xl font-bold text-teal-700 mt-1">
            {dashboard.avgScore}%
          </div>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">নেগেটিভ মার্কিং সহ</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">বুকমার্ককৃত পাঠ</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {dashboard.bookmarkedLessons.length} টি
          </div>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">দ্রুত পড়ার তালিকা</span>
        </div>
      </div>

      {/* Weak Topic & Suggestions */}
      <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-3xl space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          শিক্ষার্থীর দুর্বল বিষয় পর্যালোচনা ও পরামর্শ (Weak Topic Identification)
        </div>
        <p className="text-xs text-amber-950 leading-relaxed">
          আপনার পূর্ববর্তী কুইজ বিশ্লেষণ অনুযায়ী, <strong>জৈব রসায়ন মেকানিজম</strong> এবং <strong>কোয়ান্টাম সংখ্যা (n, l, m, s)</strong> সংশ্লিষ্ট প্রশ্নসমূহে আরেকটু নিবিড় অনুশীলনের প্রয়োজন রয়েছে। সংশ্লিষ্ট পাঠসমূহ পুনরাবৃত্তি করার পরামর্শ দেওয়া হচ্ছে।
        </p>
      </div>

      {/* Two columns: Saved Bookmarks & Personal Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bookmarks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600" />
              সংরক্ষিত বুকমার্ক ({dashboard.bookmarkedLessons.length})
            </h3>
            <Link href="/bookmarks" className="text-xs font-semibold text-teal-700 hover:text-teal-800">
              সব দেখুন
            </Link>
          </div>

          {dashboard.bookmarkedLessons.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              এখনো কোনো পাঠ বুকমার্ক করা হয়নি। পাঠ পড়ার সময় ‘বুকমার্ক’ বাটনে চাপলে এখানে জমা হবে।
            </div>
          ) : (
            <div className="space-y-3">
              {dashboard.bookmarkedLessons.map(({ bookmark, lesson }) => (
                <Link
                  key={bookmark.id}
                  href={`/lessons/${lesson?.slug}`}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 transition-colors flex items-center justify-between text-xs group"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-teal-700">
                      {lesson?.title_bn}
                    </h4>
                    <span className="text-slate-400 text-[11px]">
                      সময়: {lesson?.reading_time_minutes} মিনিট পাঠ
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Private Student Notes */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-600" />
            ব্যক্তিগত পাঠ নোট ({dashboard.notes.length})
          </h3>

          {dashboard.notes.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              এখনো কোনো নোট সংরক্ষণ করেননি। যেকোনো পাঠ পড়ার সময় নোট লিখে রাখুন।
            </div>
          ) : (
            <div className="space-y-3">
              {dashboard.notes.map(({ note, lesson }) => (
                <div key={note.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <Link href={`/lessons/${lesson?.slug}`} className="font-bold text-teal-800 hover:underline">
                      {lesson?.title_bn}
                    </Link>
                    <span className="text-[10px] text-slate-400">
                      {new Date(note.updated_at).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                  <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    “{note.note_text}”
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
