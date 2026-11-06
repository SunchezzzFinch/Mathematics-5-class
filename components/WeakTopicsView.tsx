'use client';

import React from 'react';
import { ALL_TOPICS } from '@/data/curriculum';
import { TopicItem, WorldTheme } from '@/types/tutor';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

interface WeakTopicsViewProps {
  weakTopics: TopicItem[];
  onSelectTopic: (topic: TopicItem) => void;
  worldTheme: WorldTheme;
}

export function WeakTopicsView({
  weakTopics,
  onSelectTopic,
  worldTheme,
}: WeakTopicsViewProps) {
  // If no weak topics recorded yet, recommend smart review topics (like Fractions §26 and Decimals §41)
  const displayTopics = weakTopics.length > 0 ? weakTopics : [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 to-muted/20 p-6 sm:p-8 backdrop-blur-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" />
            <span>Умное повторение · Spaced Repetition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Работа над ошибками
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            В науке и крафтинге ошибки — это самый быстрый способ научиться чему-то новому! Здесь собраны темы, где пригодились подсказки или возникли вопросы.
          </p>
        </div>
      </div>

      {displayTopics.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border/80 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Журнал ошибок пока чист!
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Ты решаешь задачи очень уверенно. Для закрепления материала Архимед рекомендует пройти интерактивную лабораторию обыкновенных дробей или объёмов!
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectTopic(ALL_TOPICS[5] || ALL_TOPICS[0])}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <span>Потренировать дроби (§26)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayTopics.map((topic) => {
            const tasksCount = 1 + (topic.practiceTasks ? topic.practiceTasks.length : 0);

            return (
              <div
                key={topic.id}
                className="rounded-3xl border border-amber-500/30 bg-card p-6 flex flex-col justify-between hover:border-amber-500/60 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Требует повторения
                    </span>
                    <span>§{topic.sectionNumber} Виленкин</span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-1.5">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {topic.didacticDescription}
                  </p>

                  <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 mb-5">
                    💡 <b>Совет Архимеда:</b> Открой интерактивную модель темы и попробуй решить задачу без подсказок 2-го уровня!
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Ткачёва РТ · {tasksCount} {tasksCount === 1 ? 'упражнение' : 'упражнения'}
                  </span>
                  <button
                    onClick={() => onSelectTopic(topic)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Повторить тему</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
