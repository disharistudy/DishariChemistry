'use client';

import React from 'react';
import { X, Atom, Sparkles, Flame, Layers, Thermometer, ShieldCheck } from 'lucide-react';
import { ElementData } from '@/lib/types';

interface ElementDetailModalProps {
  element: ElementData | null;
  onClose: () => void;
}

const CATEGORY_NAMES_BN: Record<string, string> = {
  'alkali-metal': 'ক্ষার ধাতু (Alkali Metal)',
  'alkaline-earth': 'মৃৎক্ষার ধাতু (Alkaline Earth Metal)',
  'transition-metal': 'অবস্থান্তর ধাতু (Transition Metal)',
  'post-transition': 'রূপান্তর-উত্তর ধাতু (Post-transition Metal)',
  'metalloid': 'অপধাতু বা উপধাতু (Metalloid)',
  'nonmetal': 'প্রতিক্রিয়াশীল অধাতু (Reactive Nonmetal)',
  'halogen': 'হ্যালোজেন (Halogen)',
  'noble-gas': 'নিষ্ক্রিয় গ্যাস (Noble Gas)',
  'lanthanide': 'ল্যান্থানাইড (Lanthanide)',
  'actinide': 'অ্যাক্টিনাইড (Actinide)'
};

const CATEGORY_COLORS: Record<string, string> = {
  'alkali-metal': 'bg-rose-500 text-white',
  'alkaline-earth': 'bg-amber-500 text-white',
  'transition-metal': 'bg-blue-600 text-white',
  'post-transition': 'bg-teal-600 text-white',
  'metalloid': 'bg-cyan-600 text-white',
  'nonmetal': 'bg-indigo-600 text-white',
  'halogen': 'bg-violet-600 text-white',
  'noble-gas': 'bg-purple-600 text-white',
  'lanthanide': 'bg-emerald-600 text-white',
  'actinide': 'bg-orange-600 text-white'
};

export default function ElementDetailModal({ element, onClose }: ElementDetailModalProps) {
  if (!element) return null;

  const categoryName = CATEGORY_NAMES_BN[element.category] || element.category;
  const categoryColor = CATEGORY_COLORS[element.category] || 'bg-slate-700 text-white';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`p-6 ${categoryColor} flex items-start justify-between relative`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center shadow-inner">
              <span className="text-[11px] font-mono leading-none opacity-90">{element.atomic_number}</span>
              <span className="text-2xl font-bold font-mono tracking-tight leading-none mt-0.5">{element.symbol}</span>
              <span className="text-[10px] opacity-80 mt-0.5">{element.atomic_mass.toFixed(2)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">{element.name_bn}</h3>
                <span className="text-sm opacity-90 text-white/80 font-sans">({element.name_en})</span>
              </div>
              <div className="text-xs text-white/90 font-medium mt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-black/20 text-white">
                  {categoryName}
                </span>
                <span>•</span>
                <span>ব্লক: {element.block.toUpperCase()}</span>
                <span>•</span>
                <span>পর্যায়: {element.period}, গ্রুপ: {element.group}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/20 text-white hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Scientific Properties Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Atom className="w-4 h-4 text-teal-600" />
              ভৌত ও পারমাণবিক বৈশিষ্ট্য
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">ইলেকট্রন বিন্যাস</span>
                <span className="text-sm font-semibold font-mono text-slate-800 break-all">{element.electron_configuration}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">জারণ অবস্থা</span>
                <span className="text-sm font-semibold text-slate-800">{element.oxidation_states || 'N/A'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">কক্ষ তাপমাত্রায় দশা</span>
                <span className="text-sm font-semibold text-slate-800">
                  {element.phase === 'Gas' ? 'বায়বীয় / গ্যাস' : element.phase === 'Liquid' ? 'তরল' : 'কঠিন'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">আপেক্ষিক পারমাণবিক ভর</span>
                <span className="text-sm font-semibold text-slate-800">{element.atomic_mass} u</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">তড়িৎ ঋণাত্মকতা (Pauling)</span>
                <span className="text-sm font-semibold text-slate-800">
                  {element.electronegativity ? element.electronegativity.toFixed(2) : 'প্রযোজ্য নয়'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">গলনাঙ্ক / স্ফুটনাঙ্ক (K)</span>
                <span className="text-sm font-semibold text-slate-800">
                  {element.melting_point ? `${element.melting_point} K` : '—'} / {element.boiling_point ? `${element.boiling_point} K` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Bengali Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              মৌল পরিচিতি ও বৈজ্ঞানিক তাৎপর্য
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60">
              {element.summary_bn}
            </p>
          </div>

          {/* Educational Applications */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              বাস্তব ও শিল্পক্ষেত্রে ব্যবহার
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/60">
              {element.applications_bn}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
