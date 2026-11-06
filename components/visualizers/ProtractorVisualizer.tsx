'use client';

import React, { useState } from 'react';
import { Compass, RotateCw } from 'lucide-react';

interface ProtractorVisualizerProps {
  initialAngle?: number;
  interactive?: boolean;
}

export function ProtractorVisualizer({
  initialAngle = 54,
  interactive = true,
}: ProtractorVisualizerProps) {
  const [angle, setAngle] = useState<number>(initialAngle);

  // Classification by Vilenkin §50-51
  const getAngleType = (deg: number): { name: string; color: string; desc: string } => {
    if (deg === 90) return { name: 'Прямой угол', color: 'text-emerald-400', desc: 'Ровно 90°' };
    if (deg === 180) return { name: 'Развёрнутый угол', color: 'text-indigo-400', desc: 'Ровно 180°' };
    if (deg < 90) return { name: 'Острый угол', color: 'text-amber-400', desc: 'Меньше 90°' };
    return { name: 'Тупой угол', color: 'text-rose-400', desc: 'Больше 90° и меньше 180°' };
  };

  const angleInfo = getAngleType(angle);

  // SVG dimensions for protractor
  const cx = 110;
  const cy = 110;
  const radius = 90;

  // Ray endpoint for current angle (angle measured counter-clockwise from horizontal right ray)
  const rad = (angle * Math.PI) / 180;
  const rayX = cx + radius * Math.cos(-rad);
  const rayY = cy + radius * Math.sin(-rad);

  // Arc path for the measured angle
  const arcRadius = 35;
  const arcX = cx + arcRadius * Math.cos(-rad);
  const arcY = cy + arcRadius * Math.sin(-rad);
  const largeArcFlag = angle > 180 ? 1 : 0;
  const arcPath = `M ${cx + arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcX} ${arcY}`;

  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
            Интерактивный транспортир (§50, §51)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Градусная мера:</span>
          <span className="text-white font-bold text-base bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {angle}°
          </span>
          <span className={`font-semibold ml-1 ${angleInfo.color}`}>
            ({angleInfo.name})
          </span>
        </div>
      </div>

      {/* Protractor SVG */}
      <div className="flex justify-center items-center py-2">
        <svg width="240" height="135" viewBox="0 0 220 130" className="select-none">
          {/* Semicircle protractor body */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy} Z`}
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* Inner transparent window */}
          <path
            d={`M ${cx - radius * 0.4} ${cy} A ${radius * 0.4} ${radius * 0.4} 0 0 1 ${cx + radius * 0.4} ${cy} Z`}
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Tick marks around semicircle (every 10 deg) */}
          {Array.from({ length: 19 }, (_, i) => {
            const deg = i * 10;
            const rRad = (deg * Math.PI) / 180;
            const isMajor = deg % 30 === 0 || deg === 90;
            const tickLen = isMajor ? 8 : 4;

            const xOuter = cx + radius * Math.cos(-rRad);
            const yOuter = cy + radius * Math.sin(-rRad);
            const xInner = cx + (radius - tickLen) * Math.cos(-rRad);
            const yInner = cy + (radius - tickLen) * Math.sin(-rRad);

            const xLabel = cx + (radius - 16) * Math.cos(-rRad);
            const yLabel = cy + (radius - 16) * Math.sin(-rRad);

            return (
              <g key={deg}>
                <line
                  x1={xOuter}
                  y1={yOuter}
                  x2={xInner}
                  y2={yInner}
                  stroke={isMajor ? '#94a3b8' : '#64748b'}
                  strokeWidth={isMajor ? 1.5 : 1}
                />
                {isMajor && (
                  <text
                    x={xLabel}
                    y={yLabel + 3}
                    fill="#94a3b8"
                    fontSize="7"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {deg}
                  </text>
                )}
              </g>
            );
          })}

          {/* Baseline fixed ray (horizontal right) */}
          <line x1={cx} y1={cy} x2={cx + radius + 10} y2={cy} stroke="#38bdf8" strokeWidth="2.5" />

          {/* Angle sector arc */}
          <path d={arcPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" />

          {/* Draggable dynamic ray */}
          <line x1={cx} y1={cy} x2={rayX} y2={rayY} stroke="#f59e0b" strokeWidth="2.5" />

          {/* Center pivot */}
          <circle cx={cx} cy={cy} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Preset angle buttons & slider */}
      {interactive && (
        <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-slate-400">Быстрый выбор угла:</span>
            <div className="flex items-center gap-1.5">
              {[30, 45, 90, 120, 137, 180].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAngle(preset)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                    angle === preset
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {preset}°
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between text-slate-300">
            <span>Вращать луч:</span>
            <input
              type="range"
              min={0}
              max={180}
              step={1}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-48 accent-amber-500 cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
}
