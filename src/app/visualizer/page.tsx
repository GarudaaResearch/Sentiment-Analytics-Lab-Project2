"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BarChart3, Info } from "lucide-react";

// Reusable Components
import ArcGauge from "@/components/ArcGauge";
import WordHighlighter from "@/components/WordHighlighter";
import ModelComparison from "@/components/ModelComparison";

/* ─── TF-IDF Heatmap (Specialized) ─── */
function TFIDFHeatmap() {
  const [docs, setDocs] = useState("I love natural language processing\nSentiment analysis is amazing\nNLP and machine learning are powerful");
  const [matrix, setMatrix] = useState<{ word: string; scores: number[] }[]>([]);

  const compute = () => {
    const docList = docs.split("\n").filter(Boolean);
    const stopwords = new Set(["i","a","is","are","the","and","in","on","to","for","of","it"]);
    const allWords = Array.from(new Set(docList.flatMap(d => d.toLowerCase().split(/\s+/).filter(w => !stopwords.has(w) && w.length > 2))));

    const tf = (word: string, doc: string) => {
      const words = doc.toLowerCase().split(/\s+/);
      return words.filter(w => w === word).length / words.length;
    };
    const idf = (word: string) => {
      const df = docList.filter(d => d.toLowerCase().split(/\s+/).includes(word)).length;
      return Math.log((docList.length + 1) / (df + 1));
    };

    setMatrix(allWords.slice(0, 10).map(word => ({
      word,
      scores: docList.map(doc => parseFloat((tf(word, doc) * idf(word)).toFixed(4))),
    })));
  };

  const maxScore = Math.max(...matrix.flatMap(r => r.scores), 0.001);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="font-ui text-xs font-bold text-primary-600 uppercase tracking-wider">Input Documents (one per line)</label>
        <textarea 
          value={docs} 
          onChange={e => setDocs(e.target.value)} 
          rows={4}
          className="w-full border border-primary-100 rounded-lg p-3 font-code text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 bg-primary-50/20"
          placeholder="Paste 2-5 documents..." 
        />
      </div>
      <button onClick={compute} className="btn-primary text-sm w-full md:w-auto">Compute TF-IDF Matrix</button>
      
      {matrix.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-primary-100">
          <table className="w-full text-xs font-code">
            <thead className="bg-primary-50">
              <tr>
                <th className="text-left p-3 text-primary-700 font-bold border-r border-primary-100">Term</th>
                {Array.from({ length: matrix[0].scores.length }, (_, i) => (
                  <th key={i} className="p-3 text-primary-700 font-bold">Doc {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map(({ word, scores }) => (
                <tr key={word} className="border-t border-primary-50">
                  <td className="p-3 font-bold text-primary-800 bg-primary-50/20 border-r border-primary-100">{word}</td>
                  {scores.map((s, j) => (
                    <td key={j} className="p-3 text-center transition-all duration-300" 
                      style={{ 
                        backgroundColor: `rgba(29,158,117,${(s / maxScore) * 0.8})`, 
                        color: (s / maxScore) > 0.4 ? "white" : "#1A2B24" 
                      }}>
                      {s.toFixed(3)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── VADER Explorer (Specialized) ─── */
function VADERSlider() {
  const EXAMPLES: Record<string, string> = {
    "-0.9": "This is absolutely the worst experience I've ever had. Terrible!",
    "-0.5": "I didn't enjoy this much. It was quite disappointing.",
    "-0.1": "The results were slightly below expectations.",
    "0.0": "The system processed 5,000 documents in batch mode.",
    "0.1": "This seems like a reasonably good approach.",
    "0.5": "Great results! The model performs well on most benchmarks.",
    "0.9": "Absolutely outstanding! The best NLP library I've ever used!",
  };
  const [val, setVal] = useState(0);
  const closest = Object.keys(EXAMPLES).reduce((prev, curr) =>
    Math.abs(parseFloat(curr) - val) < Math.abs(parseFloat(prev) - val) ? curr : prev
  );
  
  return (
    <div className="space-y-6">
      <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
        <div className="flex items-center justify-between mb-4">
          <span className="font-ui text-sm font-bold text-primary-700 uppercase tracking-widest">Manual Score Adjustment</span>
          <span className={`font-code text-2xl font-bold ${val > 0 ? "text-accent" : val < 0 ? "text-red-500" : "text-amber-600"}`}>
            {val >= 0 ? "+" : ""}{val.toFixed(2)}
          </span>
        </div>
        <input 
          type="range" min="-1" max="1" step="0.01" value={val} 
          onChange={e => setVal(parseFloat(e.target.value))}
          className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-accent" 
        />
        <div className="flex justify-between mt-2 font-ui text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span>Negative</span><span>Neutral</span><span>Positive</span>
        </div>
      </div>

      <div className={`p-6 rounded-xl border-2 transition-all duration-500 ${
        val > 0.1 ? "bg-green-50 border-accent/20 text-green-900" :
        val < -0.1 ? "bg-red-50 border-red-200 text-red-900" : "bg-primary-50 border-primary-100 text-primary-900"
      }`}>
        <div className="flex gap-3">
          <Info className="w-5 h-5 shrink-0 mt-1 opacity-40" />
          <div>
            <div className="font-ui text-xs font-bold uppercase opacity-60 mb-1">Representative Sentence</div>
            <p className="font-body text-xl italic font-medium leading-relaxed">
              &ldquo;{EXAMPLES[closest]}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const SAMPLE_TEXTS = [
  "The results were incredibly positive and truly outstanding!",
  "I absolutely hate this broken API, it's the worst experience.",
  "The dataset was processed and stored in the database.",
];

export default function VisualizerPage() {
  const [text, setText] = useState(SAMPLE_TEXTS[0]);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState("gauge");

  useEffect(() => {
    const POS = new Set(["great","amazing","excellent","good","love","wonderful","fantastic","happy","positive","best","brilliant","superb","perfect","awesome","incredible","outstanding","delightful"]);
    const NEG = new Set(["terrible","awful","bad","hate","worst","horrible","poor","sad","disappointing","ugly","dreadful","pathetic","broken","fail","useless","boring","slow","annoying","negative"]);
    const words = text.toLowerCase().split(/\s+/);
    let s = 0;
    words.forEach(w => {
      const c = w.replace(/[.,!?;:]/g, "");
      if (POS.has(c)) s += 0.3;
      if (NEG.has(c)) s -= 0.3;
    });
    setScore(Math.max(-1, Math.min(1, s)));
  }, [text]);

  const TABS = [
    { id: "gauge", label: "Sentiment Gauge", icon: BarChart3 },
    { id: "highlighter", label: "Token Highlighting", icon: Info },
    { id: "comparison", label: "Cross-Model Compare", icon: BarChart3 },
    { id: "tfidf", label: "TF-IDF Matrix", icon: Info },
    { id: "slider", label: "VADER Explorer", icon: Info },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="bg-teal-gradient text-white py-14">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-heading text-4xl text-white">Sentiment Visualizer</h1>
            </div>
            <p className="font-body text-white/80 max-w-2xl text-lg">
              Explore how different algorithms perceive language through interactive real-time visualizations.
            </p>
          </div>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
          {/* Main Input Card */}
          <div className="card shadow-2xl mb-8 border-none bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <label className="font-ui font-bold text-xs text-primary-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" /> Input Analysis Text
                  </label>
                  <div className="flex gap-2">
                    {SAMPLE_TEXTS.map((t, i) => (
                      <button key={i} onClick={() => setText(t)}
                        className="font-ui text-[10px] bg-primary-100/50 text-primary-700 px-2 py-1 rounded hover:bg-primary-200 transition-all font-bold uppercase tracking-wider">
                        Sample {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  value={text} onChange={e => setText(e.target.value)} rows={4}
                  className="w-full border border-primary-100 rounded-xl p-4 font-body text-base focus:outline-none focus:ring-4 focus:ring-accent/10 resize-none bg-primary-50/10 shadow-inner"
                  placeholder="Enter text here to analyze..."
                />
              </div>
              <div className="md:w-64 flex flex-col justify-center items-center bg-primary-50/30 rounded-xl p-4 border border-primary-50">
                <div className="font-ui text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Instant Score</div>
                <div className={`font-code text-4xl font-bold ${score > 0 ? "text-accent" : score < 0 ? "text-red-500" : "text-amber-600"}`}>
                  {score >= 0 ? "+" : ""}{score.toFixed(2)}
                </div>
                <div className="font-ui text-xs font-bold text-gray-500 mt-1 uppercase opacity-60">Rule-Based</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="flex flex-col gap-2 sticky top-24">
                {TABS.map((t) => (
                  <button 
                    key={t.id} 
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-3 px-5 py-4 rounded-xl font-ui text-sm font-bold transition-all border-2 ${
                      activeTab === t.id 
                      ? "bg-primary-600 text-white border-primary-600 shadow-lg -translate-y-1" 
                      : "bg-white text-primary-600 border-transparent hover:bg-primary-50 hover:border-primary-100"
                    }`}
                  >
                    <t.icon className={`w-4 h-4 ${activeTab === t.id ? "text-accent" : "text-primary-300"}`} />
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="card min-h-[500px] shadow-xl border-primary-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                
                {activeTab === "gauge" && (
                  <div className="animate-fade-in py-6">
                    <h2 className="font-heading text-3xl text-primary-600 mb-2">Sentiment Distribution</h2>
                    <p className="font-body text-gray-600 mb-10 max-w-lg">
                      Visualize the overall emotional intensity based on compound weighting.
                    </p>
                    <div className="max-w-md mx-auto">
                      <ArcGauge score={score} size={400} />
                    </div>
                  </div>
                )}

                {activeTab === "highlighter" && (
                  <div className="animate-fade-in py-6">
                    <h2 className="font-heading text-3xl text-primary-600 mb-2">Token Attribution</h2>
                    <p className="font-body text-gray-600 mb-8 max-w-lg">
                      See which specific words contribute to positive or negative sentiment scores.
                    </p>
                    <WordHighlighter text={text} />
                    <div className="mt-8 grid grid-cols-3 gap-4 font-ui text-[10px] font-bold uppercase tracking-widest text-center">
                      <div className="p-3 bg-green-50 text-accent rounded-lg">Green = POSITIVE (+0.3)</div>
                      <div className="p-3 bg-red-50 text-red-500 rounded-lg">Red = NEGATIVE (-0.3)</div>
                      <div className="p-3 bg-gray-50 text-gray-400 rounded-lg">Gray = NEUTRAL (0.0)</div>
                    </div>
                  </div>
                )}

                {activeTab === "comparison" && (
                  <div className="animate-fade-in py-6">
                    <h2 className="font-heading text-3xl text-primary-600 mb-2">Cross-Model Variance</h2>
                    <p className="font-body text-gray-600 mb-10 max-w-lg">
                      Compare Rule-Based (VADER), Statistical (TextBlob), and Deep Learning (BERT) outputs.
                    </p>
                    <ModelComparison text={text} />
                  </div>
                )}

                {activeTab === "tfidf" && (
                  <div className="animate-fade-in py-6">
                    <h2 className="font-heading text-3xl text-primary-600 mb-2">Term Importance Heatmap</h2>
                    <p className="font-body text-gray-600 mb-8 max-w-lg">
                      Analyze relative word importance across multiple documents using TF-IDF.
                    </p>
                    <TFIDFHeatmap />
                  </div>
                )}

                {activeTab === "slider" && (
                  <div className="animate-fade-in py-6">
                    <h2 className="font-heading text-3xl text-primary-600 mb-2">VADER Threshold Explorer</h2>
                    <p className="font-body text-gray-600 mb-10 max-w-lg">
                      Understand how the compound score maps to real-world linguistic expressions.
                    </p>
                    <VADERSlider />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
