"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, ChevronRight, Zap, BookOpen, BarChart3, Award, 
  ArrowRight, Star, Clock, Users, CheckCircle
} from "lucide-react";
import ArcGauge from "@/components/ArcGauge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Simple sentiment scorer (rule-based)
function scoreSentiment(text: string): number {
  const positive = ["great","amazing","excellent","good","love","wonderful","fantastic","happy","positive","best","outstanding","beautiful","brilliant","superb","perfect","awesome"];
  const negative = ["terrible","awful","bad","hate","worst","horrible","poor","negative","sad","disappointing","ugly","dreadful","pathetic","disgusting","fail","broken"];
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  words.forEach(w => {
    if (positive.includes(w)) score += 0.3;
    if (negative.includes(w)) score -= 0.3;
  });
  return Math.max(-1, Math.min(1, score));
}

const DEMOS = [
  "The NLP model performed exceptionally well on the test.",
  "I hate how confusing this documentation is.",
  "The dataset contains 25,000 movie reviews.",
];

const STATS = [
  { label: "Lessons", value: "9", icon: BookOpen },
  { label: "Students", value: "2.4K", icon: Users },
  { label: "Avg Rating", value: "4.9/5", icon: Star },
  { label: "Hours of Content", value: "12+", icon: Clock },
];

const LESSONS_PREVIEW = [
  { id: 1, title: "VADER & NLTK Introduction", difficulty: "Beginner", time: "45 min" },
  { id: 2, title: "Text Preprocessing & TF-IDF", difficulty: "Beginner", time: "60 min" },
  { id: 3, title: "BiLSTM on IMDb", difficulty: "Intermediate", time: "90 min" },
  { id: 4, title: "HuggingFace BERT & RoBERTa", difficulty: "Intermediate", time: "75 min" },
];

const FEATURES = [
  { icon: Brain, title: "Interactive Python IDE", desc: "Write and run real Python in your browser with Pyodide — no install needed." },
  { icon: BarChart3, title: "Live Visualizations", desc: "D3.js animated charts showing TF-IDF heatmaps, sentiment gauges, and LSTM flow." },
  { icon: Award, title: "Progress & Badges", desc: "Track lesson completion, earn XP, and unlock badges as you advance." },
  { icon: Zap, title: "Instant Feedback", desc: "Model comparison widget scores your text with VADER, TextBlob, and BERT simultaneously." },
];

export default function LandingPage() {
  const [demoText, setDemoText] = useState(DEMOS[0]);
  const [score, setScore] = useState(scoreSentiment(DEMOS[0]));

  useEffect(() => {
    setScore(scoreSentiment(demoText));
  }, [demoText]);

  const diffColor = (d: string) =>
    d === "Beginner" ? "badge-beginner" : d === "Intermediate" ? "badge-intermediate" : "badge-advanced";

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-hero-gradient">
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white"
                style={{ width: `${Math.random() * 120 + 20}px`, height: `${Math.random() * 120 + 20}px`,
                  left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.3 }} />
            ))}
          </div>
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm font-ui font-medium mb-6">
                  <Star className="w-4 h-4 text-amber-300" /> University-Level NLP Course
                </div>
                <h1 className="font-heading text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 text-white">
                  Sentiment<br />Analytics<br />
                  <span className="text-accent/80">Lab</span>
                </h1>
                <p className="font-body text-white/85 text-xl leading-relaxed mb-8 max-w-lg">
                  Master natural language processing — from rule-based VADER to transformer 
                  BERT — with interactive lessons, live Python execution, and real-world projects.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/curriculum" className="bg-white text-primary-600 font-ui font-semibold px-7 py-3.5 rounded-card hover:bg-primary-50 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                    Start Learning <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link href="/playground" className="border-2 border-white/60 text-white font-ui font-semibold px-7 py-3.5 rounded-card hover:bg-white/10 transition-all duration-200 flex items-center gap-2">
                    Try Playground
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-12">
                  {STATS.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="text-center">
                      <Icon className="w-5 h-5 text-accent/80 mx-auto mb-1" />
                      <div className="font-heading text-2xl text-white">{value}</div>
                      <div className="font-ui text-xs text-white/60">{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Live Demo Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-card shadow-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="font-ui text-xs text-gray-400 ml-2">Live Sentiment Demo</span>
                </div>
                <textarea
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  className="w-full border border-primary-100 rounded-lg p-3 font-body text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-accent/40 bg-gray-50/50"
                  rows={3}
                  placeholder="Type any text to score…"
                />
                <div className="flex flex-wrap gap-2 mt-3 mb-6">
                  {DEMOS.map((d, i) => (
                    <button key={i} onClick={() => setDemoText(d)}
                      className="text-[10px] font-ui font-bold tracking-wider uppercase px-2.5 py-1.5 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                      Example {i + 1}
                    </button>
                  ))}
                </div>
                
                <div className="py-2 bg-gray-50/50 rounded-xl border border-gray-100 flex justify-center h-[180px] items-center">
                  <ArcGauge score={score} size={220} showLabels={false} />
                </div>

                <div className="mt-6 flex items-center justify-between px-2">
                  <div className="font-ui text-sm font-bold text-gray-500 uppercase tracking-tighter">
                    Sentiment Verdict
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={score > 0.3 ? "pos" : score < -0.3 ? "neg" : "neu"}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`font-heading text-lg ${score > 0.3 ? "text-accent" : score < -0.3 ? "text-red-500" : "text-amber-600"}`}
                    >
                      {score > 0.3 ? "Positive" : score < -0.3 ? "Negative" : "Neutral"}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-24 bg-white">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title">Why Sentiment Analytics Lab?</h2>
              <p className="section-subtitle">Academic rigor meets hands-on interactivity.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURES.map(({ icon: Icon, title, desc }, idx) => (
                <motion.div 
                  key={title} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="card-hover text-center p-8 border-primary-50 hover:border-accent/30"
                >
                  <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/10 transition-colors">
                    <Icon className="w-7 h-7 text-primary-600 group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-heading text-2xl text-primary-800 mb-3">{title}</h3>
                  <p className="font-body text-gray-600 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CURRICULUM PREVIEW */}
        <section className="py-20 bg-primary-50">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="section-title">Course Curriculum</h2>
                <p className="section-subtitle mb-0">9 lessons, from rule-based to neural.</p>
              </div>
              <Link href="/curriculum" className="btn-primary">
                View All Lessons <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {LESSONS_PREVIEW.map((lesson) => (
                <Link key={lesson.id} href={`/lesson/${lesson.id}`}
                  className="card group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-gradient rounded-lg flex items-center justify-center shrink-0 text-white font-ui font-bold text-sm">
                    {lesson.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-heading text-lg text-primary-600 group-hover:text-accent transition-colors truncate">{lesson.title}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={diffColor(lesson.difficulty)}>{lesson.difficulty}</span>
                      <span className="font-ui text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-background">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="section-title">Ready to master sentiment analysis?</h2>
              <p className="font-body text-lg text-gray-600 mb-8">
                Join thousands of students learning NLP with a hands-on, visual, interactive curriculum.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/curriculum" className="btn-primary text-base px-8 py-4">
                  Begin Course <ChevronRight className="w-5 h-5" />
                </Link>
                <Link href="/visualizer" className="btn-secondary text-base px-8 py-4">
                  Try Visualizer
                </Link>
              </div>
              <div className="flex items-center gap-6 justify-center mt-8">
                {["No account needed", "Runs in browser", "Free forever"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 font-ui text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-accent" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
