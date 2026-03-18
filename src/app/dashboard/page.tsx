"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lessons } from "@/data/lessons";
import { useProgressStore } from "@/store/progressStore";
import { CheckCircle, Circle, Award, Zap, Lock } from "lucide-react";

const BADGES = [
  { id: "beginner-badge", label: "First Steps", desc: "Complete 3 lessons", icon: "🌱", color: "#EF9F27", threshold: 33 },
  { id: "intermediate-badge", label: "NLP Explorer", desc: "Complete 6 lessons", icon: "🔬", color: "#1D9E75", threshold: 66 },
  { id: "course-complete", label: "NLP Master", desc: "Complete all 9 lessons", icon: "🏆", color: "#7C3AED", threshold: 100 },
  { id: "speed-learner", label: "Speed Learner", desc: "Complete a lesson in one session", icon: "⚡", color: "#E24B4A", threshold: 0 },
  { id: "quiz-ace", label: "Quiz Ace", desc: "Score 5/5 on any quiz", icon: "🎯", color: "#2563EB", threshold: 0 },
];

import ArcGauge from "@/components/ArcGauge";

export default function DashboardPage() {
  const { lessons: lessonState, totalXP, badges, isLessonCompleted, getCompletionPercentage } = useProgressStore();
  const pct = getCompletionPercentage();
  const scoreForGauge = (pct / 50) - 1; // Map 0-100 to -1 to 1
  const completedCount = Object.values(lessonState).filter((l) => l.completed).length;

  const difficultyColors: Record<string, string> = {
    Beginner: "badge-beginner",
    Intermediate: "badge-intermediate",
    Advanced: "badge-advanced",
    Capstone: "badge-capstone",
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-teal-gradient text-white py-12">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-6 mb-3">
                  <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center p-2 backdrop-blur-sm border border-white/10">
                    <ArcGauge score={scoreForGauge} size={100} showLabels={false} />
                  </div>
                  <div>
                    <h1 className="font-heading text-4xl text-white">Student Dashboard</h1>
                    <div className="font-ui text-white/70 text-sm font-bold uppercase tracking-widest">Sentiment Analytics Lab</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-heading text-4xl text-white">{totalXP}</div>
                <div className="font-ui text-white/70 text-sm">Total XP</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between font-ui text-sm text-white/80 mb-2">
                <span>{completedCount} of 9 lessons complete</span>
                <span>{pct}%</span>
              </div>
              <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
              {pct === 100 && (
                <div className="mt-3 text-center font-ui font-semibold text-white">
                  🎉 Congratulations! You have completed the Sentiment Analytics Lab course!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Lesson Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Completed", value: completedCount, icon: CheckCircle, color: "#1D9E75" },
                  { label: "Badges Earned", value: badges.length, icon: Award, color: "#EF9F27" },
                  { label: "XP Points", value: totalXP, icon: Zap, color: "#7C3AED" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="card text-center">
                    <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
                    <div className="font-heading text-3xl text-primary-600">{value}</div>
                    <div className="font-ui text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>

              {/* Lesson Checklist */}
              <div className="card">
                <h2 className="font-heading text-2xl text-primary-600 mb-4">Lesson Progress</h2>
                <div className="space-y-3">
                  {lessons.map((lesson) => {
                    const done = isLessonCompleted(lesson.id);
                    const data = lessonState[lesson.id];
                    return (
                      <Link key={lesson.id} href={`/lesson/${lesson.id}`}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary-50 transition-colors group">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-accent" : "bg-gray-100"}`}>
                          {done ? <CheckCircle className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-ui font-medium text-sm ${done ? "text-primary-600" : "text-gray-500"}`}>
                              {lesson.id}. {lesson.title}
                            </span>
                            <span className={difficultyColors[lesson.difficulty]}>{lesson.difficulty}</span>
                          </div>
                          {done && data?.quizScore !== undefined && (
                            <div className="font-ui text-xs text-accent mt-0.5">Quiz: {data.quizScore}/{lesson.quiz.length} · Completed</div>
                          )}
                        </div>
                        <div className="shrink-0 font-ui text-xs text-gray-400">{lesson.duration}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Badges */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="font-heading text-2xl text-primary-600 mb-4">Badges</h2>
                <div className="space-y-4">
                  {BADGES.map((badge) => {
                    const earned = badges.includes(badge.id) || (badge.threshold > 0 && pct >= badge.threshold);
                    return (
                      <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${earned ? "bg-primary-50 border border-primary-100" : "bg-gray-50 opacity-60"}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${earned ? "shadow-sm" : "grayscale"}`}
                          style={{ backgroundColor: earned ? `${badge.color}20` : "" }}>
                          {earned ? badge.icon : <Lock className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div>
                          <div className="font-ui font-semibold text-sm text-primary-700">{badge.label}</div>
                          <div className="font-body text-xs text-gray-500">{badge.desc}</div>
                          {earned && <div className="font-ui text-xs mt-0.5" style={{ color: badge.color }}>✓ Earned</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Certificate */}
              {pct === 100 ? (
                <div className="card bg-teal-gradient text-white text-center">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="font-heading text-xl mb-2">Course Certificate</h3>
                  <p className="font-body text-sm text-white/85 mb-4">You have successfully completed the Sentiment Analytics Lab!</p>
                  <button className="bg-white text-primary-600 font-ui font-semibold px-6 py-2.5 rounded-card hover:bg-primary-50 transition-colors text-sm">
                    Download Certificate
                  </button>
                </div>
              ) : (
                <div className="card border-2 border-dashed border-primary-200 text-center py-8">
                  <div className="text-3xl mb-3 grayscale">🎓</div>
                  <h3 className="font-heading text-lg text-gray-400 mb-1">Certificate Locked</h3>
                  <p className="font-body text-sm text-gray-400">Complete all 9 lessons to unlock your certificate.</p>
                  <div className="mt-3 font-ui text-sm text-primary-600">{9 - completedCount} lessons remaining</div>
                  <Link href="/curriculum" className="btn-primary mt-4 text-sm py-2 px-4">
                    Continue Learning
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
