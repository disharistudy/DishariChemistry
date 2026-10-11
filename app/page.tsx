import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import {
  FlaskConical,
  Atom,
  GraduationCap,
  Award,
  TableProperties,
  Flame,
  Calculator,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Bookmark,
  Bell
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const courses = db.getCourses();
  const announcements = db.getAnnouncements();
  const recentLessons = db.getLessons().slice(0, 4);
  const activeUser = db.getActiveUser();
  const dashboard = db.getStudentDashboard(activeUser.id);
  const dailyQuiz = db.getQuizSets().find(q => q.is_daily);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 sm:pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Subtle molecular background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>রসায়ন শিখি সহজভাবে, এগিয়ে যাই আত্মবিশ্বাসে</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            রসায়ন শেখা হোক <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-200">আরও সহজ ও আকর্ষণীয়</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SSC, HSC ও Honors শিক্ষার্থীদের জন্য বাংলা পাঠ্যক্রম, ১-ক্লিকে মৌলের বিস্তারিত তথ্য, বিক্রিয়া কৌশল, লাইভ ক্যালকুলেটর ও মডেল টেস্ট।
          </p>

          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 pt-2 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/courses"
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              শেখা শুরু করুন
            </Link>
            <Link
              href="/quiz"
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              কুইজ দিন
            </Link>
            <Link
              href="/periodic-table"
              className="col-span-2 sm:col-span-1 w-full sm:w-auto px-5 py-3 rounded-xl font-medium text-xs sm:text-sm bg-white/10 hover:bg-white/15 text-slate-200 backdrop-blur-xs transition-all flex items-center justify-center gap-2"
            >
              <TableProperties className="w-4 h-4 text-cyan-300 shrink-0" />
              পর্যায় সারণি
            </Link>
          </div>

          {/* Clean Highlights Bar */}
          <div className="pt-6 sm:pt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <strong className="text-teal-300 font-semibold">৩টি স্তর:</strong> এসএসসি • এইচএসসি • অনার্স
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <strong className="text-cyan-300 font-semibold">১১৮টি মৌল:</strong> বাংলা পর্যায় সারণি
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <strong className="text-amber-300 font-semibold">৮ বিভাগ:</strong> বিক্রিয়া লাইব্রেরি
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <strong className="text-emerald-300 font-semibold">১০০% ফ্রি:</strong> উন্মুক্ত বিজ্ঞানচর্চা
            </span>
          </div>
        </div>
      </section>

      {/* 2. Personalized "Continue Learning" & Progress Banner for Active Student */}
      {activeUser && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-12 relative z-10">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xl shadow-slate-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-teal-700 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0">
                  {activeUser.full_name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      স্বাগতম, {activeUser.full_name}!
                    </h3>
                    <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {activeUser.academic_level} শিক্ষার্থী
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeUser.institution || 'বাংলাদেশ শিক্ষাক্রম'} • আপনার নিয়মিত পড়াশোনা ও অগ্রগতি
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href="/my-learning"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  আমার ড্যাশবোর্ড দেখুন
                </Link>
              </div>
            </div>

            {/* Quick stats: Clean 2-row on mobile, 4-col on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs text-slate-500 font-medium">সম্পন্ন পাঠ</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {dashboard.completedLessonsCount} <span className="text-xs font-normal text-slate-500">টি</span>
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs text-slate-500 font-medium">কুইজ পরীক্ষা</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {dashboard.totalAttempts} <span className="text-xs font-normal text-slate-500">বার</span>
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs text-slate-500 font-medium">গড় স্কোর</span>
                <div className="text-xl sm:text-2xl font-black text-teal-700 mt-1">
                  {dashboard.avgScore}%
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <span className="text-xs text-slate-500 font-medium">সংরক্ষিত পাঠ</span>
                <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">
                  {dashboard.bookmarkedLessons.length} <span className="text-xs font-normal text-slate-500">টি</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Three Academic Course Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
              পাঠ্যক্রম ভিত্তিক কোর্স
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              আপনার একাডেমিক স্তর বেছে নিন
            </h2>
          </div>
          <Link
            href="/courses"
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            সব কোর্স দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {courses.map((course) => {
            const badgeColor =
              course.academic_level === 'ssc'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : course.academic_level === 'hsc'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-purple-50 text-purple-800 border-purple-200';

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-5 sm:p-7 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                      {course.academic_level === 'ssc' ? 'এসএসসি' : course.academic_level === 'hsc' ? 'এইচএসসি' : 'স্নাতক (অনার্স)'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {course.curriculum_version.split('(')[0]}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {course.title_bn}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 font-medium border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-teal-600" />
                      {course.total_chapters}টি অধ্যায়
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {course.total_lessons}টি সমৃদ্ধ পাঠ
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-7 pt-0">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="w-full py-2.5 sm:py-3 rounded-2xl bg-slate-900 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    কোর্সটি দেখুন <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Interactive Chemistry Tools Section (2x2 on Mobile for Clean Layout) */}
      <section className="bg-slate-100/70 py-12 sm:py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              ডিজিটাল রসায়ন ল্যাব ও ক্যালকুলেশন
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              স্মার্ট রসায়ন টুলকিট
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              পর্যায় সারণি, বিক্রিয়া লাইব্রেরি ও লাইভ ক্যালকুলেটরের মাধ্যমে রসায়নের জটিল বিষয়গুলো সহজে আয়ত্ত করুন।
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Tool 1: Periodic table */}
            <Link
              href="/periodic-table"
              className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                  <TableProperties className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700">পর্যায় সারণি</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  ১১৮টি মৌলের পূর্ণ বাংলা তথ্য, ধর্ম ও রূপ।
                </p>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-teal-600">
                সারণি খুলুন <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Tool 2: Reactions */}
            <Link
              href="/reactions"
              className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-700">বিক্রিয়া লাইব্রেরি</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  ৮ বিভাগের বিক্রিয়া সমীকরণ ও শর্তাবলী।
                </p>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-600">
                বিক্রিয়া দেখুন <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Tool 3: Formulas */}
            <Link
              href="/formulas"
              className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700">ফর্মুলা ও হিসাব</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  মোলারিটি, PV=nRT ও pH এর লাইভ ক্যালকুলেটর।
                </p>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-teal-600">
                হিসাব করুন <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Tool 4: Daily Quiz */}
            <Link
              href={dailyQuiz ? `/quiz/${dailyQuiz.slug}` : '/quiz'}
              className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 to-teal-900 text-white rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 text-teal-300 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white">দৈনিক রসায়ন কুইজ</h3>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                  প্রতিদিনের অনুশীলনে স্কোর ও সমাধান।
                </p>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-teal-300">
                কুইজ দিন <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Recently Published Lessons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
              নতুন পাঠমালা
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              সাম্প্রতিক প্রকাশিত রসায়ন পাঠ
            </h2>
          </div>
          <Link href="/courses" className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            সকল পাঠ দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentLessons.map((les) => (
            <Link
              key={les.id}
              href={`/lessons/${les.slug}`}
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                    {les.reading_time_minutes} মিনিট পাঠ
                  </span>
                  <span>•</span>
                  <span>{les.author_name}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 hover:text-teal-700 transition-colors">
                  {les.title_bn}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">
                  {les.introduction}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
                <span>পাঠটি পড়ুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Announcements & Platform Updates */}
      {announcements && announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-amber-50/60 rounded-3xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-4">
              <Bell className="w-4 h-4 text-amber-600" />
              প্ল্যাটফর্ম নোটিশ ও শিক্ষাক্রম আপডেট
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold mb-1">
                    <span className="px-2 py-0.5 bg-amber-100 rounded-md">{ann.tag}</span>
                    <span className="text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{ann.title_bn}</h4>
                  <p className="text-xs text-slate-600 mt-1">{ann.content_bn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
