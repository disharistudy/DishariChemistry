'use client';

import React, { useState, useEffect } from 'react';
import { QuizSet, Question } from '@/lib/types';
import confetti from 'canvas-confetti';
import {
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Award,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

interface SafeQuestion {
  id: string;
  quiz_set_id: string;
  question_bn: string;
  question_type: string;
  options: string[];
  marks: number;
  difficulty: string;
}

interface GradedQuestion extends Question {
  studentAnswer: number | undefined;
  isCorrect: boolean;
}

interface QuizRunnerProps {
  quizSet: QuizSet;
  initialQuestions: SafeQuestion[];
}

export default function QuizRunner({ quizSet, initialQuestions }: QuizRunnerProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(quizSet.duration_minutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    totalMarks: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    gradedQuestions: GradedQuestion[];
  } | null>(null);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/quiz/${quizSet.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult({
          score: data.attempt.score,
          totalMarks: data.attempt.total_marks,
          correctCount: data.attempt.correct_count,
          incorrectCount: data.attempt.incorrect_count,
          unansweredCount: data.attempt.unanswered_count,
          gradedQuestions: data.gradedQuestions
        });

        // Trigger celebration if passed
        const percentage = (data.attempt.score / (data.attempt.total_marks || 1)) * 100;
        if (percentage >= quizSet.pass_marks_percent) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // ignore confetti error
          }
        }
      }
    } catch (e) {
      console.error('Quiz submission error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (result) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  // Timer countdown
  useEffect(() => {
    if (!hasStarted || result) return;

    if (timeLeftSeconds <= 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, timeLeftSeconds, result]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Pre-quiz instructions screen
  if (!hasStarted && !result) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="text-center space-y-3 pb-6 border-b border-slate-100">
          <div className="inline-flex p-3 rounded-2xl bg-teal-50 text-teal-700">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{quizSet.title_bn}</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">{quizSet.description_bn}</p>
        </div>

        <div className="py-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            পরীক্ষার নির্দেশনা ও নম্বর বিন্যাস:
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">মোট প্রশ্ন</span>
              <span className="font-bold text-slate-800">{initialQuestions.length} টি MCQ</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">সময়সীমা</span>
              <span className="font-bold text-slate-800">{quizSet.duration_minutes} মিনিট</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">পাস নম্বর</span>
              <span className="font-bold text-slate-800">{quizSet.pass_marks_percent}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">নেগেটিভ মার্কিং</span>
              <span className="font-bold text-rose-600">-{quizSet.negative_marking_per_question} প্রতি ভুল উত্তরে</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              কুইজ শুরু করার পর ঘড়ি চলতে থাকবে। সময় সমাপ্ত হওয়ার পূর্বে অথবা সমস্ত প্রশ্নের উত্তর দিয়ে ‘সাবমিট’ বাটনে চাপলে স্বয়ংক্রিয়ভাবে সার্ভার-সাইড মূল্যায়ন ও ফলাফল প্রকাশ পাবে।
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setHasStarted(true)}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
        >
          কুইজ শুরু করুন <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Result / Evaluation Screen
  if (result) {
    const percentage = Math.round((result.score / (result.totalMarks || 1)) * 100);
    const isPassed = percentage >= quizSet.pass_marks_percent;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score Card */}
        <div className={`p-6 sm:p-8 rounded-2xl border text-center ${
          isPassed ? 'bg-gradient-to-b from-teal-50 to-white border-teal-300' : 'bg-gradient-to-b from-amber-50 to-white border-amber-300'
        }`}>
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-md">
            {isPassed ? (
              <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-9 h-9" />
              </div>
            )}
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            {isPassed ? 'অভিনন্দন! আপনি সফলভাবে উত্তীর্ণ হয়েছেন' : 'অনুশীলন অব্যাহত রাখুন'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{quizSet.title_bn}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 max-w-lg mx-auto">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block">প্রাপ্ত নম্বর</span>
              <span className="text-xl font-bold text-teal-700">{result.score} / {result.totalMarks}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block">সঠিক উত্তর</span>
              <span className="text-xl font-bold text-emerald-600">{result.correctCount}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block">ভুল উত্তর</span>
              <span className="text-xl font-bold text-rose-600">{result.incorrectCount}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block">উত্তরহীন</span>
              <span className="text-xl font-bold text-slate-600">{result.unansweredCount}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
                setTimeLeftSeconds(quizSet.duration_minutes * 60);
                setCurrentIdx(0);
                setHasStarted(false);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> পুনরায় পরীক্ষা দিন
            </button>
            <Link
              href="/quiz"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              অন্যান্য কুইজে যান <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Detailed Question Explanations */}
        <div className="space-y-4">
          <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            প্রশ্নভিত্তিক পর্যালোচনা ও বাংলা ব্যাখ্যা ({result.gradedQuestions.length} টি)
          </h4>

          {result.gradedQuestions.map((q, idx) => {
            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border bg-white shadow-xs space-y-3 ${
                  q.isCorrect ? 'border-emerald-200' : q.studentAnswer !== undefined ? 'border-rose-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-sm text-slate-900">
                    <span className="text-teal-700 font-bold mr-1.5">প্রশ্ন {idx + 1}:</span>
                    {q.question_bn}
                  </div>
                  {q.isCorrect ? (
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> সঠিক (+{q.marks})
                    </span>
                  ) : q.studentAnswer !== undefined ? (
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> ভুল (-{quizSet.negative_marking_per_question})
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      উত্তর দেননি
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isCorrectAnswer = optIdx === q.correct_option_index;
                    const isSelected = optIdx === q.studentAnswer;

                    let optionStyle = 'bg-slate-50 border-slate-200 text-slate-700';
                    if (isCorrectAnswer) {
                      optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                    } else if (isSelected && !q.isCorrect) {
                      optionStyle = 'bg-rose-50 border-rose-300 text-rose-800 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center font-bold text-[10px]">
                            {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrectAnswer && (
                          <span className="text-[10px] text-emerald-700 font-bold">সঠিক উত্তর ✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation_bn && (
                  <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/60 text-xs text-teal-950">
                    <span className="font-bold text-teal-800 block mb-0.5">ব্যাখ্যা:</span>
                    {q.explanation_bn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Quiz Answering View
  const currentQ = initialQuestions[currentIdx];
  const selectedOption = answers[currentQ?.id];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Top bar: Title + Timer + Progress */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900">{quizSet.title_bn}</h3>
          <span className="text-xs text-slate-400">
            প্রশ্ন {currentIdx + 1} / {initialQuestions.length}
          </span>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-sm font-bold ${
          timeLeftSeconds < 120 ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <Timer className="w-4 h-4" />
          <span>{formatTime(timeLeftSeconds)}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>ক্যাটাগরি: {currentQ.difficulty === 'easy' ? 'সহজ' : currentQ.difficulty === 'hard' ? 'উচ্চতর দক্ষতা' : 'মাঝারি'}</span>
            <span>নম্বর: {currentQ.marks}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {currentIdx + 1}. {currentQ.question_bn}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedOption === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                className={`w-full p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/80 text-teal-950 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> পূর্ববর্তী প্রশ্ন
          </button>

          {currentIdx < initialQuestions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              পরবর্তী প্রশ্ন <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-1.5"
            >
              {isSubmitting ? 'মূল্যায়ন হচ্ছে...' : 'কুইজ সাবমিট করুন'}
            </button>
          )}
        </div>
      </div>

      {/* Question palette drawer */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-semibold text-slate-500 block mb-2">প্রশ্ন তালিকা:</span>
        <div className="flex flex-wrap gap-2">
          {initialQuestions.map((q, i) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = currentIdx === i;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'ring-2 ring-teal-600 bg-teal-600 text-white'
                    : isAnswered
                    ? 'bg-teal-100 text-teal-800 border border-teal-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
