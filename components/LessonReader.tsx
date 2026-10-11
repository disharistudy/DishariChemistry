'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lesson, Chapter, Course, Question } from '@/lib/types';
import KaTeXRenderer from './KaTeXRenderer';
import {
  Bookmark,
  CheckCircle2,
  Printer,
  Flag,
  Type,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Save,
  MessageSquare,
  HelpCircle,
  X
} from 'lucide-react';

interface LessonReaderProps {
  lesson: Lesson;
  chapter?: Chapter;
  course?: Course;
  prevLesson?: { slug: string; title_bn: string };
  nextLesson?: { slug: string; title_bn: string };
  relatedQuestions: Question[];
  initialIsBookmarked?: boolean;
  initialIsCompleted?: boolean;
  initialNote?: string;
}

export default function LessonReader({
  lesson,
  chapter,
  course,
  prevLesson,
  nextLesson,
  relatedQuestions,
  initialIsBookmarked = false,
  initialIsCompleted = false,
  initialNote = '',
}: LessonReaderProps) {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [personalNote, setPersonalNote] = useState(initialNote);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSavedMessage, setNoteSavedMessage] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Report Error Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('বৈজ্ঞানিক তথ্যের অসঙ্গতি');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleBookmark = async () => {
    try {
      const res = await fetch('/api/student/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.isBookmarked);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleComplete = async () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    try {
      await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, isCompleted: nextState }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    try {
      const res = await fetch('/api/student/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, noteText: personalNote }),
      });
      if (res.ok) {
        setNoteSavedMessage(true);
        setTimeout(() => setNoteSavedMessage(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lesson.id,
          lesson_title: lesson.title_bn,
          report_type: reportType,
          description: reportDesc
        }),
      });
      if (res.ok) {
        setReportSubmitted(true);
        setTimeout(() => {
          setIsReportModalOpen(false);
          setReportSubmitted(false);
          setReportDesc('');
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const contentFontSizeClass =
    fontSize === 'xlarge' ? 'text-lg leading-relaxed' :
    fontSize === 'large' ? 'text-base leading-relaxed' :
    'text-sm leading-relaxed';

  return (
    <div className="relative">
      {/* Top sticky reading progress bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-slate-200 z-30 no-print">
        <div
          className="h-full bg-teal-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-slate-500 mb-6 flex flex-wrap items-center gap-1.5 no-print">
          <Link href="/courses" className="hover:text-teal-700">কোর্সসমূহ</Link>
          <span>/</span>
          {course && (
            <>
              <Link href={`/courses/${course.slug}`} className="hover:text-teal-700">{course.title_bn}</Link>
              <span>/</span>
            </>
          )}
          {chapter && (
            <>
              <span className="text-slate-700 font-medium truncate max-w-xs">{chapter.title_bn}</span>
              <span>/</span>
            </>
          )}
          <span className="text-teal-700 font-semibold truncate max-w-xs">{lesson.title_bn}</span>
        </div>

        {/* Toolbar: Font size, Bookmark, Completed, Print, Report */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3 no-print">
          {/* Font Controls */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Type className="w-4 h-4 text-slate-400 mr-1" />
            <span className="font-medium mr-1 hidden sm:inline">ফন্ট সাইজ:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg ${fontSize === 'normal' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'}`}
            >
              স্বাভাবিক
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-lg ${fontSize === 'large' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'}`}
            >
              বড়
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded-lg ${fontSize === 'xlarge' ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100'}`}
            >
              অধিক বড়
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 text-xs">
            {/* Bookmark button */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold transition-colors ${
                isBookmarked
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
              {isBookmarked ? 'বুকমার্ক করা হয়েছে' : 'বুকমার্ক'}
            </button>

            {/* Mark completed */}
            <button
              type="button"
              onClick={handleToggleComplete}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold transition-colors ${
                isCompleted
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-teal-600' : ''}`} />
              {isCompleted ? 'পাঠ সম্পন্ন ✓' : 'সমাপ্ত চিহ্নিত করুন'}
            </button>

            {/* Print button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
              title="প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Report error */}
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
              title="ত্রুটি রিপোর্ট করুন"
            >
              <Flag className="w-3.5 h-3.5 text-rose-500" />
            </button>
          </div>
        </div>

        {/* Lesson Header */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs mb-8 print-clean">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-700 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200">
              পড়ার আনুমানিক সময়: {lesson.reading_time_minutes} মিনিট
            </span>
            {course && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {course.title_bn}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {lesson.title_bn}
          </h1>

          {lesson.title_en && (
            <p className="text-sm font-sans text-slate-400 mb-6 font-medium">
              {lesson.title_en}
            </p>
          )}

          {/* Learning Objectives Box */}
          {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 mb-6">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                শিখনফল (Learning Objectives):
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-teal-950">
                {lesson.learning_objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisite & Introduction */}
          {lesson.prerequisites && (
            <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
              <span className="font-semibold text-slate-700">পূর্বজ্ঞান:</span>
              <span>{lesson.prerequisites}</span>
            </div>
          )}

          {lesson.introduction && (
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic border-l-4 border-teal-600 pl-4 py-1 mb-8 bg-slate-50/60 rounded-r-xl">
              {lesson.introduction}
            </p>
          )}

          {/* Main Markdown / Explanation Content */}
          <div className={`prose prose-slate max-w-none ${contentFontSizeClass} space-y-4 text-slate-800`}>
            <div className="whitespace-pre-line leading-relaxed">
              {lesson.content_markdown}
            </div>
          </div>

          {/* Key Definitions Section */}
          {lesson.definitions && lesson.definitions.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                গুরুত্বপূর্ণ সংজ্ঞা ও পারিভাষিক অর্থ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {lesson.definitions.map((def, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="font-bold text-sm text-teal-900 mb-1">
                      {def.term_bn} {def.term_en && <span className="text-xs text-slate-400 font-normal">({def.term_en})</span>}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{def.definition_bn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chemical Equations Display */}
          {lesson.chemical_equations && lesson.chemical_equations.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                রাসায়নিক সমীকরণ ও শর্ত
              </h3>
              <div className="space-y-3">
                {lesson.chemical_equations.map((eq, i) => (
                  <div key={i} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                    <div className="text-xs font-bold text-amber-900 mb-1">{eq.title_bn}</div>
                    <div className="p-2.5 bg-white rounded-lg border border-amber-300 font-mono text-sm text-slate-900 font-semibold overflow-x-auto">
                      {eq.equation}
                    </div>
                    {eq.conditions && (
                      <div className="text-xs text-amber-800 font-medium mt-1.5">
                        শর্ত: {eq.conditions}
                      </div>
                    )}
                    {eq.explanation_bn && (
                      <p className="text-xs text-slate-600 mt-1">{eq.explanation_bn}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Worked Examples */}
          {lesson.worked_examples && lesson.worked_examples.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-teal-600" />
                উদাহরণ ও সমাধান (Worked Examples)
              </h3>
              <div className="space-y-4">
                {lesson.worked_examples.map((ex, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="font-bold text-sm text-slate-900">
                      উদাহরণ {i + 1}: {ex.question_bn}
                    </div>
                    {ex.formula_used && (
                      <div className="text-xs text-teal-800 bg-teal-50 p-2 rounded-lg font-semibold inline-block">
                        ব্যবহৃত সূত্র: {ex.formula_used}
                      </div>
                    )}
                    <div className="space-y-1.5 text-xs text-slate-700 pl-3 border-l-2 border-teal-500">
                      <div className="font-semibold text-slate-600">সমাধান ধাপসমূহ:</div>
                      {ex.solution_steps_bn.map((st, sIdx) => (
                        <div key={sIdx}>{st}</div>
                      ))}
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-bold border border-emerald-200">
                      উত্তর: {ex.answer_bn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes & Exam Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 pt-8 border-t border-slate-100">
            {lesson.common_mistakes && lesson.common_mistakes.length > 0 && (
              <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  সাধারণ ভুল ধারণা (Common Mistakes)
                </h4>
                <ul className="space-y-2 text-xs text-rose-950">
                  {lesson.common_mistakes.map((mis, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{mis}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.exam_notes && lesson.exam_notes.length > 0 && (
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  পরীক্ষা প্রস্তুতি টিপস (Exam Notes)
                </h4>
                <ul className="space-y-2 text-xs text-blue-950">
                  {lesson.exam_notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick Revision summary */}
          {lesson.quick_revision && lesson.quick_revision.length > 0 && (
            <div className="mt-8 p-4 rounded-xl bg-slate-900 text-white text-xs">
              <span className="font-bold text-teal-400 block mb-1.5">দ্রুত পুনরাবৃত্তি (Quick Revision):</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-300">
                {lesson.quick_revision.map((rev, i) => (
                  <span key={i}>✓ {rev}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Personal Notes Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs mb-8 no-print">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              ব্যক্তিগত নোট (Private Student Notes)
            </h3>
            {noteSavedMessage && (
              <span className="text-xs text-teal-600 font-semibold animate-in fade-in">
                নোট সংরক্ষিত হয়েছে ✓
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            এই পাঠ সম্পর্কিত আপনার নিজস্ব সারাংশ বা মনে রাখার পয়েন্ট এখানে লিখে রাখুন। এটি সম্পূর্ণ ব্যক্তিগত এবং আপনার ড্যাশবোর্ডে সংরক্ষিত থাকবে।
          </p>
          <textarea
            rows={3}
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            placeholder="আপনার প্রয়োজনীয় নোট লিখুন..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={handleSaveNote}
              disabled={isSavingNote}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              {isSavingNote ? 'সংরক্ষণ হচ্ছে...' : 'নোট সংরক্ষণ করুন'}
            </button>
          </div>
        </div>

        {/* Relevant Practice Questions */}
        {relatedQuestions && relatedQuestions.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs mb-8 no-print">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              পাঠ সংশ্লিষ্ট অনুশীলন প্রশ্ন
            </h3>
            <div className="space-y-4">
              {relatedQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="font-semibold text-xs sm:text-sm text-slate-800 mb-2">
                    {idx + 1}. {q.question_bn}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600">
                        {['ক', 'খ', 'গ', 'ঘ'][oIdx]}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 text-center">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                অধ্যায়ের পূর্ণাঙ্গ কুইজ দিন <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Previous & Next Navigation */}
        <div className="flex items-center justify-between gap-4 pt-4 no-print">
          {prevLesson ? (
            <Link
              href={`/lessons/${prevLesson.slug}`}
              className="flex-1 p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-colors text-left"
            >
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> পূর্ববর্তী পাঠ
              </div>
              <div className="font-semibold text-xs sm:text-sm text-slate-800 truncate mt-0.5">
                {prevLesson.title_bn}
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextLesson && (
            <Link
              href={`/lessons/${nextLesson.slug}`}
              className="flex-1 p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-colors text-right"
            >
              <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                পরবর্তী পাঠ <ChevronRight className="w-3.5 h-3.5" />
              </div>
              <div className="font-semibold text-xs sm:text-sm text-slate-800 truncate mt-0.5">
                {nextLesson.title_bn}
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Report Error Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-500" /> ত্রুটি বা অসঙ্গতি রিপোর্ট করুন
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
                <h4 className="font-bold text-slate-800">রিপোর্ট জমা হয়েছে!</h4>
                <p className="text-xs text-slate-500">আমাদের একাডেমিক টিম দ্রুত পর্যালোচনা করে সংশোধন করবে। ধন্যবাদ।</p>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">রিপোর্টের ধরন:</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="বৈজ্ঞানিক তথ্যের অসঙ্গতি">বৈজ্ঞানিক তথ্যের অসঙ্গতি</option>
                    <option value="সমীকরণ বা চিহ্নের ভুল">সমীকরণ বা চিহ্নের ভুল</option>
                    <option value="বানান বা টাইপো">বানান বা টাইপো</option>
                    <option value="অন্যান্য বিষয়">অন্যান্য বিষয়</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">বিস্তারিত বিবরণ:</label>
                  <textarea
                    rows={4}
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    placeholder="কোথায় কী ধরনের ভুল বা অসঙ্গতি পরিলক্ষিত হয়েছে তা উল্লেখ করুন..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
                  >
                    রিপোর্ট পাঠান
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
