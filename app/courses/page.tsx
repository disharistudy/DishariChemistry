import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import { BookOpen, GraduationCap, ArrowRight, Sparkles, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function CoursesPage() {
  const courses = db.getCourses();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
          একাডেমিক পাঠ্যক্রম
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          দিশারী রসায়ন কোর্সসমূহ
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          বাংলাদেশ জাতীয় শিক্ষাক্রম (NCTB) এবং জাতীয় বিশ্ববিদ্যালয়ের সিলেবাস অনুসারে সাজানো অধ্যায়ভিত্তিক কোর্স ও পাঠমালা।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.map((course) => {
          const chapters = db.getChapters(course.id);
          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {course.academic_level === 'ssc' ? 'এসএসসি' : course.academic_level === 'hsc' ? 'এইচএসসি' : 'অনার্স'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {course.total_chapters}টি অধ্যায়
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 group-hover:text-teal-700">
                  {course.title_bn}
                </h2>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {course.description}
                </p>

                {/* Chapter Previews */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    প্রধান অধ্যায়সমূহ:
                  </span>
                  <div className="space-y-1.5">
                    {chapters.slice(0, 4).map((ch) => (
                      <div key={ch.id} className="text-xs text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                        <span className="truncate">{ch.title_bn}</span>
                      </div>
                    ))}
                    {chapters.length > 4 && (
                      <div className="text-[11px] text-teal-700 font-medium pl-3.5">
                        + আরও {chapters.length - 4}টি অধ্যায়
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/courses/${course.slug}`}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  অধ্যায়ভিত্তিক সূচি দেখুন <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
