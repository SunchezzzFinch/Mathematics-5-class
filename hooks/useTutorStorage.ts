'use client';

import { useState, useEffect } from 'react';
import { StudentProfile, StudentAttempt, TopicProgress, WorldTheme } from '@/types/tutor';
import { CURRICULUM_TOPICS } from '@/data/curriculum';

const PROFILE_KEY = 'tutor_5th_student_profile';
const ATTEMPTS_KEY = 'tutor_5th_attempts_log';
const TOPIC_PROGRESS_KEY = 'tutor_5th_topic_progress';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Саша',
  grade: 5,
  activeWorld: 'minecraft',
  xp: 120,
  streakDays: 3,
  lastStreakDate: new Date().toISOString().split('T')[0],
  totalTimeMinutes: 45,
  completedLessonsCount: 4,
  parentPin: '1234',
  avatarSeed: 'explorer',
};

export function useTutorStorage() {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(PROFILE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PROFILE;
  });

  const [attempts, setAttempts] = useState<StudentAttempt[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(ATTEMPTS_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [topicProgress, setTopicProgress] = useState<Record<string, TopicProgress>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(TOPIC_PROGRESS_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    const initialMap: Record<string, TopicProgress> = {};
    CURRICULUM_TOPICS.forEach((t) => {
      initialMap[t.id] = {
        topicId: t.id,
        attemptsCount: 2,
        successCount: t.id === 'topic_05_scales_coords' ? 2 : 1,
        hintsCount: 1,
        lastPracticed: 0,
        masteryLevel: t.id === 'topic_05_scales_coords' ? 85 : 60,
        needsReview: false,
      };
    });
    return initialMap;
  });

  const [isLoaded] = useState<boolean>(true);

  // Save profile helper
  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const setWorld = (world: WorldTheme) => {
    updateProfile({ activeWorld: world });
  };

  // Record an attempt
  const recordAttempt = (attempt: Omit<StudentAttempt, 'id' | 'timestamp'>) => {
    const fullAttempt: StudentAttempt = {
      ...attempt,
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };

    setAttempts((prev) => {
      const updated = [fullAttempt, ...prev];
      try {
        localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updated.slice(0, 200)));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    // Update topic mastery
    setTopicProgress((prev) => {
      const current = prev[attempt.topicId] || {
        topicId: attempt.topicId,
        attemptsCount: 0,
        successCount: 0,
        hintsCount: 0,
        lastPracticed: Date.now(),
        masteryLevel: 0,
        needsReview: false,
      };

      const attemptsCount = current.attemptsCount + 1;
      const successCount = current.successCount + (attempt.isCorrect ? 1 : 0);
      const hintsCount = current.hintsCount + attempt.hintsUsed;
      const rawAccuracy = (successCount / attemptsCount) * 100;
      
      // Penalty for high hints
      const hintPenalty = Math.min(25, hintsCount * 5);
      const masteryLevel = Math.max(10, Math.min(100, Math.round(rawAccuracy - hintPenalty)));
      const needsReview = !attempt.isCorrect || attempt.hintsUsed >= 2;

      const updatedTopic: TopicProgress = {
        ...current,
        attemptsCount,
        successCount,
        hintsCount,
        lastPracticed: Date.now(),
        masteryLevel,
        needsReview,
      };

      const nextMap = { ...prev, [attempt.topicId]: updatedTopic };
      try {
        localStorage.setItem(TOPIC_PROGRESS_KEY, JSON.stringify(nextMap));
      } catch (err) {
        console.error(err);
      }
      return nextMap;
    });

    // Award XP
    const earnedXp = attempt.isCorrect ? Math.max(10, 30 - attempt.hintsUsed * 8) : 5;
    updateProfile({
      xp: profile.xp + earnedXp,
      totalTimeMinutes: profile.totalTimeMinutes + Math.round(attempt.timeSpentSeconds / 60),
    });
  };

  // Get weak topics that need review
  const getWeakTopics = () => {
    return CURRICULUM_TOPICS.filter((topic) => {
      const prog = topicProgress[topic.id];
      if (!prog) return false;
      return prog.needsReview || prog.masteryLevel < 70;
    });
  };

  // Mark a topic fully completed
  const markTopicCompleted = (topicId: string, xpEarned: number = 50) => {
    setTopicProgress((prev) => {
      const current = prev[topicId] || {
        topicId,
        attemptsCount: 1,
        successCount: 1,
        hintsCount: 0,
        lastPracticed: 0,
        masteryLevel: 100,
        needsReview: false,
      };
      const updated: TopicProgress = {
        ...current,
        masteryLevel: 100,
        needsReview: false,
      };
      const nextMap = { ...prev, [topicId]: updated };
      try {
        localStorage.setItem(TOPIC_PROGRESS_KEY, JSON.stringify(nextMap));
      } catch (err) {
        console.error(err);
      }
      return nextMap;
    });

    updateProfile({
      xp: profile.xp + xpEarned,
      completedLessonsCount: (profile.completedLessonsCount || 0) + 1,
    });
  };

  return {
    profile,
    updateProfile,
    setWorld,
    attempts,
    topicProgress,
    recordAttempt,
    markTopicCompleted,
    getWeakTopics,
    isLoaded,
  };
}
