'use client';

import React, { useState } from 'react';
import { PieChart, Music, Layers, Sparkles } from 'lucide-react';

interface FractionLabVisualizerProps {
  initialNumerator?: number;
  initialDenominator?: number;
  interactive?: boolean;
}

export function FractionLabVisualizer({
  initialNumerator = 3,
  initialDenominator = 4,
  interactive = true,
}: FractionLabVisualizerProps) {
  const [num, setNum] = useState<number>(initialNumerator);
  const [den, setDen] = useState<number>(initialDenominator);
  const [viewMode, setViewMode] = useState<'bar' | 'pie' | 'rhythm'>('bar');

  // Greatest common divisor for reduction
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const commonDiv = gcd(num, den);
  const redNum = num / commonDiv;
  const redDen = den / commonDiv;
  const isReducible = commonDiv > 1;

  // Rhythm representation
  const getRhythmLabel = () => {
    if (num === 1 && den === 1) return 'Целая нота (4 счёта)';
    if (num === 1 && den === 2) return 'Половинная нота (2 счёта)';
    if (num === 1 && den === 4) return 'Четвертная нота (1 счёт)';
    if (num === 2 && den === 4) return 'Две четверти = половинная нота';
    if (num === 3 && den === 4) return 'Размер 3/4 (вальсовый ритм)';
    if (num === 4 && den === 4) return 'Полный такт 4/4';
    if (den === 8) return `${num} восьмых долей`;
    return `${num}/${den} такта`;
  };

  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
            Лаборатория обыкновенных дробей (§26, §33)
          </span>
        </div>

        {/* View Switcher buttons */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setViewMode('bar')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'bar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Блоки / Полоса
          </button>
          <button
            onClick={() => setViewMode('pie')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'pie' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Круг / Пирог
          </button>
          <button
            onClick={() => setViewMode('rhythm')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'rhythm' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Музыкальный ритм
          </button>
        </div>
      </div>

      {/* Math Fraction Display & Equivalence */}
      <div className="flex items-center justify-center gap-6 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Дробь:</span>
          <div className="inline-flex flex-col items-center justify-center font-mono font-bold text-xl text-indigo-300">
            <span>{num}</span>
            <div className="w-6 h-0.5 bg-indigo-400 my-0.5" />
            <span>{den}</span>
          </div>
        </div>

        {isReducible && (
          <div className="flex items-center gap-2 text-xs font-mono bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Сокращается на {commonDiv}: </span>
            <strong className="text-white text-sm font-bold">
              {redNum}/{redDen}
            </strong>
          </div>
        )}
      </div>

      {/* Visual representations */}
      {viewMode === 'bar' && (
        <div className="space-y-2">
          <div className="flex w-full h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
            {Array.from({ length: den }, (_, i) => {
              const isFilled = i < num;
              return (
                <button
                  key={i}
                  onClick={() => interactive && setNum(i + 1)}
                  className={`flex-1 border-r border-slate-700/60 last:border-r-0 flex items-center justify-center text-xs font-mono transition-colors ${
                    isFilled
                      ? 'bg-gradient-to-t from-indigo-600 to-indigo-500 text-white shadow-inner font-bold'
                      : 'bg-slate-800/80 text-slate-500 hover:bg-slate-700/50'
                  }`}
                  title={`Доля ${i + 1}/${den}`}
                >
                  1/{den}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Закрашено <strong className="text-slate-200">{num}</strong> из{' '}
            <strong className="text-slate-200">{den}</strong> равных долей (кликни на долю для выбора)
          </p>
        </div>
      )}

      {viewMode === 'pie' && (
        <div className="flex flex-col items-center justify-center py-2 space-y-2">
          <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Background circle */}
            <circle cx="50" cy="50" r="42" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            {/* Slices */}
            {Array.from({ length: den }, (_, i) => {
              const startAngle = (i / den) * 360;
              const endAngle = ((i + 1) / den) * 360;
              const isFilled = i < num;

              const x1 = 50 + 42 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 42 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 42 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 42 * Math.sin((endAngle * Math.PI) / 180);
              const largeArc = 1 / den > 0.5 ? 1 : 0;

              return (
                <path
                  key={i}
                  d={`M 50 50 L ${x1} ${y1} A 42 42 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={isFilled ? '#6366f1' : '#1e293b'}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  className="transition-all cursor-pointer hover:opacity-90"
                  onClick={() => interactive && setNum(i + 1)}
                />
              );
            })}
          </svg>
          <span className="text-xs font-mono text-slate-400">
            Сектор круга: {((num / den) * 100).toFixed(1)}% площади
          </span>
        </div>
      )}

      {viewMode === 'rhythm' && (
        <div className="p-3 bg-slate-800/80 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-medium">
            <Music className="w-4 h-4" />
            <span>Музыкальный такт: {getRhythmLabel()}</span>
          </div>
          <div className="grid grid-cols-8 gap-1 pt-1">
            {Array.from({ length: 8 }, (_, i) => {
              const fractionEquivalent = (i + 1) / 8;
              const isBeatActive = fractionEquivalent <= num / den;
              return (
                <div
                  key={i}
                  className={`h-8 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                    isBeatActive
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-300'
                      : 'bg-slate-700/50 text-slate-500'
                  }`}
                >
                  ♪
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400">
            Дроби определяют длину ноты в музыке: 1/4 = четверть такта, 1/8 = восьмая нота.
          </p>
        </div>
      )}

      {/* Interactive Controls */}
      {interactive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
          <label className="flex items-center justify-between text-slate-300">
            <span>Числитель (взяли): <strong className="font-mono text-white text-sm">{num}</strong></span>
            <input
              type="range"
              min={1}
              max={den}
              value={num}
              onChange={(e) => setNum(Number(e.target.value))}
              className="w-28 accent-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between text-slate-300">
            <span>Знаменатель (разделили): <strong className="font-mono text-white text-sm">{den}</strong></span>
            <input
              type="range"
              min={2}
              max={16}
              value={den}
              onChange={(e) => {
                const newDen = Number(e.target.value);
                setDen(newDen);
                if (num > newDen) setNum(newDen);
              }}
              className="w-28 accent-indigo-500 cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
}
