'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Chapter, Course, Paper, Lesson } from '@/lib/types';
import { BookOpen, ArrowRight, Layers, Sparkles } from 'lucide-react';

export default function HscChemistryPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activePaper, setActivePaper] = useState<string>('all');

  const fetchCourse = async () => {
    try {
      const res = await fetch('/api/courses/hsc-chemistry');
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
        setPapers(data.papers || []);
        setChapters(data.chapters || []);
      }
      const lRes = await fetch('/api/admin/lessons');
      if (lRes.ok) {
        const lData = await lRes.json();
        setLessons(lData.lessons || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const filteredChapters = chapters.filter(ch => {
    if (activePaper === 'all') return true;
    return ch.paper_id === activePaper;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
            এইচএসসি কারিকুলাম (একাদশ-দ্বাদশ শ্রেণি)
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            এইচএসসি রসায়ন ১ম ও ২য় পত্র
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            গুণগত রসায়ন, সংকরায়ন, রাসায়নিক সাম্যাবস্থা, পরিবেশ রসায়ন, জৈব বিক্রিয়া মেকানিজম এবং পরিমাণগত বিশ্লেষণ।
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs text-teal-200">
            <span>• ১ ও ২য় পত্রের পূর্ণাঙ্গ এনসিটিবি সিলেবাস</span>
            <span>• মেডিকেল ও ইঞ্জিনিয়ারিং ভর্তি সহায়িকা</span>
          </div>
        </div>
      </div>

      {/* Paper Switcher Tabs (1st Paper, 2nd Paper, All) */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActivePaper('all')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${
            activePaper === 'all'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          উভয় পত্র (মোট {chapters.length}টি অধ্যায়)
        </button>
        {papers.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePaper(p.id)}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${
              activePaper === p.id
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {p.title_bn}
          </button>
        ))}
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChapters.map((ch) => {
          const chapLessons = lessons.filter(l => l.chapter_id === ch.id);
          const paperName = ch.paper_id === 'paper-hsc-1' ? '১ম পত্র' : '২য় পত্র';

          return (
            <div
              key={ch.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full">
                    {paperName} • অধ্যায় {ch.chapter_number}
                  </span>
                  <span className="text-xs text-slate-400">
                    {chapLessons.length}টি প্রকাশিত পাঠ
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 hover:text-teal-700 transition-colors">
                  {ch.title_bn}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {ch.description}
                </p>

                {/* Lessons inside chapter */}
                {chapLessons.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      পাঠসমূহ:
                    </span>
                    {chapLessons.map(les => (
                      <Link
                        key={les.id}
                        href={`/lessons/${les.slug}`}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-xs font-medium text-slate-700 transition-colors"
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
                  href={`/courses/hsc-chemistry/${ch.slug}`}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  অধ্যায়ের পাঠ ও কুইজ দেখুন <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
