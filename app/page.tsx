'use client';

import React, { useState } from 'react';
import { useTutorStorage } from '@/hooks/useTutorStorage';
import { ALL_TOPICS } from '@/data/curriculum';
import { TopicItem, WorldTheme } from '@/types/tutor';
import { Navbar } from '@/components/Navbar';
import { DailyLessonView } from '@/components/DailyLessonView';
import { CurriculumBrowser } from '@/components/CurriculumBrowser';
import { WeakTopicsView } from '@/components/WeakTopicsView';
import { ParentDashboard } from '@/components/ParentDashboard';
import { SocraticChatDrawer } from '@/components/SocraticChatDrawer';
import { CelebrationModal } from '@/components/CelebrationModal';
import {
  Sparkles,
  BookOpen,
  Box,
  Rocket,
  Music,
  GraduationCap,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const {
    profile,
    updateProfile,
    recordAttempt,
    markTopicCompleted,
    getWeakTopics,
    topicProgress,
  } = useTutorStorage();

  const [currentTab, setCurrentTab] = useState<'lesson' | 'curriculum' | 'weak-topics' | 'parent'>('lesson');
  const [selectedTopic, setSelectedTopic] = useState<TopicItem>(ALL_TOPICS[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | undefined>(undefined);

  // Celebration modal state
  const [celebrationState, setCelebrationState] = useState<{
    isOpen: boolean;
    earnedXp: number;
    lessonTitle: string;
    independenceScore: number;
  }>({
    isOpen: false,
    earnedXp: 50,
    lessonTitle: '',
    independenceScore: 85,
  });

  const handleSelectTopicFromBrowser = (topic: TopicItem) => {
    setSelectedTopic(topic);
    setCurrentTab('lesson');
  };

  const handleCompleteTask = (topicId: string, taskId: string, isCorrect: boolean, hintsUsed: number) => {
    recordAttempt({
      taskId,
      topicId,
      userAnswer: '',
      isCorrect,
      hintsUsed,
      timeSpentSeconds: 45,
      world: profile.activeWorld,
    });
  };

  const handleCompleteTopic = (topicId: string, xpEarned: number) => {
    markTopicCompleted(topicId, xpEarned);
    setCelebrationState({
      isOpen: true,
      earnedXp: xpEarned,
      lessonTitle: selectedTopic.title,
      independenceScore: 85,
    });
  };

  const handleNextLesson = () => {
    const currentIndex = ALL_TOPICS.findIndex((t) => t.id === selectedTopic.id);
    if (currentIndex < ALL_TOPICS.length - 1) {
      setSelectedTopic(ALL_TOPICS[currentIndex + 1]);
    } else {
      setSelectedTopic(ALL_TOPICS[0]);
    }
  };

  const handleOpenTutorChatWithContext = (contextQuestion?: string) => {
    setChatInitialQuestion(contextQuestion);
    setIsChatOpen(true);
  };

  const weakTopics = getWeakTopics();
  const completedTopicsList = Object.keys(topicProgress).filter(
    (id) => topicProgress[id]?.masteryLevel >= 80
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentTheme={profile.activeWorld}
        onChangeTheme={(theme: WorldTheme) => updateProfile({ activeWorld: theme })}
        xp={profile.xp}
        streakDays={profile.streakDays}
        studentName={profile.name}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'lesson' && (
          <DailyLessonView
            topic={selectedTopic}
            worldTheme={profile.activeWorld}
            studentName={profile.name}
            onCompleteTask={handleCompleteTask}
            onCompleteTopic={handleCompleteTopic}
            onOpenTutorChat={handleOpenTutorChatWithContext}
          />
        )}

        {currentTab === 'curriculum' && (
          <CurriculumBrowser
            completedTopics={completedTopicsList}
            onSelectTopic={handleSelectTopicFromBrowser}
            worldTheme={profile.activeWorld}
          />
        )}

        {currentTab === 'weak-topics' && (
          <WeakTopicsView
            weakTopics={weakTopics}
            onSelectTopic={handleSelectTopicFromBrowser}
            worldTheme={profile.activeWorld}
          />
        )}

        {currentTab === 'parent' && (
          <ParentDashboard
            profile={profile}
            onUpdateProfile={updateProfile}
            weakTopics={weakTopics}
          />
        )}
      </main>

      {/* Persistent Socratic Archimedes Chat Drawer */}
      <SocraticChatDrawer
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        worldTheme={profile.activeWorld}
        currentTopicTitle={selectedTopic.title}
        currentTaskContext={chatInitialQuestion}
        studentName={profile.name}
        onRequestHintDirectly={() => {
          setIsChatOpen(false);
          // Focus lesson view
          if (currentTab !== 'lesson') setCurrentTab('lesson');
        }}
      />

      {/* Celebration Modal on Lesson Completion */}
      <CelebrationModal
        isOpen={celebrationState.isOpen}
        onClose={() => setCelebrationState((prev) => ({ ...prev, isOpen: false }))}
        earnedXp={celebrationState.earnedXp}
        lessonTitle={celebrationState.lessonTitle}
        independenceScore={celebrationState.independenceScore}
        onNextLesson={handleNextLesson}
      />

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 mt-12 bg-muted/20 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Мой ИИ-репетитор</span>
            <span>·</span>
            <span>Адаптивное обучение математике 5 класса</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Виленкин Н.Я. §1–§51</span>
            <span>·</span>
            <span>Ткачёва М.В. Ч.1 & Ч.2</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">Архимед AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
