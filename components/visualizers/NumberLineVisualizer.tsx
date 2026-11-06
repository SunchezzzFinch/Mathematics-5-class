'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, Check } from 'lucide-react';

interface NumberLineVisualizerProps {
  min?: number;
  max?: number;
  step?: number;
  target?: number;
  onSelectCoordinate?: (value: number) => void;
  interactive?: boolean;
}

export function NumberLineVisualizer({
  min = 0,
  max = 50,
  step = 10,
  target,
  onSelectCoordinate,
  interactive = true,
}: NumberLineVisualizerProps) {
  const [currentVal, setCurrentVal] = useState<number>(min);

  // Generate tick points
  const totalSteps = Math.round((max - min) / step);
  const ticks = Array.from({ length: totalSteps + 1 }, (_, i) => min + i * step);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentVal(val);
    if (onSelectCoordinate) {
      onSelectCoordinate(val);
    }
  };

  const isTargetMatched = target !== undefined && Math.abs(currentVal - target) < 0.001;

  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
            Координатный луч (Шкала Виленкина §5)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-emerald-300">
          <span>Текущая отметка: X = {currentVal}</span>
          {isTargetMatched && (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
              <Check className="w-3.5 h-3.5" /> Точка найдена!
            </span>
          )}
        </div>
      </div>

      {/* Axis graphic */}
      <div className="relative pt-6 pb-2 px-2 select-none">
        {/* Ray line */}
        <div className="h-1 bg-slate-700 w-full relative rounded-full">
          {/* Arrow at end */}
          <div className="absolute -right-2 -top-1.5 border-solid border-l-slate-400 border-l-8 border-y-transparent border-y-4 border-r-0" />

          {/* Target marker if specified */}
          {target !== undefined && (
            <div
              className="absolute -top-7 -translate-x-1/2 flex flex-col items-center transition-all"
              style={{ left: `${((target - min) / (max - min)) * 100}%` }}
            >
              <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/80 px-1 rounded border border-amber-500/40">
                Цель ({target})
              </span>
              <div className="w-0.5 h-3 bg-amber-400" />
            </div>
          )}

          {/* Active pointer */}
          <div
            className="absolute -top-6 -translate-x-1/2 flex flex-col items-center transition-all duration-75"
            style={{ left: `${((currentVal - min) / (max - min)) * 100}%` }}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-slate-950 shadow-md ring-2 ring-emerald-300">
              📍
            </div>
            <div className="w-0.5 h-2 bg-emerald-400" />
          </div>

          {/* Ticks */}
          {ticks.map((t) => {
            const percent = ((t - min) / (max - min)) * 100;
            return (
              <div
                key={t}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${percent}%` }}
              >
                <div className="w-0.5 h-2.5 bg-slate-500" />
                <span className="text-[11px] font-mono text-slate-400 mt-1 tabular-nums">
                  {t}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {interactive && (
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <label className="text-slate-400 flex items-center gap-2 w-full sm:w-auto">
            <span>Переместить курсор:</span>
            <input
              type="range"
              min={min}
              max={max}
              step={step / 2}
              value={currentVal}
              onChange={handleSliderChange}
              className="w-full sm:w-48 accent-emerald-500 cursor-pointer"
            />
          </label>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Цена 1 деления: </span>
            <strong className="text-slate-200 font-mono">{step}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
