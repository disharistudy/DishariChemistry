'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lesson, Chapter, Course } from '@/lib/types';
import {
  FileText,
  PlusCircle,
  Save,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Editor form state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [readingTime, setReadingTime] = useState(10);
  const [introduction, setIntroduction] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('পরমাণুর গঠন ব্যাখ্যা করতে পারা।\nমৌলিক কণিকার ধর্ম জানা।');
  const [isPublished, setIsPublished] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/lessons');
      if (res.ok) {
        const data = await res.json();
        setLessons(data.lessons || []);
        setChapters(data.chapters || []);
        setCourses(data.courses || []);
        if (data.chapters && data.chapters.length > 0 && !chapterId) {
          setChapterId(data.chapters[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNewLesson = () => {
    setEditingLessonId(null);
    setTitleBn('');
    setTitleEn('');
    setSlug(`lesson-${Date.now()}`);
    setIntroduction('');
    setContentMarkdown('## ১. মূল তত্ত্ব ও ব্যাখ্যা\nএখানে পাঠের বিস্তারিত তত্ত্ব ও উদাহরণ লিখুন।');
    setLearningObjectives('শিখনফল ১\nশিখনফল ২');
    setIsPublished(true);
    setIsEditorOpen(true);
  };

  const openEditLesson = (les: Lesson) => {
    setEditingLessonId(les.id);
    setTitleBn(les.title_bn);
    setTitleEn(les.title_en || '');
    setSlug(les.slug);
    setChapterId(les.chapter_id);
    setReadingTime(les.reading_time_minutes);
    setIntroduction(les.introduction);
    setContentMarkdown(les.content_markdown);
    setLearningObjectives((les.learning_objectives || []).join('\n'));
    setIsPublished(les.is_published);
    setIsEditorOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const objectives = learningObjectives
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        id: editingLessonId || undefined,
        slug: slug.trim(),
        title_bn: titleBn.trim(),
        title_en: titleEn.trim() || undefined,
        chapter_id: chapterId,
        reading_time_minutes: Number(readingTime),
        learning_objectives: objectives,
        introduction: introduction.trim(),
        content_markdown: contentMarkdown.trim(),
        is_published: isPublished,
      };

      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setIsEditorOpen(false);
        }, 1500);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-amber-800 flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> অ্যাডমিন ড্যাশবোর্ড
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">পাঠ ব্যবস্থাপনা</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            রসায়ন পাঠ সম্পাদনা ও প্রকাশনা (Lesson Editor)
          </h1>
        </div>

        <button
          onClick={openNewLesson}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> নতুন পাঠ যুক্ত করুন
        </button>
      </div>

      {/* Editor Modal / Panel */}
      {isEditorOpen && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-teal-300 shadow-xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                {editingLessonId ? 'পাঠ সম্পাদনা করুন' : 'নতুন পাঠ তৈরি করুন'}
              </h3>
              <p className="text-xs text-slate-400">
                শিখনফল, সংজ্ঞা, সমীকরণ এবং ব্যাখ্যা যুক্ত করে পাঠ প্রকাশ করুন।
              </p>
            </div>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1 bg-slate-100 rounded-lg"
            >
              বন্ধ করুন
            </button>
          </div>

          <form onSubmit={handleSaveLesson} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পাঠের শিরোনাম (বাংলা):</label>
                <input
                  type="text"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="যেমন: পরমাণুর মূল কণিকা ও বোর মডেল"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ইংরেজি শিরোনাম (ঐচ্ছিক):</label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Atomic Structure & Bohr Model"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">অধ্যায় নির্বাচন:</label>
                <select
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {chapters.map(ch => (
                    <option key={ch.id} value={ch.id}>
                      {ch.title_bn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ইউআরএল স্লাগ (Slug):</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পড়ার সময় (মিনিট):</label>
                <input
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শিখনফল (প্রতি লাইনে একটি):</label>
              <textarea
                rows={3}
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ভূমিকা (Introduction):</label>
              <textarea
                rows={2}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পাঠের মূল বিষয়বস্তু (Markdown ও KaTeX):</label>
              <textarea
                rows={10}
                value={contentMarkdown}
                onChange={(e) => setContentMarkdown(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                পাঠটি ওয়েবসাইটে সরাসরি প্রকাশিত (Published) রাখুন
              </label>

              {saveSuccess && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> সংরক্ষিত হয়েছে!
                </span>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পাঠ সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Lessons List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            প্রকাশিত ও ড্রাফট পাঠ তালিকা ({lessons.length}টি)
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {lessons.map((les) => {
            const chap = chapters.find(c => c.id === les.chapter_id);
            return (
              <div
                key={les.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {chap ? chap.title_bn : 'অধ্যায়'}
                    </span>
                    <span className="text-slate-400">• {les.reading_time_minutes} মিনিট পাঠ</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">{les.title_bn}</h4>
                  <p className="text-xs text-slate-400 font-mono">slug: /lessons/{les.slug}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditLesson(les)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    সম্পাদনা
                  </button>
                  <Link
                    href={`/lessons/${les.slug}`}
                    className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    লাইভ পাঠ <ArrowRight className="w-3.5 h-3.5" />
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
