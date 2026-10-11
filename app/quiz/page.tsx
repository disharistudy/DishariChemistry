import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/store';
import { Award, Timer, ArrowRight, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function QuizCenterPage() {
  const quizSets = db.getQuizSets();
  const activeUser = db.getActiveUser();
  const attempts = db.getAttemptsForUser(activeUser.id);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Award className="w-3.5 h-3.5 text-teal-400" /> স্বয়ংক্রিয় সার্ভার মূল্যায়ন
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            কুইজ ও মডেল টেস্ট সেন্টার
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            দৈনিক কুইজ, এসএসসি ও এইচএসসি বোর্ড মডেল টেস্ট এবং অনার্স প্র্যাকটিস টেস্ট। নেগেটিভ মার্কিং সহ সময় নিয়ন্ত্রিত অনলাইন পরীক্ষা ও বিশদ বাংলা সমাধান।
          </p>
        </div>
      </div>

      {/* Quiz Sets Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">উপলব্ধ পরীক্ষাসমূহ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {quizSets.map((qs) => {
            return (
              <div
                key={qs.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {qs.is_daily ? 'দৈনিক কুইজ' : qs.academic_level === 'ssc' ? 'এসএসসি' : qs.academic_level === 'hsc' ? 'এইচএসসি' : 'অনার্স'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" /> {qs.duration_minutes} মিনিট
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{qs.title_bn}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {qs.description_bn}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">মোট প্রশ্ন</span>
                      <span className="font-bold text-slate-800">{qs.question_count} টি</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">পাস মার্ক</span>
                      <span className="font-bold text-slate-800">{qs.pass_marks_percent}%</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">নেগেটিভ মার্ক</span>
                      <span className="font-bold text-rose-600">-{qs.negative_marking_per_question}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link
                    href={`/quiz/${qs.slug}`}
                    className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    পরীক্ষা শুরু করুন <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User's Past Quiz Attempts */}
      {attempts.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-slate-900">আপনার সাম্প্রতিক কুইজ ফলাফল</h2>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {attempts.map((att) => (
                <div key={att.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{att.quiz_title}</h4>
                    <span className="text-slate-400">
                      তারিখ: {new Date(att.completed_at || att.started_at).toLocaleDateString('bn-BD')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className="text-teal-700 font-extrabold text-sm">{att.score}</span>
                      <span className="text-slate-400">/ {att.total_marks} নম্বর</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800">
                      {att.correct_count}টি সঠিক
                    </span>
                    {att.incorrect_count > 0 && (
                      <span className="px-2.5 py-1 rounded-full font-bold bg-rose-50 text-rose-800">
                        {att.incorrect_count}টি ভুল
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
