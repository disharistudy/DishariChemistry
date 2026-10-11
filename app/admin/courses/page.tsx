import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import { BookOpen, Layers, ArrowRight, ShieldCheck, CheckCircle2, ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const courses = db.getCourses();
  const allChapters = db.getChapters();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-amber-800 flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> অ্যাডমিন ড্যাশবোর্ড
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">কোর্স ও অধ্যায় ব্যবস্থাপনা</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            কোর্স ও সিলেবাস অ্যাডমিনিস্ট্রেশন
          </h1>
        </div>

        <Link
          href="/admin/lessons"
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          নতুন পাঠ তৈরি করুন <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Courses List */}
      <div className="space-y-6">
        {courses.map((course) => {
          const chapters = allChapters.filter(c => c.course_id === course.id);
          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
            >
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {course.academic_level}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{course.title_bn}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{course.curriculum_version}</p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="px-3 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    প্রকাশিত (Published)
                  </span>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors"
                  >
                    লাইভ দেখুন
                  </Link>
                </div>
              </div>

              {/* Chapters Table */}
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  অধ্যায় সূচি ও অনুক্রম ({chapters.length}টি অধ্যায়):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {chapters.map((ch) => (
                    <div
                      key={ch.id}
                      className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-teal-400 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-teal-800 mr-2">অধ্যায় {ch.chapter_number}:</span>
                        <span className="font-medium text-slate-800">{ch.title_bn}</span>
                        <p className="text-[11px] text-slate-400 truncate max-w-sm">{ch.description}</p>
                      </div>
                      <span className="shrink-0 text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                        {ch.lesson_count}টি পাঠ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
