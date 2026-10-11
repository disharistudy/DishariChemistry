import React from 'react';
import { db } from '@/lib/db/store';
import PeriodicTableGrid from '@/components/PeriodicTableGrid';
import { TableProperties, Sparkles, Atom } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PeriodicTablePage() {
  const elements = db.getElements();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Atom className="w-3.5 h-3.5" /> আন্তর্জাতিক IUPAC স্বীকৃত
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            ইন্টারঅ্যাক্টিভ পর্যায় সারণি (Periodic Table)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ১১৮টি মৌলিক পদার্থের পারমাণবিক সংখ্যা, আপেক্ষিক পারমাণবিক ভর, ইলেকট্রন বিন্যাস, জারণ অবস্থা, দশা এবং বাংলা নামকরণের সম্পূর্ণ ইন্টারঅ্যাক্টিভ ডিরেক্টরি।
          </p>
        </div>
      </div>

      {/* Grid Component */}
      <PeriodicTableGrid elements={elements} />
    </div>
  );
}
