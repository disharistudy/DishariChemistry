import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/store';
import { GraduationCap, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HonorsChemistryPage() {
  const course = db.getCourseBySlug('honors-chemistry');
  if (!course) notFound();

  const chapters = db.getChapters(course.id);
  const allLessons = db.getLessons();

  const honorFields = [
    { title: 'জৈব রসায়ন মেকানিজম', desc: 'পেরি-সাইক্লিক, কার্বোক্যাটায়ন ও স্টেরিওকেমিস্ট্রি' },
    { title: 'কোঅর্ডিনেশন কেমিস্ট্রি', desc: 'ক্রিস্টাল ফিল্ড থিওরি ও মেটাল কমপ্লেক্স বর্ণালী' },
    { title: 'মলিকুলার স্পেকট্রোস্কোপি', desc: 'UV-Vis, FT-IR, এবং ¹H/¹³C NMR শিফট বিশ্লেষণ' },
    { title: 'কোয়ান্টাম রসায়ন ও থার্মোডাইনামিক্স', desc: 'শ্রোডিঙ্গার তরঙ্গ সমীকরণ ও পরিসংখ্যান বলবিদ্যা' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            স্নাতক (সম্মান) রসায়ন
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {course.title_bn}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            {course.description}
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs text-indigo-200">
            <span>• জাতীয় বিশ্ববিদ্যালয় ও পাবলিক বিশ্ববিদ্যালয় কারিকুলাম</span>
            <span>• উচ্চতর আণবিক রসায়ন ও গবেষণা ভিত্তি</span>
          </div>
        </div>
      </div>

      {/* Focus Modules Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">অনার্স অ্যাডভান্সড মডিউলসমূহ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapters.map((ch, idx) => {
            const lessons = allLessons.filter(l => l.chapter_id === ch.id);
            return (
              <div
                key={ch.id}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      মডিউল {ch.chapter_number}
                    </span>
                    <span className="text-xs text-slate-400">
                      {lessons.length}টি উচ্চতর পাঠ
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-700 transition-colors">
                    {ch.title_bn}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {ch.description}
                  </p>

                  {/* Lessons list */}
                  {lessons.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        পাঠসমূহ:
                      </span>
                      {lessons.map(les => (
                        <Link
                          key={les.id}
                          href={`/lessons/${les.slug}`}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 text-xs font-medium text-slate-700 transition-colors"
                        >
                          <span className="truncate max-w-[80%]">{les.title_bn}</span>
                          <span className="text-slate-400 text-[11px]">{les.reading_time_minutes} মি.</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Link
                    href={`/courses/honors-chemistry/${ch.slug}`}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    মডিউলের বিস্তারিত পাঠ দেখুন <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
