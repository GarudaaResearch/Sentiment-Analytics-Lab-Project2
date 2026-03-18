"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getLessonById, lessons } from "@/data/lessons";
import { useProgressStore } from "@/store/progressStore";
import {
  CheckCircle, ChevronRight, ChevronDown, Clock, Play, Copy, RotateCcw,
  Lightbulb, AlertTriangle, BookOpen, Terminal, Eye, EyeOff
} from "lucide-react";

// Reusable Components
import ArcGauge from "@/components/ArcGauge";
import WordHighlighter from "@/components/WordHighlighter";
import ModelComparison from "@/components/ModelComparison";
import PythonRunner from "@/components/PythonRunner";
import PipelineStepper from "@/components/PipelineStepper";
import LSTMViewer from "@/components/LSTMViewer";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const difficultyColors: Record<string, string> = {
  Beginner: "badge-beginner",
  Intermediate: "badge-intermediate",
  Advanced: "badge-advanced",
  Capstone: "badge-capstone",
};

/* ─── Concept Visualization Selector ─────────────────────────── */
function ConceptVisualization({ lessonId }: { lessonId: number }) {
  if (lessonId === 1) return (
    <div className="space-y-4">
      <div className="bg-primary-50/50 p-6 rounded-xl border border-primary-100">
        <h4 className="font-heading text-sm text-primary-600 mb-4 uppercase tracking-wider">Sentiment Score Visualization</h4>
        <ArcGauge score={0.765} />
      </div>
    </div>
  );
  if (lessonId === 2) return <PipelineStepper />;
  if (lessonId === 3) return <LSTMViewer />;
  
  // Generic diagram
  return (
    <svg viewBox="0 0 600 130" className="w-full rounded-xl bg-gradient-to-r from-primary-50 to-accent/10">
      <rect x="180" y="30" width="240" height="60" rx="12" fill="#0F5E4E" opacity="0.9" />
      <text x="300" y="58" textAnchor="middle" fill="white" fontSize="13" fontFamily="DM Serif Display, serif" fontWeight="bold">
        Lesson {lessonId}
      </text>
      <text x="300" y="78" textAnchor="middle" fill="white" fontSize="10" fontFamily="DM Sans, sans-serif">Concept Visualization</text>
      <text x="300" y="120" textAnchor="middle" fill="#0F5E4E" fontSize="11" fontFamily="DM Sans" fontWeight="600">Interactive diagram for advanced lessons</text>
    </svg>
  );
}

