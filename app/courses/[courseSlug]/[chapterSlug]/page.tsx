import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/store';
import { BookOpen, ArrowRight, Award, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ courseSlug: string; chapterSlug: string }>;
}) {
  const { courseSlug, chapterSlug } = await params;
  const chapterData = db.getChapterBySlug(courseSlug, chapterSlug);

  if (!chapterData) {
    notFound();
  }

  const { chapter, course, lessons } = chapterData;
  const allQuizzes = db.getQuizSets();
  const chapterQuiz = allQuizzes.find(q => q.chapter_id === chapter.id) || allQuizzes.find(q => q.academic_level === course.academic_level);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/courses" className="hover:text-teal-700">কোর্সসমূহ</Link>
        <span>/</span>
        <Link href={`/courses/${course.slug}`} className="hover:text-teal-700">{course.title_bn}</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{chapter.title_bn}</span>
      </div>

      {/* Chapter Banner */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {course.title_bn} • অধ্যায় {chapter.chapter_number}
          </span>
          <span className="text-xs text-slate-400">
            মোট {lessons.length}টি পাঠ
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {chapter.title_bn}
        </h1>

        {chapter.title_en && (
          <p className="text-sm font-sans text-slate-400">{chapter.title_en}</p>
        )}

        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          {chapter.description}
        </p>

        {chapterQuiz && (
          <div className="pt-2 flex items-center gap-3">
            <Link
              href={`/quiz/${chapterQuiz.slug}`}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-600" />
              অধ্যায়ের প্র্যাকটিস কুইজ দিন
            </Link>
          </div>
        )}
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">অধ্যায়ভুক্ত পাঠসমূহ ({lessons.length}টি)</h2>

        {lessons.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            এই অধ্যায়ের পাঠ প্রস্তুত হচ্ছে। শীঘ্রই উন্মুক্ত করা হবে।
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {lessons.map((les, index) => (
              <Link
                key={les.id}
                href={`/lessons/${les.slug}`}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-bold text-teal-700">পাঠ {index + 1}</span>
                    <span>•</span>
                    <span>{les.reading_time_minutes} মিনিট পাঠ</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                    {les.title_bn}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl">
                    {les.introduction}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
                  <span>পড়ুন</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
