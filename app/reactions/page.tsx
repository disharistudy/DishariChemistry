'use client';

import React, { useState, useEffect } from 'react';
import { ChemicalReaction } from '@/lib/types';
import { Flame, Search, Filter, AlertTriangle, Sparkles, BookOpen, Layers } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'সকল বিক্রিয়া' },
  { key: 'synthesis', label: 'সংযোজন বিক্রিয়া' },
  { key: 'decomposition', label: 'বিযোজন বিক্রিয়া' },
  { key: 'single_replacement', label: 'একক প্রতিস্থাপন' },
  { key: 'double_replacement', label: 'দ্বি-প্রতিস্থাপন' },
  { key: 'combustion', label: 'দহন বিক্রিয়া' },
  { key: 'redox', label: 'জারণ-বিজারণ' },
  { key: 'neutralization', label: 'প্রশমন বিক্রিয়া' },
  { key: 'organic', label: 'জৈব রাসায়নিক বিক্রিয়া' },
];

export default function ReactionsPage() {
  const [reactions, setReactions] = useState<ChemicalReaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReactions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());

      const res = await fetch(`/api/reactions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReactions(data.reactions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> ৮টি প্রধান ক্যাটাগরি
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            রাসায়নিক বিক্রিয়া লাইব্রেরি (Chemical Reactions)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            বিক্রিয়ার সমতাকৃত সমীকরণ, প্রভাবক ও তাপমাত্রা-চাপের শর্ত, চাক্ষুষ পর্যবেক্ষণ, বিক্রিয়ার ব্যাখ্যা এবং নিরাপত্তা সতর্কতা।
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="বিক্রিয়া খুঁজুন (যেমন: হেবার পদ্ধতি, মিথেন দহন, AgNO3, HCl, বা অম্ল-ক্ষার)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.key
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reactions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>মোট বিক্রিয়া পাওয়া গেছে: {reactions.length}টি</span>
          <span>সমতাকৃত ও পরীক্ষিত</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            বিক্রিয়া লোড হচ্ছে...
          </div>
        ) : reactions.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-slate-500 text-sm">
            আপনার অনুসন্ধানের সাথে কোনো বিক্রিয়া খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reactions.map((rxn) => (
              <div
                key={rxn.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {rxn.category_bn}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {rxn.chapter_reference}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">
                    {rxn.title_bn}
                  </h3>

                  {/* Balanced Equation Box */}
                  <div className="p-3.5 bg-slate-900 text-teal-300 rounded-xl font-mono text-sm sm:text-base font-bold overflow-x-auto shadow-inner">
                    {rxn.balanced_equation}
                  </div>

                  {/* Reactants and Products breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 block text-[10px]">বিক্রিয়ক (Reactants):</span>
                      <span className="font-semibold text-slate-800">{rxn.reactants}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 block text-[10px]">উৎপাদ (Products):</span>
                      <span className="font-semibold text-slate-800">{rxn.products}</span>
                    </div>
                  </div>

                  {/* Conditions */}
                  {rxn.conditions && (
                    <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                      <span className="font-bold text-amber-900">প্রয়োজনীয় শর্ত: </span>
                      {rxn.conditions}
                    </div>
                  )}

                  {/* Observation & Explanation */}
                  <div className="space-y-2 text-xs text-slate-700">
                    {rxn.observation_bn && (
                      <p>
                        <span className="font-bold text-slate-900">চাক্ষুষ পর্যবেক্ষণ: </span>
                        {rxn.observation_bn}
                      </p>
                    )}
                    <p className="leading-relaxed">
                      <span className="font-bold text-slate-900">ব্যাখ্যা: </span>
                      {rxn.explanation_bn}
                    </p>
                  </div>
                </div>

                {/* Safety Warning */}
                {rxn.safety_notes_bn && (
                  <div className="mt-3 p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong className="text-rose-950">নিরাপত্তা সতর্কতা:</strong> {rxn.safety_notes_bn}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
