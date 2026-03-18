"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { lessons } from "@/data/lessons";
import { useProgressStore } from "@/store/progressStore";
import { Trophy, CheckCircle, X, ChevronRight, Award, Code2 } from "lucide-react";
import PythonRunner from "@/components/PythonRunner";

const CODING_CHALLENGES: Record<number, { prompt: string; starter: string; solution: string; hint: string }> = {
  1: {
    prompt: "Complete the script to perform a VADER analysis on the text 'NLP is fun!' and print the compound score.",
    starter: `import nltk\nfrom nltk.sentiment.vader import SentimentIntensityAnalyzer\n\nnltk.download('vader_lexicon')\nsia = SentimentIntensityAnalyzer()\n\ntext = "NLP is fun!"\n# TODO: Get scores and print compound\n`,
    solution: "scores = sia.polarity_scores(text)\nprint(scores['compound'])",
    hint: "Use sia.polarity_scores(text) and access the 'compound' key."
  },
  2: {
    prompt: "Initialize a TfidfVectorizer and compute the matrix for the list of documents provided.",
    starter: `from sklearn.feature_extraction.text import TfidfVectorizer\n\ndocs = ["I love NLP", "NLP is power"]\n# TODO: Fit and transform docs\n`,
    solution: "vectorizer = TfidfVectorizer()\nmatrix = vectorizer.fit_transform(docs)\nprint(matrix.toarray())",
    hint: "Use vectorizer.fit_transform(docs)."
  }
};

