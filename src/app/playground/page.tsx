"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PythonRunner from "@/components/PythonRunner";
import { Copy, RotateCcw, Zap, BookOpen } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const STARTER = `# Sentiment Analytics Lab — Python Playground
# Run any Python code right here in your browser!

from collections import Counter
import math

def analyze_sentiment(text):
    """Simple rule-based sentiment analyzer."""
    positive = {
        'great', 'amazing', 'excellent', 'good', 'love', 'wonderful',
        'fantastic', 'happy', 'positive', 'best', 'outstanding', 'brilliant',
        'superb', 'perfect', 'awesome', 'incredible', 'beautiful', 'delightful'
    }
    negative = {
        'terrible', 'awful', 'bad', 'hate', 'worst', 'horrible', 'poor',
        'negative', 'sad', 'disappointing', 'ugly', 'dreadful', 'pathetic',
        'broken', 'fail', 'useless', 'boring', 'slow', 'annoying'
    }
    
    words = text.lower().split()
    pos_count = sum(1 for w in words if w.strip('.,!?') in positive)
    neg_count = sum(1 for w in words if w.strip('.,!?') in negative)
    total = max(len(words), 1)
    
    compound = (pos_count - neg_count) / math.sqrt(total)
    compound = max(-1.0, min(1.0, compound))
    
    if compound >= 0.05:
        label = "POSITIVE"
    elif compound <= -0.05:
        label = "NEGATIVE"
    else:
        label = "NEUTRAL"
    
    return {
        "label": label,
        "compound": round(compound, 4),
        "positive_words": pos_count,
        "negative_words": neg_count,
        "total_words": len(words)
    }

# Test it!
test_sentences = [
    "The course is absolutely amazing and incredibly well-structured!",
    "I'm disappointed. The model is terrible and broken.",
    "The dataset contains 10,000 movie reviews.",
]

print("-" * 40)
print("Sentiment Analytics Lab — Python Result")
print("-" * 40)

for text in test_sentences:
    res = analyze_sentiment(text)
    icon = "✅" if res["label"] == "POSITIVE" else ("❌" if res["label"] == "NEGATIVE" else "⚪")
    print(f"{icon} {res['label']} ({res['compound']:+.4f}) - {text[:30]}...")

print("\\n✅ Try editing the code and clicking Run!")
`;

const TEMPLATES = [
  { label: "VADER Basics", code: `# Quick VADER implementation logic\ntext = "NLP is fantastic and powerful!"\npos = ["fantastic", "powerful", "good"]\nneg = ["bad", "slow", "broken"]\n\nwords = text.lower().split()\nscore = sum(0.3 for w in words if w.strip('.,!') in pos) - sum(0.3 for w in words if w.strip('.,!') in neg)\nprint(f"Text: {text}")\nprint(f"Calculated Score: {score:.2f}")\nprint(f"Sentiment: {'POSITIVE' if score > 0 else 'NEGATIVE' if score < 0 else 'NEUTRAL'}")` },
  { label: "Word Frequency", code: `from collections import Counter\n\ntext = "sentiment analysis involves analysis of sentiment in text"\ncounts = Counter(text.split())\n\nprint("Word Frequencies:")\nfor word, count in counts.most_common():\n    print(f"{word:12} | {count} {'█' * count}")` },
];

export default function PlaygroundPage() {
  const [code, setCode] = useState(STARTER);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="bg-teal-gradient text-white py-12">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-accent/80" />
              <h1 className="font-heading text-4xl text-white">Advanced Playground</h1>
            </div>
            <p className="font-body text-white/80">Full Python execution in your browser via WebAssembly (Pyodide).</p>
          </div>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar / Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card border border-primary-100 p-6">
                <h2 className="font-heading text-xl text-primary-600 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Quick Templates
                </h2>
                <div className="flex flex-col gap-2">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setCode(t.code)}
                      className="text-left font-ui text-sm p-3 rounded-lg border border-primary-50 bg-primary-50/50 hover:bg-primary-50 transition-colors text-primary-700"
                    >
                      {t.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setCode(STARTER)}
                    className="text-left font-ui text-sm p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>

              <div className="card bg-primary-600 text-white p-6">
                <h3 className="font-heading text-lg mb-2">How it works</h3>
                <p className="font-body text-sm opacity-90 leading-relaxed mb-4">
                  This playground uses <strong>Pyodide</strong>, a port of CPython to WebAssembly. 
                  It runs real Python code entirely within your browser's thread.
                </p>
                <ul className="space-y-2 font-ui text-xs">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> No server-side execution
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Standard library support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Instant feedback
                  </li>
                </ul>
              </div>
            </div>

            {/* Editor & Console */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl overflow-hidden border border-gray-700 shadow-2xl bg-gray-950">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                    </div>
                    <span className="font-code text-[11px] text-gray-500 ml-2">playground_main.py</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={copyCode} 
                      className="font-ui text-[10px] text-gray-500 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> {copied ? "Copied" : "Copy"}
                    </button>
                    <button 
                      onClick={() => setCode(STARTER)} 
                      className="font-ui text-[10px] text-gray-500 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>
                </div>

                <Editor
                  height="450px"
                  language="python"
                  value={code}
                  onChange={(v) => setCode(v ?? "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    fontFamily: "JetBrains Mono, monospace",
                    minimap: { enabled: true },
                    lineNumbers: "on",
                    padding: { top: 12 },
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    scrollBeyondLastLine: false,
                  }}
                />

                <div className="h-60 border-t border-gray-800">
                  <PythonRunner code={code} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
