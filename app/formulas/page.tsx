import React from 'react';
import { db } from '@/lib/db/store';
import InteractiveCalculator from '@/components/InteractiveCalculator';
import KaTeXRenderer from '@/components/KaTeXRenderer';
import { Calculator, Sparkles, BookOpen, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FormulasPage() {
  const formulas = db.getFormulas();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Calculator className="w-3.5 h-3.5" /> গাণিতিক রসায়ন ও সমীকরণ
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            ফর্মুলা ও ক্যালকুলেশন সেন্টার
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            মোলারিটি, আদর্শ গ্যাস সমীকরণ, মোলের ধারণা, লঘুকরণ এবং pH এর লাইভ গণনা ও বিস্তারিত সমীকরণ ভাণ্ডার।
          </p>
        </div>
      </div>

      {/* 1. Live Interactive Calculator Tool */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            লাইভ ইন্টারঅ্যাক্টিভ ক্যালকুলেটর
          </h2>
          <span className="text-xs text-slate-400 font-medium">ইনপুট দিয়ে তাৎক্ষণিক সঠিক ফলাফল পান</span>
        </div>
        <InteractiveCalculator />
      </div>

      {/* 2. Comprehensive Formula Cards Repository */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            প্রয়োজনীয় রসায়ন সূত্রের তালিকা ও প্রতীক পরিচিতি
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            প্রতিটি সূত্রের প্রতীকসমূহের একক, প্রযোজ্যতা এবং বোর্ড স্ট্যান্ডার্ড উদাহরণ।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formulas.map((form) => (
            <div
              key={form.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {form.category_bn}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    একক: {form.units}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{form.name_bn}</h3>
                  <p className="text-xs text-slate-400 font-sans">{form.name_en}</p>
                </div>

                {/* Math Equation Box */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-center shadow-inner overflow-x-auto">
                  <KaTeXRenderer math={form.latex_expression} block />
                </div>

                {/* Symbol Explanations */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    প্রতীকের অর্থ ও একক:
                  </span>
                  <div className="space-y-1">
                    {form.symbols_explanation.map((sym, sIdx) => (
                      <div key={sIdx} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2 rounded-lg">
                        <span className="font-mono font-bold text-teal-800 shrink-0">{sym.symbol} :</span>
                        <span className="flex-1">{sym.meaning_bn}</span>
                        <span className="text-slate-400 text-[11px] shrink-0">({sym.unit})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assumptions / Conditions */}
                {form.assumptions_bn && (
                  <div className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                    <span className="font-bold text-amber-900">প্রযোজ্যতার শর্ত: </span>
                    {form.assumptions_bn}
                  </div>
                )}

                {/* Worked Example */}
                {form.worked_example && (
                  <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-200/60 space-y-2">
                    <div className="text-xs font-bold text-teal-900">উদাহরণ সমস্যা:</div>
                    <p className="text-xs text-slate-700">{form.worked_example.problem_bn}</p>
                    <div className="space-y-1 text-[11px] text-slate-600 font-mono pl-2 border-l-2 border-teal-500">
                      {form.worked_example.steps_bn.map((st, i) => (
                        <div key={i}>{st}</div>
                      ))}
                    </div>
                    <div className="text-xs font-bold text-teal-800 pt-1">
                      {form.worked_example.result_bn}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
