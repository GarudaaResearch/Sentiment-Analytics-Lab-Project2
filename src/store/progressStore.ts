"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LessonProgress {
  completed: boolean;
  quizScore?: number;
  lastVisited?: string;
}

interface ProgressState {
  lessons: Record<number, LessonProgress>;
  totalXP: number;
  badges: string[];
  completeLesson: (lessonId: number, quizScore?: number) => void;
  isLessonCompleted: (lessonId: number) => boolean;
  getCompletionPercentage: () => number;
  addBadge: (badge: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessons: {},
      totalXP: 0,
      badges: [],

      completeLesson: (lessonId: number, quizScore?: number) => {
        set((state) => {
          const newLessons = {
            ...state.lessons,
            [lessonId]: {
              completed: true,
              quizScore,
              lastVisited: new Date().toISOString(),
            },
          };
          const xp = Object.values(newLessons).filter((l) => l.completed).length * 100;
          return { lessons: newLessons, totalXP: xp };
        });

        // Check for badges
        const { getCompletionPercentage, badges } = get();
        const pct = getCompletionPercentage();
        if (pct >= 100 && !badges.includes("course-complete")) {
          get().addBadge("course-complete");
        }
        if (pct >= 33 && !badges.includes("beginner-badge")) {
          get().addBadge("beginner-badge");
        }
        if (pct >= 66 && !badges.includes("intermediate-badge")) {
          get().addBadge("intermediate-badge");
        }
      },

      isLessonCompleted: (lessonId: number) => {
        return get().lessons[lessonId]?.completed ?? false;
      },

      getCompletionPercentage: () => {
        const completed = Object.values(get().lessons).filter((l) => l.completed).length;
        return Math.round((completed / 9) * 100);
      },

      addBadge: (badge: string) => {
        set((state) => ({
          badges: [...new Set([...state.badges, badge])],
        }));
      },
    }),
    {
      name: "sentiment-lab-progress",
    }
  )
);
