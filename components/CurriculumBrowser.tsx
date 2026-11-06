'use client';

import React, { useState } from 'react';
import { CURRICULUM_CHAPTERS, ALL_TOPICS } from '@/data/curriculum';
import { TopicItem, WorldTheme } from '@/types/tutor';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight,
  Award
} from 'lucide-react';

interface CurriculumBrowserProps {
  completedTopics: string[];
  onSelectTopic: (topic: TopicItem) => void;
  worldTheme: WorldTheme;
}

export function CurriculumBrowser({
  completedTopics,
  onSelectTopic,
  worldTheme,
}: CurriculumBrowserProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');

  const filteredTopics =
    selectedChapterId === 'all'
      ? ALL_TOPICS
      : ALL_TOPICS.filter((t) => t.category === selectedChapterId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 to-muted/20 p-6 sm:p-8 backdrop-blur-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
            <span>Школьная программа</span>
            <span>·</span>
            <span>Виленкин 5 класс & Рабочая тетрадь Ткачёвой</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Оглавление учебника математики
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Выбирай любую тему школьного курса. Каждая глава включает в себя сюжетную завязку, интерактивную модель и практические упражнения с подсказками.
          </p>
        </div>

        {/* Filter Chapters Pills */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedChapterId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedChapterId === 'all'
                ? 'bg-foreground text-background shadow-sm'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground border border-border/50'
            }`}
          >
            Все главы ({ALL_TOPICS.length})
          </button>
          {CURRICULUM_CHAPTERS.map((chap) => {
            const isSelected = selectedChapterId === chap.id;
            return (
              <button
                key={chap.id}
                onClick={() => setSelectedChapterId(chap.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-foreground text-background shadow-sm'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground border border-border/50'
                }`}
              >
                Глава {chap.order}. {chap.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => {
          const isDone = completedTopics.includes(topic.id);
          const tasksCount = 1 + (topic.practiceTasks ? topic.practiceTasks.length : 0);
          const worldMetaphor = topic.worldMetaphors[worldTheme] || topic.worldMetaphors.minecraft;

          return (
            <div
              key={topic.id}
              className={`rounded-3xl border p-5 sm:p-6 transition-all flex flex-col justify-between group ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-500/[0.04]'
                  : 'border-border/80 bg-card hover:border-foreground/30 hover:shadow-md'
              }`}
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
                  <span className="truncate max-w-[180px]">
                    §{topic.sectionNumber} Виленкин
                  </span>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Освоено
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      15–20 мин
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1.5">
                  {topic.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                  {topic.didacticDescription}
                </p>

                {/* World hook teaser */}
                <div className="p-3 rounded-2xl bg-muted/30 border border-border/40 text-xs text-muted-foreground mb-5">
                  <div className="text-[11px] font-semibold text-foreground/80 mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>В мире {worldTheme.toUpperCase()}:</span>
                  </div>
                  <p className="italic line-clamp-2">
                    {worldMetaphor.title}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                <div className="text-xs font-mono text-muted-foreground">
                  {tasksCount} {tasksCount === 1 ? 'задача' : tasksCount < 5 ? 'задачи' : 'задач'}
                </div>
                <button
                  onClick={() => onSelectTopic(topic)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isDone
                      ? 'bg-muted hover:bg-muted/80 text-foreground'
                      : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
                  }`}
                >
                  <span>{isDone ? 'Повторить' : 'Начать урок'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
