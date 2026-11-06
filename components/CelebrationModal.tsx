'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedXp: number;
  lessonTitle: string;
  independenceScore: number;
  onNextLesson?: () => void;
}

export function CelebrationModal({
  isOpen,
  onClose,
  earnedXp,
  lessonTitle,
  independenceScore,
  onNextLesson,
}: CelebrationModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      // Fire confetti from edges
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30">
          <Award className="w-8 h-8 text-white animate-bounce" />
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Великолепно! Урок пройден!
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Тема: «{lessonTitle}» успешно закреплена на практике
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
            <div className="text-2xl font-bold text-emerald-400 font-mono">+{earnedXp}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Очков опыта</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
            <div className="text-2xl font-bold text-cyan-400 font-mono">{independenceScore}%</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
              <span>Самостоятельность</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Архимед записал твой результат в бортовой журнал. Ты мыслишь как настоящий исследователь!
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          {onNextLesson && (
            <button
              onClick={() => {
                onClose();
                onNextLesson();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span>Следующий урок</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted font-medium text-sm text-foreground transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
