import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import { Bookmark, ArrowRight, BookOpen, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BookmarksPage() {
  const activeUser = db.getActiveUser();
  const dashboard = db.getStudentDashboard(activeUser.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
          <Bookmark className="w-4 h-4 text-blue-600" /> সংরক্ষিত তালিকা
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          আমার বুকমার্ককৃত পাঠসমূহ ({dashboard.bookmarkedLessons.length}টি)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          পরবর্তীতে দ্রুত পড়ার জন্য আপনি যেসব রসায়ন লেসন সেভ করে রেখেছেন।
        </p>
      </div>

      {dashboard.bookmarkedLessons.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">কোনো বুকমার্ক পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            যেকোনো পাঠ পড়ার সময় উপরে থাকা ‘বুকমার্ক’ আইকনে ক্লিক করলেই তা এখানে সংরক্ষিত হবে।
          </p>
          <div className="pt-2">
            <Link
              href="/courses"
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition-colors inline-block"
            >
              কোর্সসমূহে যান
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboard.bookmarkedLessons.map(({ bookmark, lesson }) => (
            <Link
              key={bookmark.id}
              href={`/lessons/${lesson?.slug}`}
              className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" /> {lesson?.reading_time_minutes} মিনিট
                  </span>
                  <span>{new Date(bookmark.created_at).toLocaleDateString('bn-BD')}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                  {lesson?.title_bn}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {lesson?.introduction}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>পাঠটি পড়ুন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
