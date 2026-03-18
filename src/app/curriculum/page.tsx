"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lessons } from "@/data/lessons";
import { useProgressStore } from "@/store/progressStore";
import { CheckCircle, Clock, ChevronRight, Lock, Play, BookOpen } from "lucide-react";

const difficultyColors: Record<string, string> = {
  Beginner: "badge-beginner",
  Intermediate: "badge-intermediate",
  Advanced: "badge-advanced",
  Capstone: "badge-capstone",
};

const roadmapConnectorColors: Record<string, string> = {
  Beginner: "bg-amber-200",
  Intermediate: "bg-accent/30",
  Advanced: "bg-red-200",
  Capstone: "bg-purple-200",
};

export default function CurriculumPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const { isLessonCompleted, getCompletionPercentage } = useProgressStore();
  const pct = getCompletionPercentage();

  const filters = ["All", "Beginner", "Intermediate", "Advanced", "Capstone"];
  const filtered = activeFilter === "All" ? lessons : lessons.filter((l) => l.difficulty === activeFilter);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <div className="bg-teal-gradient text-white py-16">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-ui mb-4">
                <BookOpen className="w-4 h-4" /> 9 Lessons · 12+ Hours
              </div>
              <h1 className="font-heading text-5xl text-white mb-4">Course Curriculum</h1>
              <p className="font-body text-white/85 text-lg mb-6">
                A complete journey through sentiment analysis — from rule-based heuristics to production-ready transformer deployments.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-xs h-3 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <span className="font-ui text-sm text-white/80">{pct}% complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`font-ui font-medium px-4 py-2 rounded-full text-sm transition-all ${
                  activeFilter === f ? "bg-primary-600 text-white shadow-md" : "bg-white border border-primary-100 text-primary-600 hover:bg-primary-50"
                }`}>
                {f}
              </button>
            ))}
          </div>

          {/* Lesson Cards */}
          <div className="space-y-4">
            {filtered.map((lesson, idx) => {
              const completed = isLessonCompleted(lesson.id);
              const isFirst = lesson.id === 1;
              const prevCompleted = lesson.id === 1 || isLessonCompleted(lesson.id - 1);
              const locked = !prevCompleted && !completed && !isFirst;

              return (
                <div key={lesson.id} className={`relative flex gap-0 ${idx < filtered.length - 1 ? "pb-0" : ""}`}>
                  {/* Timeline connector */}
                  {idx < filtered.length - 1 && activeFilter === "All" && (
                    <div className={`absolute left-7 top-16 w-0.5 h-8 ${roadmapConnectorColors[lesson.difficulty]} z-0`} />
                  )}

                  <Link href={locked ? "#" : `/lesson/${lesson.id}`}
                    className={`flex items-start gap-5 card group transition-all duration-200 w-full relative z-10
                      ${completed ? "border-accent/40 bg-primary-50/50" : ""}
                      ${locked ? "opacity-60 cursor-not-allowed" : "hover:shadow-card-hover hover:-translate-y-0.5"}`}>
                    
                    {/* Number / Status */}
                    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white font-ui font-bold text-lg shadow-sm
                      ${completed ? "bg-accent" : locked ? "bg-gray-300" : "bg-teal-gradient"}`}>
                      {completed ? <CheckCircle className="w-6 h-6" /> : locked ? <Lock className="w-5 h-5" /> : lesson.id}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-heading text-xl text-primary-600 group-hover:text-accent transition-colors">
                          {lesson.title}
                        </h3>
                        <span className={difficultyColors[lesson.difficulty]}>{lesson.difficulty}</span>
                        {completed && <span className="font-ui text-xs text-accent font-semibold">✓ Completed</span>}
                      </div>
                      <p className="font-body text-sm text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 font-ui text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5" /> {lesson.duration}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {lesson.tools.slice(0, 4).map((t) => (
                            <span key={t} className="font-code text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {!locked && (
                      <div className="shrink-0 flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all
                          ${completed ? "bg-accent/10 text-accent" : "bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white"}`}>
                          {completed ? <Play className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
