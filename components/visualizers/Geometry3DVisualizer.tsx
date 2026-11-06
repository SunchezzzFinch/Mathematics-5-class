'use client';

import React, { useState } from 'react';
import { Box, Layers, Eye } from 'lucide-react';

interface Geometry3DVisualizerProps {
  initialLength?: number;
  initialWidth?: number;
  initialHeight?: number;
  interactive?: boolean;
}

export function Geometry3DVisualizer({
  initialLength = 4,
  initialWidth = 3,
  initialHeight = 2,
  interactive = true,
}: Geometry3DVisualizerProps) {
  const [length, setLength] = useState<number>(initialLength); // a
  const [width, setWidth] = useState<number>(initialWidth);   // b
  const [height, setHeight] = useState<number>(initialHeight); // c
  const [showNet, setShowNet] = useState<boolean>(false);

  // Math calculations according to Vilenkin §23-24
  const volume = length * width * height;
  const surfaceArea = 2 * (length * width + width * height + length * height);

  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
            Геометрическая лаборатория: Параллелепипед и объём (§23–24)
          </span>
        </div>

        <button
          onClick={() => setShowNet(!showNet)}
          className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1.5 ${
            showNet
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showNet ? 'Показать 3D модель' : 'Показать развёртку (Ткачёва с. 24)'}</span>
        </button>
      </div>

      {/* Formulas & Calculations Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
          <div className="text-slate-400 mb-1">Объём V = a · b · c:</div>
          <div className="text-emerald-300 font-bold text-sm tabular-nums">
            {length} · {width} · {height} = <span className="text-white text-base">{volume}</span> кубических ед.
          </div>
        </div>

        <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
          <div className="text-slate-400 mb-1">Площадь пов-ти S = 2(ab + bc + ac):</div>
          <div className="text-indigo-300 font-bold text-sm tabular-nums">
            2·({length*width} + {width*height} + {length*height}) = <span className="text-white text-base">{surfaceArea}</span> кв. ед.
          </div>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="h-48 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-center p-4 overflow-hidden relative">
        {!showNet ? (
          // Isometric SVG box representation
          <svg width="220" height="150" viewBox="0 0 220 150" className="drop-shadow-lg">
            {/* Base anchor 110, 110 */}
            <g transform="translate(110, 95)">
              {/* Scaled vectors */}
              {(() => {
                const scaleX = 14;
                const scaleY = 10;
                const scaleZ = 12;

                const dx = length * scaleX;
                const dy = width * scaleY;
                const dz = height * scaleZ;

                // Points in isometric projection
                // Origin (0,0) is front-bottom-left corner
                const p0 = { x: -dx / 2, y: 0 }; // bottom front
                const p1 = { x: dx / 2, y: -dx * 0.3 }; // bottom right
                const p2 = { x: -dx / 2 - dy * 0.7, y: -dy * 0.4 }; // bottom left
                const p3 = { x: -dy * 0.7, y: -dx * 0.3 - dy * 0.4 }; // bottom back

                // Top points (shifted up by dz)
                const pt0 = { x: p0.x, y: p0.y - dz };
                const pt1 = { x: p1.x, y: p1.y - dz };
                const pt2 = { x: p2.x, y: p2.y - dz };
                const pt3 = { x: p3.x, y: p3.y - dz };

                return (
                  <>
                    {/* Front-right face */}
                    <polygon
                      points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${pt1.x},${pt1.y} ${pt0.x},${pt0.y}`}
                      fill="#059669"
                      fillOpacity="0.85"
                      stroke="#34d399"
                      strokeWidth="1.5"
                    />
                    {/* Front-left face */}
                    <polygon
                      points={`${p0.x},${p0.y} ${p2.x},${p2.y} ${pt2.x},${pt2.y} ${pt0.x},${pt0.y}`}
                      fill="#047857"
                      fillOpacity="0.85"
                      stroke="#34d399"
                      strokeWidth="1.5"
                    />
                    {/* Top face */}
                    <polygon
                      points={`${pt0.x},${pt0.y} ${pt1.x},${pt1.y} ${pt3.x},${pt3.y} ${pt2.x},${pt2.y}`}
                      fill="#10b981"
                      fillOpacity="0.9"
                      stroke="#6ee7b7"
                      strokeWidth="1.5"
                    />

                    {/* Dimensions labels */}
                    <text x={(p0.x + p1.x) / 2 + 5} y={(p0.y + p1.y) / 2 + 12} fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                      a={length}
                    </text>
                    <text x={(p0.x + p2.x) / 2 - 20} y={(p0.y + p2.y) / 2 + 8} fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                      b={width}
                    </text>
                    <text x={pt0.x + 8} y={(p0.y + pt0.y) / 2} fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                      c={height}
                    </text>
                  </>
                );
              })()}
            </g>
          </svg>
        ) : (
          // 2D Unfolded Net (Развёртка)
          <div className="flex flex-col items-center justify-center space-y-1 text-slate-300">
            <div className="text-[11px] text-slate-400 font-mono mb-1">
              Развёртка прямоугольного параллелепипеда (6 граней):
            </div>
            <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900 border border-slate-700 rounded text-center text-[10px] font-mono">
              <div className="col-start-2 bg-emerald-800/80 p-2 rounded border border-emerald-600">Верх ({length}×{width})</div>
              <div className="col-start-1 bg-emerald-700/80 p-2 rounded border border-emerald-600">Лев ({width}×{height})</div>
              <div className="bg-emerald-600/90 p-2 rounded border border-emerald-400 font-bold">Перед ({length}×{height})</div>
              <div className="bg-emerald-700/80 p-2 rounded border border-emerald-600">Прав ({width}×{height})</div>
              <div className="bg-emerald-800/80 p-2 rounded border border-emerald-600">Зад ({length}×{height})</div>
              <div className="col-start-2 bg-emerald-800/80 p-2 rounded border border-emerald-600">Низ ({length}×{width})</div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls */}
      {interactive && (
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
          <label className="flex flex-col gap-1 text-slate-300">
            <span className="flex justify-between">
              <span>Длина (a):</span>
              <strong className="font-mono text-emerald-400">{length}</strong>
            </span>
            <input
              type="range"
              min={1}
              max={8}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="accent-emerald-500 cursor-pointer"
            />
          </label>

          <label className="flex flex-col gap-1 text-slate-300">
            <span className="flex justify-between">
              <span>Ширина (b):</span>
              <strong className="font-mono text-emerald-400">{width}</strong>
            </span>
            <input
              type="range"
              min={1}
              max={6}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="accent-emerald-500 cursor-pointer"
            />
          </label>

          <label className="flex flex-col gap-1 text-slate-300">
            <span className="flex justify-between">
              <span>Высота (c):</span>
              <strong className="font-mono text-emerald-400">{height}</strong>
            </span>
            <input
              type="range"
              min={1}
              max={6}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="accent-emerald-500 cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
}
