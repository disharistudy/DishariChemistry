'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Layers, Atom, Flame, Calculator, ArrowRight, X } from 'lucide-react';
import { Course, Chapter, Lesson, ElementData, ChemicalReaction, FormulaRecord } from '@/lib/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    courses: Course[];
    chapters: Chapter[];
    lessons: Lesson[];
    elements: ElementData[];
    reactions: ChemicalReaction[];
    formulas: FormulaRecord[];
  }>({
    courses: [],
    chapters: [],
    lessons: [],
    elements: [],
    reactions: [],
    formulas: []
  });

  const executeSearch = async (q: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        executeSearch(query.trim());
      } else {
        setResults({ courses: [], chapters: [], lessons: [], elements: [], reactions: [], formulas: [] });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const totalResults =
    results.courses.length +
    results.chapters.length +
    results.lessons.length +
    results.elements.length +
    results.reactions.length +
    results.formulas.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Big Search Input */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            সার্বজনীন অনুসন্ধান (Global Search)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            কোর্স, অধ্যায়, রসায়ন পাঠ, পর্যায় সারণির মৌল, রাসায়নিক বিক্রিয়া ও গাণিতিক সূত্রে বাংলা ও ইংরেজিতে খুঁজুন।
          </p>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            placeholder="অনুসন্ধান করুন (যেমন: আউফবাউ, কোয়ান্টাম, মিথেন, Fe, Na, বোর মডেল, PV=nRT, বা ব্রোমিন)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-base shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Type Filter */}
        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          {[
            { id: 'all', label: `সব ফলাফল (${totalResults})` },
            { id: 'lessons', label: `পাঠ (${results.lessons.length})` },
            { id: 'elements', label: `মৌল (${results.elements.length})` },
            { id: 'reactions', label: `বিক্রিয়া (${results.reactions.length})` },
            { id: 'formulas', label: `সূত্র (${results.formulas.length})` },
            { id: 'courses', label: `কোর্স ও অধ্যায় (${results.courses.length + results.chapters.length})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {isLoading && (
          <div className="text-center py-8 text-slate-400 text-sm">
            অনুসন্ধান হচ্ছে...
          </div>
        )}

        {!isLoading && query.trim() && totalResults === 0 && (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <h3 className="font-bold text-slate-700">কোনো ফলাফল পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400">
              বানান পরিবর্তন করে অথবা ইংরেজি বৈজ্ঞানিক শব্দ দিয়ে পুনরায় অনুসন্ধান করুন।
            </p>
          </div>
        )}

        {/* 1. Lessons Results */}
        {(filterType === 'all' || filterType === 'lessons') && results.lessons.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              পাঠমালা ({results.lessons.length}টি)
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {results.lessons.map(les => (
                <Link
                  key={les.id}
                  href={`/lessons/${les.slug}`}
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-teal-700">
                      পড়ার সময়: {les.reading_time_minutes} মিনিট
                    </span>
                    <h4 className="font-bold text-base text-slate-900 group-hover:text-teal-700">
                      {les.title_bn}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {les.introduction}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 2. Elements Results */}
        {(filterType === 'all' || filterType === 'elements') && results.elements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Atom className="w-4 h-4 text-cyan-600" />
              পর্যায় সারণির মৌল ({results.elements.length}টি)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {results.elements.map(el => (
                <Link
                  key={el.atomic_number}
                  href={`/periodic-table`}
                  className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-cyan-400 shadow-xs transition-all flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 flex flex-col items-center justify-center font-mono shrink-0">
                    <span className="text-[10px] leading-none text-slate-400">{el.atomic_number}</span>
                    <span className="text-base font-bold leading-none mt-0.5">{el.symbol}</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{el.name_bn}</h5>
                    <span className="text-xs text-slate-400 font-sans">{el.name_en} ({el.atomic_mass} u)</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 3. Reactions Results */}
        {(filterType === 'all' || filterType === 'reactions') && results.reactions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              রাসায়নিক বিক্রিয়া ({results.reactions.length}টি)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.reactions.map(rxn => (
                <Link
                  key={rxn.id}
                  href="/reactions"
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 shadow-xs transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-bold">
                      {rxn.category_bn}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900">{rxn.title_bn}</h5>
                  <div className="p-2 bg-slate-900 text-teal-300 rounded-lg text-xs font-mono font-bold truncate">
                    {rxn.balanced_equation}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 4. Formulas Results */}
        {(filterType === 'all' || filterType === 'formulas') && results.formulas.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-teal-600" />
              গাণিতিক সূত্র ({results.formulas.length}টি)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.formulas.map(f => (
                <Link
                  key={f.id}
                  href="/formulas"
                  className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 shadow-xs transition-all space-y-2"
                >
                  <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">
                    {f.category_bn}
                  </span>
                  <h5 className="font-bold text-sm text-slate-900">{f.name_bn}</h5>
                  <div className="p-2 bg-slate-100 rounded-lg text-xs font-mono text-slate-800 truncate">
                    {f.latex_expression}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
