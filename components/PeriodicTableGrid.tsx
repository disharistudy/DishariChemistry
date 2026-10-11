'use client';

import React, { useState, useMemo } from 'react';
import { ElementData } from '@/lib/types';
import ElementDetailModal from './ElementDetailModal';
import { Search, Filter, Sparkles, Layers, Info } from 'lucide-react';

interface PeriodicTableGridProps {
  elements: ElementData[];
}

const CATEGORY_MAP: Record<string, { label: string; bg: string; hover: string; border: string }> = {
  'alkali-metal': { label: 'ক্ষার ধাতু', bg: 'bg-rose-100 text-rose-800', hover: 'hover:bg-rose-200', border: 'border-rose-300' },
  'alkaline-earth': { label: 'মৃৎক্ষার ধাতু', bg: 'bg-amber-100 text-amber-800', hover: 'hover:bg-amber-200', border: 'border-amber-300' },
  'transition-metal': { label: 'অবস্থান্তর ধাতু', bg: 'bg-blue-100 text-blue-800', hover: 'hover:bg-blue-200', border: 'border-blue-300' },
  'post-transition': { label: 'রূপান্তর-উত্তর ধাতু', bg: 'bg-teal-100 text-teal-800', hover: 'hover:bg-teal-200', border: 'border-teal-300' },
  'metalloid': { label: 'অপধাতু', bg: 'bg-cyan-100 text-cyan-800', hover: 'hover:bg-cyan-200', border: 'border-cyan-300' },
  'nonmetal': { label: 'অধাতু', bg: 'bg-indigo-100 text-indigo-800', hover: 'hover:bg-indigo-200', border: 'border-indigo-300' },
  'halogen': { label: 'হ্যালোজেন', bg: 'bg-violet-100 text-violet-800', hover: 'hover:bg-violet-200', border: 'border-violet-300' },
  'noble-gas': { label: 'নিষ্ক্রিয় গ্যাস', bg: 'bg-purple-100 text-purple-800', hover: 'hover:bg-purple-200', border: 'border-purple-300' },
  'lanthanide': { label: 'ল্যান্থানাইড', bg: 'bg-emerald-100 text-emerald-800', hover: 'hover:bg-emerald-200', border: 'border-emerald-300' },
  'actinide': { label: 'অ্যাক্টিনাইড', bg: 'bg-orange-100 text-orange-800', hover: 'hover:bg-orange-200', border: 'border-orange-300' },
};