/* ─── Main Lesson Page ────────────────────────────────────────── */
export default function LessonPage({ params }: { params: { id: string } }) {
  const lessonId = parseInt(params.id);
  const lesson = getLessonById(lessonId);
  if (!lesson) notFound();

  const [code, setCode] = useState(lesson.starterCode);
  const [completed, setCompleted] = useState(false);
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [openVivaIdx, setOpenVivaIdx] = useState<number | null>(null);
  const [showMistakes, setShowMistakes] = useState(false);
  const [copied, setCopied] = useState(false);

  const { completeLesson, isLessonCompleted } = useProgressStore();
  const isComplete = isLessonCompleted(lessonId);
  const nextLesson = lessons.find((l) => l.id === lessonId + 1);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleComplete = () => {
    completeLesson(lessonId);
    setCompleted(true);
  };

  const VIVA_QA = lesson.quiz.slice(0, 3).map((q) => ({
    q: q.question,
    a: q.explanation,
  }));

  return (
    <>
      <Navbar />
      <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-background">
        {/* ─── LEFT PANE (60%) ─── */}
        <div className="w-[60%] overflow-y-auto scrollbar-thin border-r border-primary-100">
          <div className="p-6 lg:p-8 max-w-3xl">
            {/* 1. Lesson Header */}
            <div className="lesson-header mb-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-ui text-white/70 text-sm mb-1">Lesson {lesson.id} of {lessons.length}</div>
                  <h1 className="font-heading text-3xl lg:text-4xl text-white leading-tight">{lesson.title}</h1>
                </div>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={isComplete || completed} onChange={handleComplete}
                    className="w-5 h-5 rounded accent-white cursor-pointer" />
                  <span className="font-ui text-sm text-white/80 group-hover:text-white">Mark complete</span>
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={difficultyColors[lesson.difficulty]}>{lesson.difficulty}</span>
                <span className="flex items-center gap-1.5 font-ui text-white/80 text-sm">
                  <Clock className="w-4 h-4" /> {lesson.duration}
                </span>
                {(isComplete || completed) && (
                  <span className="flex items-center gap-1 font-ui text-sm text-white font-semibold">
                    <CheckCircle className="w-4 h-4" /> Completed!
                  </span>
                )}
              </div>
            </div>

            {/* 2. Concept Visualization */}
            <div className="mb-10">
              <ConceptVisualization lessonId={lessonId} />
            </div>

            {/* 3. Theory */}
            <div className="mb-10">
              <h2 className="font-heading text-2xl text-primary-600 mb-4 font-bold border-b border-primary-50 pb-2">Overview</h2>
              <p className="font-body text-gray-700 text-base leading-relaxed mb-6">{lesson.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="callout-tip">
                  <div className="flex items-center gap-2 font-ui font-semibold text-primary-600 mb-1">
                    <Lightbulb className="w-4 h-4" /> Tip
                  </div>
                  <p className="font-body text-xs text-gray-700 leading-relaxed">VADER works best on social media text. For long documents, split into sentences and average the compound scores.</p>
                </div>
                <div className="callout-term">
                  <div className="flex items-center gap-2 font-ui font-semibold text-blue-700 mb-1">
                    <BookOpen className="w-4 h-4" /> Key Term
                  </div>
                  <p className="font-body text-xs text-gray-700 leading-relaxed"><strong>Compound Score:</strong> A normalized, weighted composite score ranging from −1.0 to +1.0.</p>
                </div>
              </div>

              <h3 className="font-heading text-lg text-primary-600 mb-2">Core Concepts</h3>
              <ul className="grid grid-cols-2 gap-2">
                {lesson.concepts.map((c) => (
                  <li key={c} className="flex items-center gap-2 font-body text-sm text-gray-700 bg-primary-50/50 p-2 rounded-lg border border-primary-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Step-by-step walkthrough */}
            <div className="mb-10">
              <h2 className="font-heading text-2xl text-primary-600 mb-4 font-bold border-b border-primary-50 pb-2">Step-by-Step Implementation</h2>
              <div className="space-y-3">
                {lesson.steps.map((step, i) => (
                  <div key={i} className="border border-primary-100 rounded-card overflow-hidden transition-all duration-300">
                    <button onClick={() => setOpenStep(openStep === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-primary-50/50 hover:bg-primary-50 transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-ui font-bold text-xs shrink-0 ${openStep === i ? "bg-accent text-white" : "bg-primary-100 text-primary-600"}`}>
                          {i + 1}
                        </div>
                        <span className="font-ui font-semibold text-primary-700 text-sm">{step.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setCode(step.code); }}
                          className="font-ui text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20 hover:bg-accent hover:text-white transition-all uppercase tracking-wider font-bold">
                          Load Code
                        </button>
                        <ChevronDown className={`w-4 h-4 text-primary-500 transition-transform ${openStep === i ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    {openStep === i && (
                      <div className="p-4 bg-white border-t border-primary-50">
                        <pre className="code-block text-[11px] mb-3 overflow-x-auto p-3 bg-gray-50 rounded-lg">{step.code}</pre>
                        <p className="font-body text-sm text-gray-600 italic border-l-2 border-accent pl-3">
                          {step.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Common Mistakes */}
            <div className="mb-10">
              <button onClick={() => setShowMistakes(!showMistakes)}
                className="w-full flex items-center justify-between bg-red-50 border border-red-100 rounded-card p-4 hover:bg-red-100 transition-colors">
                <div className="flex items-center gap-2 font-ui font-semibold text-red-700">
                  <AlertTriangle className="w-5 h-5" /> Professional Gotchas & Common Mistakes
                </div>
                {showMistakes ? <EyeOff className="w-4 h-4 text-red-500" /> : <Eye className="w-4 h-4 text-red-500" />}
              </button>
              {showMistakes && (
                <div className="border border-red-100 border-t-0 rounded-b-card p-5 bg-red-50/30">
                  <ul className="space-y-3">
                    {[
                      "Forgetting to download the VADER lexicon before your first run.",
                      "Using compound threshold 0 instead of 0.05 for positive classification.",
                      "Applying document-level VADER on very long text — it degrades accuracy.",
                    ].map((m, i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-sm text-gray-700">
                        <span className="text-red-500 font-bold shrink-0">✗</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 6. Viva Q&A */}
            <div className="mb-10">
              <h2 className="font-heading text-2xl text-primary-600 mb-4 font-bold border-b border-primary-50 pb-2">Viva Voce Q&A</h2>
              <div className="space-y-3">
                {VIVA_QA.map(({ q, a }, i) => (
                  <div key={i} className="border border-primary-100 rounded-card overflow-hidden">
                    <button onClick={() => setOpenVivaIdx(openVivaIdx === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-primary-50 transition-colors">
                      <span className="font-ui font-medium text-primary-700 text-sm pr-4">Q{i + 1}: {q}</span>
                      <ChevronDown className={`w-4 h-4 text-primary-400 shrink-0 transition-transform ${openVivaIdx === i ? "rotate-180" : ""}`} />
                    </button>
                    {openVivaIdx === i && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t border-primary-50 pt-3">
                          <p className="font-body text-sm text-gray-700 leading-relaxed font-italic">{a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Lesson Footer */}
            <div className="border-t border-primary-100 pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center bg-primary-50/20 p-6 rounded-xl">
              <div className="text-center sm:text-left">
                <div className="font-heading text-lg text-primary-600 mb-1">Keep Advancing!</div>
                <div className="font-ui text-sm text-gray-500">Test your skills or move to the next challenge.</div>
              </div>
              <div className="flex gap-3">
                <Link href={`/quiz?lesson=${lessonId}`} className="btn-primary">
                  Start Quiz <ChevronRight className="w-4 h-4" />
                </Link>
                {nextLesson && (
                  <Link href={`/lesson/${nextLesson.id}`} className="btn-secondary">
                    Next Lesson <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANE (40%) ─── */}
        <div className="w-[40%] flex flex-col bg-gray-950">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <span className="font-code text-[11px] text-gray-400 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> sentiment_lab_{lessonId}.py
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copyCode}
                className="flex items-center gap-1 font-ui text-[10px] text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700">
                <Copy className="w-3 h-3" /> {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => setCode(lesson.starterCode)}
                className="flex items-center gap-1 font-ui text-[10px] text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language="python"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "JetBrains Mono, Consolas, monospace",
                minimap: { enabled: false },
                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                tabSize: 4,
                smoothScrolling: true,
                cursorBlinking: "smooth",
              }}
            />
          </div>

          {/* Real Python Runner Output */}
          <div className="h-64 border-t border-gray-800">
            <PythonRunner code={code} />
          </div>
        </div>
      </div>
    </>
  );
}
