'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import KaTeXRenderer from './KaTeXRenderer';

export default function InteractiveCalculator() {
  const [activeTab, setActiveTab] = useState<'molarity' | 'ideal_gas' | 'mole' | 'dilution' | 'ph'>('molarity');

  // 1. Molarity State
  const [molW, setMolW] = useState<string>('5.3'); // g
  const [molM, setMolM] = useState<string>('106'); // g/mol (Na2CO3)
  const [molV, setMolV] = useState<string>('250'); // mL
  const [molResult, setMolResult] = useState<{
    s: number;
    steps: string[];
    classification: string;
  } | null>(null);
  const [molError, setMolError] = useState<string>('');

  // 2. Ideal Gas State
  const [gasP, setGasP] = useState<string>('2'); // atm
  const [gasV, setGasV] = useState<string>('5'); // L
  const [gasT, setGasT] = useState<string>('27'); // Celsius
  const [gasResult, setGasResult] = useState<{
    n: number;
    kelvin: number;
    steps: string[];
  } | null>(null);
  const [gasError, setGasError] = useState<string>('');

  // 3. Mole State
  const [moleW, setMoleW] = useState<string>('44'); // g (CO2)
  const [moleM, setMoleM] = useState<string>('44'); // g/mol
  const [moleResult, setMoleResult] = useState<{
    n: number;
    particles: string;
    volStp: number;
    steps: string[];
  } | null>(null);
  const [moleError, setMoleError] = useState<string>('');

  // 4. Dilution State
  const [dilV1, setDilV1] = useState<string>('50'); // mL
  const [dilS1, setDilS1] = useState<string>('2'); // M
  const [dilS2, setDilS2] = useState<string>('0.5'); // M
  const [dilResult, setDilResult] = useState<{
    v2: number;
    waterNeeded: number;
    steps: string[];
  } | null>(null);
  const [dilError, setDilError] = useState<string>('');

  // 5. pH State
  const [phInput, setPhInput] = useState<string>('0.001'); // mol/L
  const [phResult, setPhResult] = useState<{
    ph: number;
    poh: number;
    nature: string;
    steps: string[];
  } | null>(null);
  const [phError, setPhError] = useState<string>('');

  // --- Handlers ---
  const calculateMolarity = (e: React.FormEvent) => {
    e.preventDefault();
    setMolError('');
    const w = parseFloat(molW);
    const m = parseFloat(molM);
    const v = parseFloat(molV);

    if (isNaN(w) || isNaN(m) || isNaN(v) || w <= 0 || m <= 0 || v <= 0) {
      setMolError('অনুগ্রহ করে সঠিক ধনাত্মক সংখ্যা প্রদান করুন (ভর, আণবিক ভর ও আয়তন > ০ হতে হবে)।');
      setMolResult(null);
      return;
    }

    const s = (w * 1000) / (m * v);
    const roundedS = Math.round(s * 10000) / 10000;

    let classification = 'সাধারণ দ্রবণ';
    if (Math.abs(roundedS - 1.0) < 0.01) classification = 'মোলার দ্রবণ (1 M)';
    else if (Math.abs(roundedS - 0.5) < 0.01) classification = 'সেমিমোলার দ্রবণ (0.5 M)';
    else if (Math.abs(roundedS - 0.1) < 0.01) classification = 'ডেসিমোলার দ্রবণ (0.1 M)';
    else if (Math.abs(roundedS - 0.01) < 0.001) classification = 'সেন্টিমোলার দ্রবণ (0.01 M)';

    setMolResult({
      s: roundedS,
      classification,
      steps: [
        `সূত্র: S = (W × 1000) / (M × V)`,
        `মান বসিয়ে: S = (${w} × 1000) / (${m} × ${v})`,
        `S = ${w * 1000} / ${m * v} = ${roundedS} M (মোল/লিটার)`
      ]
    });
  };

  const calculateGas = (e: React.FormEvent) => {
    e.preventDefault();
    setGasError('');
    const p = parseFloat(gasP);
    const v = parseFloat(gasV);
    const t = parseFloat(gasT);

    if (isNaN(p) || isNaN(v) || isNaN(t) || p <= 0 || v <= 0 || t < -273.15) {
      setGasError('চাপ ও আয়তন ধনাত্মক হতে হবে এবং তাপমাত্রা পরম শূন্যের (-২৭৩.১৫°C) উপরে হতে হবে।');
      setGasResult(null);
      return;
    }

    const kelvin = t + 273.15;
    const R = 0.0821; // L*atm/(mol*K)
    const n = (p * v) / (R * kelvin);
    const roundedN = Math.round(n * 10000) / 10000;

    setGasResult({
      n: roundedN,
      kelvin: Math.round(kelvin * 100) / 100,
      steps: [
        `পরম তাপমাত্রা T = ${t} + 273.15 = ${Math.round(kelvin * 100) / 100} K`,
        `গ্যাস ধ্রুবক R = 0.0821 L·atm/(mol·K)`,
        `সূত্র: n = (P × V) / (R × T)`,
        `n = (${p} × ${v}) / (0.0821 × ${Math.round(kelvin * 100) / 100}) = ${roundedN} mol`
      ]
    });
  };

  const calculateMole = (e: React.FormEvent) => {
    e.preventDefault();
    setMoleError('');
    const w = parseFloat(moleW);
    const m = parseFloat(moleM);

    if (isNaN(w) || isNaN(m) || w <= 0 || m <= 0) {
      setMoleError('ভর ও মোলার ভর শূন্যের বেশি হতে হবে।');
      setMoleResult(null);
      return;
    }

    const n = w / m;
    const roundedN = Math.round(n * 10000) / 10000;
    const avogadro = 6.022e23;
    const totalParticles = (n * avogadro).toExponential(3);
    const volStp = Math.round(n * 22.4 * 100) / 100;

    setMoleResult({
      n: roundedN,
      particles: totalParticles,
      volStp,
      steps: [
        `মোল সংখ্যা n = W / M = ${w} / ${m} = ${roundedN} mol`,
        `মোট কণা N = n × N_A = ${roundedN} × (6.022 × 10²³) = ${totalParticles} টি অণু`,
        `STP তে আয়তন = n × 22.4 L = ${roundedN} × 22.4 = ${volStp} লিটার`
      ]
    });
  };

  const calculateDilution = (e: React.FormEvent) => {
    e.preventDefault();
    setDilError('');
    const v1 = parseFloat(dilV1);
    const s1 = parseFloat(dilS1);
    const s2 = parseFloat(dilS2);

    if (isNaN(v1) || isNaN(s1) || isNaN(s2) || v1 <= 0 || s1 <= 0 || s2 <= 0) {
      setDilError('সকল মান ধনাত্মক হতে হবে।');
      setDilResult(null);
      return;
    }

    if (s2 >= s1) {
      setDilError('লঘুকরণের ক্ষেত্রে চূড়ান্ত ঘনমাত্রা (S2) অবশ্যই প্রাথমিক ঘনমাত্রা (S1) অপেক্ষা কম হতে হবে।');
      setDilResult(null);
      return;
    }

    const v2 = (v1 * s1) / s2;
    const roundedV2 = Math.round(v2 * 100) / 100;
    const waterNeeded = Math.round((v2 - v1) * 100) / 100;

    setDilResult({
      v2: roundedV2,
      waterNeeded,
      steps: [
        `লঘুকরণ সূত্র: V₁S₁ = V₂S₂`,
        `চূড়ান্ত আয়তন V₂ = (V₁ × S₁) / S₂ = (${v1} × ${s1}) / ${s2} = ${roundedV2} mL`,
        `যোগ করতে হবে এমন পানির পরিমাণ = V₂ - V₁ = ${roundedV2} - ${v1} = ${waterNeeded} mL`
      ]
    });
  };

  const calculatePh = (e: React.FormEvent) => {
    e.preventDefault();
    setPhError('');
    const h = parseFloat(phInput);

    if (isNaN(h) || h <= 0 || h > 10) {
      setPhError('হাইড্রোজেন আয়ন ঘনমাত্রা (0 < [H+] ≤ 10) সীমার মধ্যে প্রদান করুন।');
      setPhResult(null);
      return;
    }

    const ph = -Math.log10(h);
    const roundedPh = Math.round(ph * 100) / 100;
    const roundedPoh = Math.round((14 - roundedPh) * 100) / 100;

    let nature = 'নিরপেক্ষ দ্রবণ';
    if (roundedPh < 3) nature = 'তীব্র অম্লীয় (Strong Acid)';
    else if (roundedPh < 7) nature = 'মৃদু অম্লীয় (Weak Acid)';
    else if (roundedPh === 7) nature = 'নিরপেক্ষ দ্রবণ (Neutral)';
    else if (roundedPh <= 11) nature = 'মৃদু ক্ষারীয় (Weak Base)';
    else nature = 'তীব্র ক্ষারীয় (Strong Base)';

    setPhResult({
      ph: roundedPh,
      poh: roundedPoh,
      nature,
      steps: [
        `হাইড্রোজেন আয়ন ঘনমাত্রা [H⁺] = ${h} M`,
        `pH = -log₁₀[H⁺] = -log₁₀(${h}) = ${roundedPh}`,
        `pOH = 14 - pH = 14 - ${roundedPh} = ${roundedPoh}`,
        `প্রকৃতি: ${nature}`
      ]
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-teal-900 text-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" /> লাইভ কেমিস্ট্রি ক্যালকুলেটর
          </div>
          <h3 className="text-xl font-bold">ধাপে ধাপে সঠিক রাসায়নিক গণনা</h3>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs border border-teal-500/30">
          একক যাচাইকৃত
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-sm font-medium bg-slate-50">
        <button
          onClick={() => setActiveTab('molarity')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'molarity'
              ? 'border-teal-600 text-teal-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          মোলারিটি ও ঘনমাত্রা (S)
        </button>
        <button
          onClick={() => setActiveTab('ideal_gas')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'ideal_gas'
              ? 'border-teal-600 text-teal-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          আদর্শ গ্যাস (PV = nRT)
        </button>
        <button
          onClick={() => setActiveTab('mole')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'mole'
              ? 'border-teal-600 text-teal-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          মোলের ধারণা ও কণা
        </button>
        <button
          onClick={() => setActiveTab('dilution')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'dilution'
              ? 'border-teal-600 text-teal-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          দ্রবণের লঘুকরণ (V₁S₁ = V₂S₂)
        </button>
        <button
          onClick={() => setActiveTab('ph')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'ph'
              ? 'border-teal-600 text-teal-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          pH ও pOH স্কেল
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* 1. Molarity */}
        {activeTab === 'molarity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={calculateMolarity} className="space-y-4">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/80 text-xs text-teal-900">
                <div className="font-semibold mb-1">সমীকরণ:</div>
                <KaTeXRenderer math="S = \frac{W \times 1000}{M \times V}" block />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  দ্রবীভূত দ্রবের ভর, W (গ্রাম):
                </label>
                <input
                  type="number"
                  step="any"
                  value={molW}
                  onChange={(e) => setMolW(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  দ্রবের আণবিক ভর, M (g/mol):
                </label>
                <input
                  type="number"
                  step="any"
                  value={molM}
                  onChange={(e) => setMolM(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="যেমন: Na2CO3 এর 106, NaOH এর 40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  দ্রবণের আয়তন, V (মিলিলিটার - mL):
                </label>
                <input
                  type="number"
                  step="any"
                  value={molV}
                  onChange={(e) => setMolV(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              {molError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {molError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> মোলারিটি গণনা করুন
              </button>
            </form>

            {/* Result Display */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  ফলাফল ও সমাধান
                </h4>
                {molResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-teal-300 shadow-xs">
                      <span className="text-xs text-slate-500">মোলার ঘনমাত্রা (S):</span>
                      <div className="text-2xl font-bold text-teal-700">
                        {molResult.s} M (mol/L)
                      </div>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                        {molResult.classification}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-600">সমাধানের ধারাবাহিক ধাপ:</span>
                      {molResult.steps.map((st, i) => (
                        <div key={i} className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                          {st}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-xs text-center">
                    বামপাশের মানগুলো ইনপুট দিয়ে ‘মোলারিটি গণনা করুন’ বাটনে ক্লিক করুন।
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Ideal Gas */}
        {activeTab === 'ideal_gas' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={calculateGas} className="space-y-4">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/80 text-xs text-teal-900">
                <div className="font-semibold mb-1">সমীকরণ:</div>
                <KaTeXRenderer math="PV = nRT \implies n = \frac{PV}{RT}" block />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">গ্যাসের চাপ, P (atm):</label>
                <input
                  type="number"
                  step="any"
                  value={gasP}
                  onChange={(e) => setGasP(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">গ্যাসের আয়তন, V (লিটার):</label>
                <input
                  type="number"
                  step="any"
                  value={gasV}
                  onChange={(e) => setGasV(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">তাপমাত্রা, T (°C সেলসিয়াস):</label>
                <input
                  type="number"
                  step="any"
                  value={gasT}
                  onChange={(e) => setGasT(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              {gasError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {gasError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> গ্যাস মোল সংখ্যা হিসাব করুন
              </button>
            </form>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ফলাফল ও সমাধান</h4>
              {gasResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-teal-300 shadow-xs">
                    <span className="text-xs text-slate-500">গ্যাসের মোল সংখ্যা (n):</span>
                    <div className="text-2xl font-bold text-teal-700">{gasResult.n} mol</div>
                    <span className="text-xs text-slate-500">পরম তাপমাত্রা: {gasResult.kelvin} K</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-600">সমাধানের ধারাবাহিক ধাপ:</span>
                    {gasResult.steps.map((st, i) => (
                      <div key={i} className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                        {st}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-400 text-xs text-center">
                  চাপ, আয়তন ও তাপমাত্রা ইনপুট দিয়ে হিসাব করুন।
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Mole */}
        {activeTab === 'mole' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={calculateMole} className="space-y-4">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/80 text-xs text-teal-900">
                <KaTeXRenderer math="n = \frac{W}{M} = \frac{N}{6.022 \times 10^{23}} = \frac{V_{STP}}{22.4}" block />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">পদার্থের ভর, W (গ্রাম):</label>
                <input
                  type="number"
                  step="any"
                  value={moleW}
                  onChange={(e) => setMoleW(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">মোলার ভর, M (g/mol):</label>
                <input
                  type="number"
                  step="any"
                  value={moleM}
                  onChange={(e) => setMoleM(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="যেমন H2O এর 18, CO2 এর 44"
                  required
                />
              </div>

              {moleError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {moleError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> মোল ও কণা সংখ্যা গণনা করুন
              </button>
            </form>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ফলাফল ও সমাধান</h4>
              {moleResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-teal-300 shadow-xs">
                    <span className="text-xs text-slate-500">মোল সংখ্যা:</span>
                    <div className="text-2xl font-bold text-teal-700">{moleResult.n} mol</div>
                    <div className="text-xs text-slate-600 mt-1">কণা সংখ্যা: {moleResult.particles} টি</div>
                    <div className="text-xs text-slate-600">STP তে আয়তন: {moleResult.volStp} L</div>
                  </div>

                  <div className="space-y-1.5">
                    {moleResult.steps.map((st, i) => (
                      <div key={i} className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                        {st}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-400 text-xs text-center">
                  ভর ও মোলার ভর ইনপুট দিয়ে মোল নির্ণয় করুন।
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Dilution */}
        {activeTab === 'dilution' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={calculateDilution} className="space-y-4">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/80 text-xs text-teal-900">
                <KaTeXRenderer math="V_1 S_1 = V_2 S_2 \implies V_2 = \frac{V_1 S_1}{S_2}" block />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">প্রাথমিক আয়তন, V₁ (mL):</label>
                <input
                  type="number"
                  step="any"
                  value={dilV1}
                  onChange={(e) => setDilV1(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">প্রাথমিক ঘনমাত্রা, S₁ (M):</label>
                <input
                  type="number"
                  step="any"
                  value={dilS1}
                  onChange={(e) => setDilS1(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">প্রত্যাশিত লঘু ঘনমাত্রা, S₂ (M):</label>
                <input
                  type="number"
                  step="any"
                  value={dilS2}
                  onChange={(e) => setDilS2(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              {dilError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {dilError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> লঘুকরণ হিসাব করুন
              </button>
            </form>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ফলাফল ও সমাধান</h4>
              {dilResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-teal-300 shadow-xs">
                    <span className="text-xs text-slate-500">চূড়ান্ত আয়তন (V₂):</span>
                    <div className="text-2xl font-bold text-teal-700">{dilResult.v2} mL</div>
                    <div className="text-xs text-blue-700 font-semibold mt-1">
                      যোগ করতে হবে পানি: {dilResult.waterNeeded} mL
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {dilResult.steps.map((st, i) => (
                      <div key={i} className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                        {st}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-400 text-xs text-center">
                  প্রাথমিক ও লঘু ঘনমাত্রা ইনপুট দিন।
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. pH */}
        {activeTab === 'ph' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={calculatePh} className="space-y-4">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/80 text-xs text-teal-900">
                <KaTeXRenderer math="pH = -\log_{10}[H^+], \quad pH + pOH = 14" block />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  হাইড্রোজেন আয়ন ঘনমাত্রা, [H⁺] (mol/L বা M):
                </label>
                <input
                  type="number"
                  step="any"
                  value={phInput}
                  onChange={(e) => setPhInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="যেমন 0.001 বা 0.05"
                  required
                />
              </div>

              {phError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {phError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> pH মান নির্ণয় করুন
              </button>
            </form>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ফলাফল ও সমাধান</h4>
              {phResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border border-teal-300 shadow-xs">
                    <span className="text-xs text-slate-500">দ্রবণের pH মান:</span>
                    <div className="text-3xl font-extrabold text-teal-700">{phResult.ph}</div>
                    <div className="text-xs text-slate-600 mt-1">pOH মান: {phResult.poh}</div>
                    <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                      {phResult.nature}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {phResult.steps.map((st, i) => (
                      <div key={i} className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                        {st}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-400 text-xs text-center">
                  [H⁺] এর ঘনমাত্রা দিয়ে pH গণনা করুন।
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