export default function PeriodicTableGrid({ elements }: PeriodicTableGridProps) {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activePhase, setActivePhase] = useState<string>('all');

  const elementsMap = useMemo(() => {
    const map = new Map<number, ElementData>();
    elements.forEach(el => map.set(el.atomic_number, el));
    return map;
  }, [elements]);

  const filteredMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return new Set(
      elements.filter(el => {
        const matchesQuery = !q ||
          el.symbol.toLowerCase().includes(q) ||
          el.name_en.toLowerCase().includes(q) ||
          el.name_bn.includes(searchQuery.trim()) ||
          String(el.atomic_number) === q;

        const matchesCategory = activeCategory === 'all' || el.category === activeCategory;
        const matchesPhase = activePhase === 'all' || el.phase.toLowerCase() === activePhase.toLowerCase();

        return matchesQuery && matchesCategory && matchesPhase;
      }).map(el => el.atomic_number)
    );
  }, [elements, searchQuery, activeCategory, activePhase]);

  // Standard periodic table coordinates (Period 1-7, Group 1-18)
  // Lanthanides (57-71) in period 6, Actinides (89-103) in period 7
  const isLanthanide = (z: number) => z >= 57 && z <= 71;
  const isActinide = (z: number) => z >= 89 && z <= 103;

  return (
    <div className="space-y-6">
      {/* Controls: Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="মৌল খুঁজুন (প্রতীক যেমন Fe, নাম লোহা / Iron, বা সংখ্যা 26)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              মুছুন
            </button>
          )}
        </div>

        {/* Phase filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1">দশা:</span>
          {['all', 'Solid', 'Liquid', 'Gas'].map(phase => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                activePhase === phase
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {phase === 'all' ? 'সকল' : phase === 'Solid' ? 'কঠিন' : phase === 'Liquid' ? 'তরল' : 'গ্যাস'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Legend */}
      <div className="flex flex-wrap items-center gap-1.5 p-3 bg-white rounded-xl border border-slate-200 text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          সকল মৌল (১১৮)
        </button>
        {Object.entries(CATEGORY_MAP).map(([key, cat]) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(isActive ? 'all' : key)}
              className={`px-2.5 py-1 rounded-lg font-medium border transition-all ${cat.bg} ${cat.border} ${
                isActive ? 'ring-2 ring-slate-800 scale-105' : 'opacity-85 hover:opacity-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Table Notice & Mobile Scroll indicator */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          যে কোনো মৌলে ক্লিক করে সম্পূর্ণ বাংলা তথ্য, ইলেকট্রন বিন্যাস ও ধর্ম দেখুন
        </span>
        <span className="text-[11px] text-teal-700 font-semibold sm:hidden flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
          ↔️ স্ক্রোল করুন
        </span>
      </div>

      {/* Main Table Grid (Scrollable for smaller screens) */}
      <div className="overflow-x-auto pb-4 pt-1">
        <div className="min-w-[980px] bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* Main Grid: 7 Periods x 18 Groups */}
          <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1.5">
            {Array.from({ length: 7 }, (_, r) => {
              const period = r + 1;
              return Array.from({ length: 18 }, (_, c) => {
                const group = c + 1;

                // Find element for period and group, excluding lanthanides & actinides placeholders
                let el: ElementData | undefined;

                if (period === 6 && group === 3) {
                  // Lanthanide marker
                  return (
                    <div
                      key={`lanth-marker-${period}-${group}`}
                      className="h-16 rounded-lg bg-emerald-50 border border-dashed border-emerald-300 flex flex-col items-center justify-center text-[10px] text-emerald-800 font-bold p-1 text-center"
                    >
                      <span>57-71</span>
                      <span className="text-[9px] leading-tight">ল্যান্থানাইড</span>
                    </div>
                  );
                }

                if (period === 7 && group === 3) {
                  // Actinide marker
                  return (
                    <div
                      key={`act-marker-${period}-${group}`}
                      className="h-16 rounded-lg bg-orange-50 border border-dashed border-orange-300 flex flex-col items-center justify-center text-[10px] text-orange-800 font-bold p-1 text-center"
                    >
                      <span>89-103</span>
                      <span className="text-[9px] leading-tight">অ্যাক্টিনাইড</span>
                    </div>
                  );
                }

                // Match element
                el = elements.find(e => e.period === period && e.group === group && !isLanthanide(e.atomic_number) && !isActinide(e.atomic_number));

                if (!el) {
                  return <div key={`empty-${period}-${group}`} className="h-16" />;
                }

                const catStyle = CATEGORY_MAP[el.category] || { bg: 'bg-slate-100 text-slate-800', hover: 'hover:bg-slate-200', border: 'border-slate-300' };
                const isMatch = filteredMatches.has(el.atomic_number);

                return (
                  <button
                    key={el.atomic_number}
                    type="button"
                    onClick={() => setSelectedElement(el)}
                    className={`h-16 rounded-lg border p-1 text-left flex flex-col justify-between transition-all cursor-pointer ${
                      catStyle.bg
                    } ${catStyle.border} ${catStyle.hover} ${
                      isMatch ? 'opacity-100 ring-1 ring-slate-900/40 shadow-xs' : 'opacity-25 grayscale'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                      <span>{el.atomic_number}</span>
                      <span className="text-[9px] opacity-75">{el.phase === 'Gas' ? '💨' : el.phase === 'Liquid' ? '💧' : ''}</span>
                    </div>
                    <div className="text-center font-bold font-mono text-sm leading-none my-0.5">
                      {el.symbol}
                    </div>
                    <div className="text-[9px] truncate text-center leading-none font-medium">
                      {el.name_bn}
                    </div>
                  </button>
                );
              });
            })}
          </div>

          {/* Separator */}
          <div className="my-6 border-t border-slate-200 relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 bg-white text-[11px] text-slate-400 font-medium uppercase">
              ল্যান্থানাইড ও অ্যাক্টিনাইড সারি (f-ব্লক মৌল)
            </span>
          </div>

          {/* Bottom Rows: Lanthanides (57-71) & Actinides (89-103) */}
          <div className="space-y-1.5 max-w-4xl mx-auto">
            {/* Lanthanides */}
            <div className="flex items-center gap-1.5">
              <div className="w-20 text-[10px] font-bold text-emerald-800 pl-1">
                ল্যান্থানাইড:
              </div>
              <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5 flex-1">
                {Array.from({ length: 15 }, (_, i) => {
                  const z = 57 + i;
                  const el = elementsMap.get(z);
                  if (!el) return <div key={z} className="h-16" />;
                  const isMatch = filteredMatches.has(z);
                  return (
                    <button
                      key={z}
                      onClick={() => setSelectedElement(el)}
                      className={`h-16 rounded-lg border p-1 text-left flex flex-col justify-between bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200 transition-all ${
                        isMatch ? 'opacity-100' : 'opacity-25 grayscale'
                      }`}
                    >
                      <span className="text-[10px] font-mono leading-none">{el.atomic_number}</span>
                      <span className="text-center font-bold font-mono text-sm leading-none">{el.symbol}</span>
                      <span className="text-[9px] truncate text-center leading-none">{el.name_bn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actinides */}
            <div className="flex items-center gap-1.5">
              <div className="w-20 text-[10px] font-bold text-orange-800 pl-1">
                অ্যাক্টিনাইড:
              </div>
              <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5 flex-1">
                {Array.from({ length: 15 }, (_, i) => {
                  const z = 89 + i;
                  const el = elementsMap.get(z);
                  if (!el) return <div key={z} className="h-16" />;
                  const isMatch = filteredMatches.has(z);
                  return (
                    <button
                      key={z}
                      onClick={() => setSelectedElement(el)}
                      className={`h-16 rounded-lg border p-1 text-left flex flex-col justify-between bg-orange-100 text-orange-900 border-orange-300 hover:bg-orange-200 transition-all ${
                        isMatch ? 'opacity-100' : 'opacity-25 grayscale'
                      }`}
                    >
                      <span className="text-[10px] font-mono leading-none">{el.atomic_number}</span>
                      <span className="text-center font-bold font-mono text-sm leading-none">{el.symbol}</span>
                      <span className="text-[9px] truncate text-center leading-none">{el.name_bn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Element Detail Modal */}
      <ElementDetailModal
        element={selectedElement}
        onClose={() => setSelectedElement(null)}
      />
    </div>
  );
}