export default function QuizPage() {
  const [lessonId, setLessonId] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const { completeLesson } = useProgressStore();

  const lesson = lessons.find((l) => l.id === lessonId)!;
  const quiz = lesson.quiz;
  const challenge = CODING_CHALLENGES[lessonId] || CODING_CHALLENGES[1];

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  }, [lessonId]);

  const handleSubmit = () => {
    let correct = 0;
    quiz.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
    // For now, we manually mark coding as 1 extra point if they attempt
    const total = correct + 1; // 1 bonus for the coding part
    setScore(total);
    const earnedXP = Math.round((total / (quiz.length + 1)) * 100);
    setXp(earnedXP);
    setSubmitted(true);
    if (total >= Math.ceil(quiz.length * 0.6)) {
      completeLesson(lessonId, total);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-20">
        <div className="bg-teal-gradient text-white py-14">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-heading text-4xl text-white">Quiz Engine</h1>
            </div>
            <p className="font-body text-white/80 max-w-2xl text-lg">
              Validate your knowledge of sentiment analysis through multiple-choice questions and live coding challenges.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          {/* Lesson Selector */}
          <div className="card shadow-xl mb-8 border-none bg-white/90 backdrop-blur">
            <label className="font-ui font-bold text-xs text-primary-600 uppercase tracking-widest mb-3 block">Current Module Evaluation</label>
            <select 
              value={lessonId} 
              onChange={e => setLessonId(Number(e.target.value))}
              className="font-ui text-base font-semibold border-2 border-primary-50 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer bg-primary-50/20"
            >
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>Lesson {l.id}: {l.title}</option>
              ))}
            </select>
          </div>

          {/* Score Banner */}
          {submitted && (
            <div className={`card mb-8 border-2 text-center animate-bounce-subtle ${score >= Math.ceil(quiz.length * 0.6) ? "border-accent bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
              <div className="text-5xl mb-3">{score >= Math.ceil(quiz.length * 0.6) ? "🏆" : "📖"}</div>
              <h2 className="font-heading text-4xl text-primary-800 mb-2">
                {score} / {quiz.length + 1}
              </h2>
              <p className="font-ui text-sm text-gray-600 mb-5 font-medium">
                {score >= Math.ceil(quiz.length * 0.6) ? "Mastery Achieved! Lesson marked as completed." : "You're close! Review the material and try again."}
              </p>
              <div className="inline-flex items-center gap-2 bg-accent text-white font-ui font-bold px-6 py-2.5 rounded-full shadow-lg">
                <Award className="w-5 h-5" /> +{xp} XP Earned
              </div>
            </div>
          )}

          {/* MCQ Questions */}
          <div className="space-y-6 mb-12">
            <h3 className="font-ui font-bold text-xs text-gray-400 uppercase tracking-[0.2em] ml-2">Section I: Conceptual Knowledge</h3>
            {quiz.map((q, qi) => (
              <div key={qi} className={`card shadow-md transition-all duration-500 border-l-4 ${submitted ? (answers[qi] === q.answer ? "border-l-accent" : "border-l-red-400") : "border-l-primary-400"}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm ${submitted ? (answers[qi] === q.answer ? "bg-accent" : "bg-red-400") : "bg-primary-600"}`}>
                    {submitted ? (answers[qi] === q.answer ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />) : qi + 1}
                  </div>
                  <p className="font-ui font-bold text-lg text-primary-800 leading-tight pt-1">{q.question}</p>
                </div>
                <div className="grid gap-3 ml-12">
                  {q.options.map((opt, oi) => {
                    const isSelected = answers[qi] === oi;
                    const isCorrect = q.answer === oi;
                    const base = "w-full text-left px-5 py-4 rounded-xl border-2 font-ui text-sm transition-all duration-300 relative overflow-hidden";
                    const style = !submitted
                      ? isSelected ? `${base} border-primary-600 bg-primary-50 text-primary-700 shadow-inner` : `${base} border-gray-100 hover:border-primary-200 hover:bg-gray-50/50`
                      : isCorrect ? `${base} border-accent bg-green-50 text-green-800 font-bold`
                      : isSelected ? `${base} border-red-400 bg-red-50 text-red-700`
                      : `${base} border-gray-50 text-gray-400 opacity-60`;
                    
                    return (
                      <button key={oi} disabled={submitted} onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))} className={style}>
                        <span className="font-black mr-3 opacity-30">{String.fromCharCode(65 + oi)}</span> {opt}
                        {submitted && isCorrect && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <div className="mt-6 ml-12 p-4 bg-primary-50/50 rounded-xl border border-primary-100 font-body text-sm text-primary-800 italic">
                    <span className="font-ui font-bold not-italic text-xs uppercase tracking-wider text-primary-500 block mb-1">Knowledge Deep-Dive</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Live Coding Challenge */}
          <div className="mb-12">
            <h3 className="font-ui font-bold text-xs text-gray-400 uppercase tracking-[0.2em] ml-2 mb-6">Section II: Practical Implementation</h3>
            <div className="card shadow-xl border-l-4 border-l-purple-500 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Code2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-ui font-bold text-primary-800">Sandbox Coding Challenge</h3>
                  <p className="text-xs text-gray-500 font-medium italic">{challenge.prompt}</p>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden border border-gray-100 mb-4 bg-primary-900 shadow-inner">
                <PythonRunner 
                  code={challenge.starter} 
                  showTerminal={true} 
                  className="min-h-[300px]"
                />
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-ui text-[10px] font-black text-purple-700 uppercase tracking-widest">Stuck?</span>
                  <button className="text-[10px] font-bold text-purple-600 hover:underline" onClick={() => alert(challenge.hint)}>Reveal Hint</button>
                </div>
              </div>
            </div>
          </div>

          {!submitted ? (
            <button onClick={handleSubmit}
              className="btn-primary w-full justify-center py-4 text-lg hover:shadow-2xl shadow-accent/20 group">
              Finalize Evaluation <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => { setAnswers({}); setSubmitted(false); }}
                className="btn-secondary flex-1 justify-center py-4 rounded-2xl font-bold"
              >
                Reset Quiz
              </button>
              <button 
                onClick={() => setLessonId(l => Math.min(l + 1, 9))} 
                className="btn-primary flex-1 justify-center py-4 rounded-2xl font-bold shadow-lg"
              >
                Next Lesson <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
