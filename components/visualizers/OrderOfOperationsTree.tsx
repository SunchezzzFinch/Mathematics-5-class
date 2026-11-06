'use client';

import React, { useState } from 'react';
import { GitBranch, ArrowDown, CheckCircle2 } from 'lucide-react';

interface OrderOfOperationsTreeProps {
  interactive?: boolean;
}

export function OrderOfOperationsTree({ interactive = true }: OrderOfOperationsTreeProps) {
  // Example modeled directly after Figure 45 (Дидактические материалы с. 70, Вариант 1, №4)
  // 1) 724 - 659 = 65
  // 2) 1755 : 65 = 27
  // 3) 129 - 43 = 86
  // 4) 86 · 38 = 3268
  // 5) 27 + 3268 = 3295
  const [step1, setStep1] = useState<string>('');
  const [step3, setStep3] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const isStep1Correct = step1.trim() === '65';
  const isStep3Correct = step3.trim() === '86';

  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
            Блок-схема порядка действий (Рис. 45 из пособия)
          </span>
        </div>

        <button
          onClick={() => setShowSolution(!showSolution)}
          className="text-xs text-sky-400 hover:text-sky-300 underline underline-offset-2"
        >
          {showSolution ? 'Скрыть шаги' : 'Показать вычисления'}
        </button>
      </div>

      <div className="text-xs text-slate-400">
        Выражение: <span className="font-mono text-slate-200">1755 : (724 - 659) + (129 - 43) · 38</span>
      </div>

      {/* Visual Tree */}
      <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 flex flex-col items-center space-y-3 font-mono text-xs">
        {/* Row 1: Leaf operations */}
        <div className="flex items-center justify-around w-full max-w-sm">
          {/* Left leaf */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-800 rounded border border-slate-700">
            <span>724 - 659 = </span>
            {showSolution ? (
              <strong className="text-emerald-400 font-bold">65</strong>
            ) : (
              <input
                type="text"
                placeholder="?"
                value={step1}
                onChange={(e) => setStep1(e.target.value)}
                className={`w-10 text-center rounded border px-1 py-0.5 text-xs bg-slate-900 ${
                  isStep1Correct ? 'border-emerald-500 text-emerald-400' : 'border-slate-600 text-white'
                }`}
              />
            )}
          </div>

          {/* Right leaf */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-800 rounded border border-slate-700">
            <span>129 - 43 = </span>
            {showSolution ? (
              <strong className="text-emerald-400 font-bold">86</strong>
            ) : (
              <input
                type="text"
                placeholder="?"
                value={step3}
                onChange={(e) => setStep3(e.target.value)}
                className={`w-10 text-center rounded border px-1 py-0.5 text-xs bg-slate-900 ${
                  isStep3Correct ? 'border-emerald-500 text-emerald-400' : 'border-slate-600 text-white'
                }`}
              />
            )}
          </div>
        </div>

        {/* Down arrows */}
        <div className="flex items-center justify-around w-full max-w-sm text-slate-500">
          <ArrowDown className="w-4 h-4" />
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Row 2: Secondary operations */}
        <div className="flex items-center justify-around w-full max-w-sm">
          <div className="p-2 bg-slate-800/90 rounded border border-slate-700 text-center">
            <span className="text-[11px] text-slate-400 block">1755 : 65</span>
            <strong className="text-sky-300 font-bold">27</strong>
          </div>

          <div className="p-2 bg-slate-800/90 rounded border border-slate-700 text-center">
            <span className="text-[11px] text-slate-400 block">86 · 38</span>
            <strong className="text-sky-300 font-bold">3268</strong>
          </div>
        </div>

        {/* Final summation arrow */}
        <div className="flex justify-center w-full text-slate-500">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Row 3: Final result */}
        <div className="p-2.5 bg-emerald-950/60 rounded-lg border border-emerald-500/40 text-center">
          <span className="text-[11px] text-slate-400 block">27 + 3268 =</span>
          <strong className="text-emerald-300 text-sm font-bold">3295</strong>
        </div>
      </div>
    </div>
  );
}
