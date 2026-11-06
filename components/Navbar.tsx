'use client';

import React from 'react';
import { WorldTheme } from '@/types/tutor';
import {
  Sparkles,
  BookOpen,
  Target,
  ShieldCheck,
  Flame,
  Award,
  Box,
  Rocket,
  Music,
  Moon,
  Sun,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'lesson' | 'curriculum' | 'weak-topics' | 'parent';
  onSelectTab: (tab: 'lesson' | 'curriculum' | 'weak-topics' | 'parent') => void;
  currentTheme: WorldTheme;
  onChangeTheme: (theme: WorldTheme) => void;
  xp: number;
  streakDays: number;
  studentName: string;
}

export function Navbar({
  currentTab,
  onSelectTab,
  currentTheme,
  onChangeTheme,
  xp,
  streakDays,
  studentName,
}: NavbarProps) {
  const [isDark, setIsDark] = React.useState(true);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const themeBadges: { id: WorldTheme; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'minecraft',
      label: 'Minecraft',
      icon: <Box className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    },
    {
      id: 'space',
      label: 'Космос',
      icon: <Rocket className="w-4 h-4 text-cyan-400" />,
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    },
    {
      id: 'music',
      label: 'Музыка',
      icon: <Music className="w-4 h-4 text-violet-400" />,
      color: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand & Student badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('lesson')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                  Мой ИИ-репетитор
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">5 класс</span>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span>Учебник Виленкина & Ткачёвой</span>
                </div>
              </div>
            </button>

            {/* Streak & XP pill */}
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border/40 text-xs">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{streakDays} {streakDays === 1 ? 'день' : streakDays < 5 ? 'дня' : 'дней'}</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-medium">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>{xp} XP</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('lesson')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'lesson'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Урок дня</span>
            </button>

            <button
              onClick={() => onSelectTab('curriculum')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'curriculum'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Учебник</span>
              <span className="sm:hidden">Темы</span>
            </button>

            <button
              onClick={() => onSelectTab('weak-topics')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'weak-topics'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Повторение</span>
              <span className="sm:hidden">Ошибки</span>
            </button>

            <button
              onClick={() => onSelectTab('parent')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'parent'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Родителям</span>
              <span className="sm:hidden">Отчёт</span>
            </button>
          </nav>

          {/* Right Controls: Theme selector & Dark Mode */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center bg-muted/40 p-1 rounded-xl border border-border/50">
              {themeBadges.map((badge) => {
                const isActive = currentTheme === badge.id;
                return (
                  <button
                    key={badge.id}
                    onClick={() => onChangeTheme(badge.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? `${badge.color} border shadow-sm scale-102`
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-xl border border-border/50 bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title="Переключить тему оформления"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
