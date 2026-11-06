'use client';

import React, { useState } from 'react';
import { TopicItem, TaskItem, WorldTheme } from '@/types/tutor';
import { VisualizerHost } from './visualizers/VisualizerHost';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Compass,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DailyLessonViewProps {
  topic: TopicItem;
  worldTheme: WorldTheme;
  studentName?: string;
  onCompleteTask: (topicId: string, taskId: string, isCorrect: boolean, hintsUsed: number) => void;
  onCompleteTopic: (topicId: string, xpEarned: number) => void;
  onOpenTutorChat: (contextQuestion?: string) => void;
}

export function DailyLessonView({
  topic,
  worldTheme,
  studentName = 'Саша',
  onCompleteTask,
  onCompleteTopic,
  onOpenTutorChat,
}: DailyLessonViewProps) {
  // Step in 4-step pedagogical cycle: 1 = Hook/Theory, 2 = Interactive Sandbox, 3 = Practice Tasks, 4 = Reflection
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // Combine sample task + practice tasks
  const allTasks: TaskItem[] = React.useMemo(() => {
    return [topic.sampleTask, ...(topic.practiceTasks || [])];
  }, [topic]);

  const currentTask: TaskItem | undefined = allTasks[currentTaskIndex];

  // Task answer states
  const [userSingleAnswer, setUserSingleAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [blankAnswers, setBlankAnswers] = useState<Record<number, string>>({});
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [revealedHintTier, setRevealedHintTier] = useState<number>(0); // 0 = none, 1, 2, 3
  const [hintsUsedInCurrentTask, setHintsUsedInCurrentTask] = useState(0);
  const [showTheoryDetails, setShowTheoryDetails] = useState(false);

  // Reset inputs when switching tasks
  const handleNextTask = () => {
    if (currentTaskIndex < allTasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
      setUserSingleAnswer('');
      setSelectedOption(null);
      setBlankAnswers({});
      setAnswerStatus('idle');
      setRevealedHintTier(0);
      setHintsUsedInCurrentTask(0);
    } else {
      // Completed all tasks in topic -> move to step 4 Reflection
      setActiveStep(4);
    }
  };

  const handlePrevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex((prev) => prev - 1);
      setUserSingleAnswer('');
      setSelectedOption(null);
      setBlankAnswers({});
      setAnswerStatus('idle');
      setRevealedHintTier(0);
      setHintsUsedInCurrentTask(0);
    }
  };

  const handleCheckAnswer = () => {
    if (!currentTask) return;

    let isCorrect = false;

    if (currentTask.format === 'multiple_choice') {
      if (selectedOption !== null) {
        isCorrect =
          selectedOption.trim().toLowerCase() === currentTask.correctAnswer.trim().toLowerCase();
      }
    } else if (currentTask.format === 'single_input' || currentTask.format === 'comparison') {
      const normalizedUser = userSingleAnswer.trim().toLowerCase().replace(',', '.');
      const normalizedTarget = currentTask.correctAnswer.trim().toLowerCase().replace(',', '.');
      const accepted = (currentTask.acceptedAnswers || []).map((a) =>
        a.trim().toLowerCase().replace(',', '.')
      );
      isCorrect = normalizedUser === normalizedTarget || accepted.includes(normalizedUser);
    } else if (currentTask.format === 'fill_blanks') {
      if (currentTask.fillBlanks) {
        isCorrect = currentTask.fillBlanks.every((b, idx) => {
          const val = (blankAnswers[idx] || '').trim().toLowerCase();
          return val === b.expected.trim().toLowerCase();
        });
      }
    }

    if (isCorrect) {
      setAnswerStatus('correct');
      onCompleteTask(topic.id, currentTask.id, true, hintsUsedInCurrentTask);
    } else {
      setAnswerStatus('incorrect');
      onCompleteTask(topic.id, currentTask.id, false, hintsUsedInCurrentTask);
    }
  };

  const handleRequestHint = () => {
    if (revealedHintTier < 3) {
      const nextTier = revealedHintTier + 1;
      setRevealedHintTier(nextTier);
      setHintsUsedInCurrentTask((prev) => Math.max(prev, nextTier));
    }
  };

  const currentThemeStory =
    topic.worldMetaphors[worldTheme] || topic.worldMetaphors.minecraft;

  return (
    <div className="space-y-6">
      {/* Lesson Header Banner */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 to-muted/20 p-5 sm:p-7 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              <span>{topic.categoryTitle}</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">§{topic.sectionNumber} Виленкин</span>
              <span>·</span>
              <span>Ткачёва РТ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {topic.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {topic.didacticDescription}
            </p>
          </div>

          {/* 4-Step Navigation pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/40 border border-border/60 self-start md:self-auto shrink-0">
            {[
              { num: 1, label: 'Интрига', icon: <Sparkles className="w-3.5 h-3.5" /> },
              { num: 2, label: 'Модель', icon: <Layers className="w-3.5 h-3.5" /> },
              { num: 3, label: 'Практика', icon: <Compass className="w-3.5 h-3.5" /> },
              { num: 4, label: 'Итоги', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            ].map((s) => {
              const isActive = activeStep === s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setActiveStep(s.num as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-foreground text-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s.icon}
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 1: HOOK / THEMATIC STORY */}
      {activeStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Thematic Story Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Миссия в мире: {worldTheme.toUpperCase()}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                {currentThemeStory.title}
              </h2>

              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap mb-6">
                {currentThemeStory.story}
              </p>

              {/* Action forward */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/40">
                <div className="text-xs text-muted-foreground">
                  Готов исследовать закономерность на интерактивной модели?
                </div>
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span>Перейти к модели</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Theory / Textbook sidebar */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-muted/20 border border-border/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Школьное правило</span>
                </div>
                <button
                  onClick={() => setShowTheoryDetails(!showTheoryDetails)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {showTheoryDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="text-xs font-mono text-muted-foreground mb-2">
                Учебник Виленкина §{topic.sectionNumber}
              </div>

              <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-card/60 p-4 rounded-2xl border border-border/40 whitespace-pre-wrap font-sans">
                {topic.theoryMarkdown.trim()}
              </div>

              {showTheoryDetails && (
                <div className="mt-4 pt-4 border-t border-border/40 space-y-2 text-xs text-muted-foreground">
                  <p>
                    В 5 классе важно не просто заучить определение, а увидеть, как оно работает на схеме и в живых задачах.
                  </p>
                  <p>
                    В рабочей тетради Ткачёвой используются пошаговые рассуждения и заполнение пропусков.
                  </p>
                </div>
              )}
            </div>

            {/* AI Tutor tip */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 border border-emerald-500/30">
              <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>Совет от Архимеда</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                «Не спеши считать в уме сразу сложные числа. Потрогай модель на следующем шаге: подвигай ползунки, посмотри, как меняются величины!»
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: INTERACTIVE VISUALIZER SANDBOX */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">
                Интерактивная лаборатория
              </div>
              <div className="text-sm font-medium text-foreground">
                Поэкспериментируй с параметрами и открой закономерность своими руками!
              </div>
            </div>
            <button
              onClick={() => setActiveStep(3)}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
            >
              <span>Понятно! К заданиям</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Render dedicated visualizer */}
          <VisualizerHost
            type={topic.defaultVisual === 'order_tree' ? 'order_of_ops' : topic.defaultVisual}
            worldTheme={worldTheme}
          />
        </div>
      )}

      {/* STEP 3: PRACTICE TASKS & 3-TIER HINTS */}
      {activeStep === 3 && currentTask && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Task Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm relative">
              {/* Task progress badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                    Задание {currentTaskIndex + 1} из {allTasks.length}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {currentTask.textbookRef}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevTask}
                    disabled={currentTaskIndex === 0}
                    className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                    title="Предыдущее задание"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextTask}
                    disabled={currentTaskIndex === allTasks.length - 1}
                    className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                    title="Следующее задание"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thematic Context description */}
              {currentTask.contextDescriptions?.[worldTheme] && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-medium mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{currentTask.contextDescriptions[worldTheme]}</span>
                </div>
              )}

              {/* Question Statement */}
              <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug mb-6 whitespace-pre-wrap">
                {currentTask.question}
              </h2>

              {/* Task Input Types */}
              {/* Case A: Multiple Choice */}
              {currentTask.format === 'multiple_choice' && currentTask.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {currentTask.options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedOption(opt);
                          setAnswerStatus('idle');
                        }}
                        className={`p-4 rounded-2xl text-left border transition-all text-xs sm:text-sm font-medium flex items-center gap-3 ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                            : 'border-border/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-card border border-border flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Case B: Single Input / Comparison */}
              {(currentTask.format === 'single_input' || currentTask.format === 'comparison') && (
                <div className="mb-6 space-y-3">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Введи ответ {currentTask.unit ? `(${currentTask.unit})` : ''}:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={userSingleAnswer}
                      onChange={(e) => {
                        setUserSingleAnswer(e.target.value);
                        setAnswerStatus('idle');
                      }}
                      placeholder={currentTask.format === 'comparison' ? '<, >, =' : 'Например: 42'}
                      className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-muted/40 border border-border/80 text-foreground font-mono text-base focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {currentTask.unit && (
                      <span className="text-xs font-mono text-muted-foreground">
                        {currentTask.unit}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Case C: Fill in the Blanks (Tkacheva style scaffold) */}
              {currentTask.format === 'fill_blanks' && currentTask.fillBlanks && (
                <div className="mb-6 space-y-3">
                  <div className="text-xs text-muted-foreground mb-2">
                    Вставь пропущенные числа или выражения по шагам рассуждения:
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-3">
                    {currentTask.fillBlanks.map((b, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                        <span className="text-xs sm:text-sm text-foreground">
                          {b.textBefore}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={blankAnswers[idx] || ''}
                            onChange={(e) => {
                              setBlankAnswers((prev) => ({ ...prev, [idx]: e.target.value }));
                              setAnswerStatus('idle');
                            }}
                            placeholder={b.placeholder || 'ответ'}
                            className="w-full sm:w-36 px-3 py-1.5 rounded-xl bg-card border border-border font-mono text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
                          />
                          <span className="text-xs sm:text-sm text-foreground">{b.textAfter}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Check Answer and Status Banner */}
              <div className="space-y-4 pt-4 border-t border-border/40">
                {answerStatus === 'correct' && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-3 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">Блестяще! Ответ верный!</div>
                      <div className="text-xs text-emerald-400/90 mt-0.5">
                        {currentTask.explanation}
                      </div>
                    </div>
                  </div>
                )}

                {answerStatus === 'incorrect' && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3 animate-fade-in">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">Пока не совсем сошлось. Не опускай руки!</div>
                      <div className="text-xs text-amber-300/90 mt-0.5">
                        Попробуй нажать «Подсказка 1 уровня» справа или спроси Архимеда.
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCheckAnswer}
                      className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Проверить ответ</span>
                    </button>

                    {answerStatus === 'incorrect' && (
                      <button
                        onClick={() => {
                          setUserSingleAnswer('');
                          setSelectedOption(null);
                          setBlankAnswers({});
                          setAnswerStatus('idle');
                        }}
                        className="px-3.5 py-2.5 rounded-xl border border-border/60 hover:bg-muted/40 text-xs text-muted-foreground flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Сбросить</span>
                      </button>
                    )}
                  </div>

                  {answerStatus === 'correct' && (
                    <button
                      onClick={handleNextTask}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors flex items-center gap-2 ml-auto shadow-lg shadow-emerald-500/20"
                    >
                      <span>{currentTaskIndex < allTasks.length - 1 ? 'Следующая задача' : 'Завершить урок'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: 3-TIER GRADUATED HINTS & SOCRATIC TUTOR */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Пошаговые подсказки</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Уровень {revealedHintTier} из 3
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Настоящий математик думает сам! Открывай подсказки по одной, если нужно мягко направить мысль:
              </p>

              {/* Tier 1: Guiding Question */}
              <div className="space-y-2">
                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    revealedHintTier >= 1
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-muted/20 border-border/40 text-muted-foreground/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">
                      Уровень 1 · Наводящий вопрос
                    </span>
                    {revealedHintTier >= 1 && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  {revealedHintTier >= 1 ? (
                    <p className="text-xs sm:text-sm leading-relaxed">{currentTask.hintTier1}</p>
                  ) : (
                    <p className="text-xs italic">Заблокировано. Попробуй сначала подумать сам!</p>
                  )}
                </div>

                {/* Tier 2: Visual Scheme / Analogy */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    revealedHintTier >= 2
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                      : 'bg-muted/20 border-border/40 text-muted-foreground/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">
                      Уровень 2 · Наглядная аналогия
                    </span>
                    {revealedHintTier >= 2 && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  {revealedHintTier >= 2 ? (
                    <p className="text-xs sm:text-sm leading-relaxed">{currentTask.hintTier2}</p>
                  ) : (
                    <p className="text-xs italic">Аналогия из мира {worldTheme}</p>
                  )}
                </div>

                {/* Tier 3: Scaffold Step */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    revealedHintTier >= 3
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-muted/20 border-border/40 text-muted-foreground/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">
                      Уровень 3 · Шаг с пропуском
                    </span>
                    {revealedHintTier >= 3 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  {revealedHintTier >= 3 ? (
                    <p className="text-xs sm:text-sm leading-relaxed font-mono">{currentTask.hintTier3}</p>
                  ) : (
                    <p className="text-xs italic">Формула и шаблон вычисления</p>
                  )}
                </div>
              </div>

              {/* Request Next Hint Button */}
              {revealedHintTier < 3 ? (
                <button
                  onClick={handleRequestHint}
                  className="w-full py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Открыть подсказку {revealedHintTier + 1} уровня</span>
                </button>
              ) : (
                <div className="text-center text-xs text-muted-foreground">
                  Все 3 подсказки открыты. Если всё ещё сложно — спроси Архимеда!
                </div>
              )}
            </div>

            {/* Quick Socratic Archimedes Card */}
            <div className="p-5 rounded-3xl bg-muted/20 border border-border/60 text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-foreground">
                Нужна помощь живого репетитора?
              </div>
              <p className="text-xs text-muted-foreground">
                Архимед не даст ответ, но обсудит с тобой условие и поддержит!
              </p>
              <button
                onClick={() => onOpenTutorChat(currentTask.question)}
                className="w-full py-2 rounded-xl bg-card border border-border/60 hover:bg-muted text-foreground font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Обсудить задачу с Архимедом</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REFLECTION & REWARDS */}
      {activeStep === 4 && (
        <div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-card border border-border/80 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              Урок завершён
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Отличная работа, {studentName}!
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Ты успешно разобрался с темой «{topic.title}». Знания закреплены практикой из учебника!
            </p>
          </div>

          {/* Reflection Question */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/60 text-left space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Главный вывод урока:</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Математические правила — это не абстрактные формулы из тетрадки, а законы построения устойчивых конструкций в Minecraft, точных орбит в космосе и гармоничных треков в музыке!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => onCompleteTopic(topic.id, 50)}
              className="py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Забрать награду +50 XP</span>
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="py-3 px-5 rounded-xl border border-border/60 hover:bg-muted font-medium text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Вернуться к задачам
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
