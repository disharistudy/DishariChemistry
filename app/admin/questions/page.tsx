'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Question, QuizSet } from '@/lib/types';
import {
  Award,
  PlusCircle,
  Save,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quizSetId, setQuizSetId] = useState('');
  const [questionBn, setQuestionBn] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanationBn, setExplanationBn] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [marks, setMarks] = useState(1.0);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/questions');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
        setQuizSets(data.quizSets || []);
        if (data.quizSets && data.quizSets.length > 0 && !quizSetId) {
          setQuizSetId(data.quizSets[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setQuestionBn('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setCorrectIdx(0);
    setExplanationBn('');
    setDifficulty('medium');
    setMarks(1.0);
    setIsFormOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditingId(q.id);
    setQuizSetId(q.quiz_set_id);
    setQuestionBn(q.question_bn);
    setOpt0(q.options[0] || '');
    setOpt1(q.options[1] || '');
    setOpt2(q.options[2] || '');
    setOpt3(q.options[3] || '');
    setCorrectIdx(q.correct_option_index);
    setExplanationBn(q.explanation_bn || '');
    setDifficulty(q.difficulty);
    setMarks(q.marks);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        id: editingId || undefined,
        quiz_set_id: quizSetId,
        question_bn: questionBn.trim(),
        question_type: 'mcq',
        options: [opt0.trim(), opt1.trim(), opt2.trim(), opt3.trim()],
        correct_option_index: Number(correctIdx),
        explanation_bn: explanationBn.trim(),
        difficulty,
        marks: Number(marks),
      };

      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          setIsFormOpen(false);
        }, 1500);
        fetchQuestions();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিতভাবে এই প্রশ্নটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchQuestions();
      }
    } catch (e) {
      console.error(e);
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
            <span className="font-semibold text-slate-800">প্রশ্ন ব্যাংক</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            প্রশ্ন ব্যাংক ও কুইজ ব্যবস্থাপনা
          </h1>
        </div>

        <button
          onClick={openNew}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> নতুন প্রশ্ন যুক্ত করুন
        </button>
      </div>

      {/* Question Form Modal / Box */}
      {isFormOpen && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-300 shadow-xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-lg text-slate-900">
              {editingId ? 'প্রশ্ন সম্পাদনা করুন' : 'নতুন MCQ প্রশ্ন যোগ করুন'}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1 bg-slate-100 rounded-lg"
            >
              বন্ধ করুন
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কুইজ সেট নির্বাচন:</label>
                <select
                  value={quizSetId}
                  onChange={(e) => setQuizSetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {quizSets.map(qs => (
                    <option key={qs.id} value={qs.id}>
                      {qs.title_bn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">কাঠিন্যের মাত্রা:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="easy">সহজ (Easy)</option>
                  <option value="medium">মাঝারি (Medium)</option>
                  <option value="hard">উচ্চতর দক্ষতা (Hard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">নম্বর (Marks):</label>
                <input
                  type="number"
                  step="0.5"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">প্রশ্নের বিবরণ (বাংলায়):</label>
              <textarea
                rows={2}
                value={questionBn}
                onChange={(e) => setQuestionBn(e.target.value)}
                placeholder="প্রশ্নটি লিখুন..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                required
              />
            </div>

            {/* 4 Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                চারটি অপশন এবং সঠিক উত্তর চিহ্নিত করুন:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctIdx === 0}
                    onChange={() => setCorrectIdx(0)}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <span className="font-bold text-xs text-slate-500">ক:</span>
                  <input
                    type="text"
                    value={opt0}
                    onChange={(e) => setOpt0(e.target.value)}
                    placeholder="অপশন ১"
                    className="w-full bg-transparent text-xs focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctIdx === 1}
                    onChange={() => setCorrectIdx(1)}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <span className="font-bold text-xs text-slate-500">খ:</span>
                  <input
                    type="text"
                    value={opt1}
                    onChange={(e) => setOpt1(e.target.value)}
                    placeholder="অপশন ২"
                    className="w-full bg-transparent text-xs focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctIdx === 2}
                    onChange={() => setCorrectIdx(2)}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <span className="font-bold text-xs text-slate-500">গ:</span>
                  <input
                    type="text"
                    value={opt2}
                    onChange={(e) => setOpt2(e.target.value)}
                    placeholder="অপশন ৩"
                    className="w-full bg-transparent text-xs focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctIdx === 3}
                    onChange={() => setCorrectIdx(3)}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <span className="font-bold text-xs text-slate-500">ঘ:</span>
                  <input
                    type="text"
                    value={opt3}
                    onChange={(e) => setOpt3(e.target.value)}
                    placeholder="অপশন ৪"
                    className="w-full bg-transparent text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">সঠিক উত্তরের ব্যাখ্যা (বাংলায়):</label>
              <textarea
                rows={2}
                value={explanationBn}
                onChange={(e) => setExplanationBn(e.target.value)}
                placeholder="কেন এই উত্তরটি সঠিক তার বিশদ বৈজ্ঞানিক ব্যাখ্যা দিন..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                রেডিও বাটনে ক্লিক করে সঠিক উত্তর চিহ্নিত করেছেন তো?
              </span>

              {successMsg && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> প্রশ্ন সংরক্ষিত হয়েছে!
                </span>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'প্রশ্ন সেভ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            প্রশ্ন ব্যাংক তালিকা ({questions.length}টি প্রশ্ন)
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {questions.map((q, idx) => {
            const qs = quizSets.find(s => s.id === q.quiz_set_id);
            return (
              <div
                key={q.id}
                className="p-5 space-y-3 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {qs ? qs.title_bn : 'কুইজ'}
                      </span>
                      <span className="text-slate-400">• নম্বর: {q.marks}</span>
                      <span className="text-slate-400">• কাঠিন্য: {q.difficulty}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {idx + 1}. {q.question_bn}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(q)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      সম্পাদনা
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === q.correct_option_index;
                    return (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-lg border ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {['ক', 'খ', 'গ', 'ঘ'][oIdx]}. {opt} {isCorrect && '✓'}
                      </div>
                    );
                  })}
                </div>

                {q.explanation_bn && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-700">ব্যাখ্যা: </strong> {q.explanation_bn}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
