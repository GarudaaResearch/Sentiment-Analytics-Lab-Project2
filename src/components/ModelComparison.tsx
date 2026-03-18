"use client";

import { motion } from "framer-motion";

interface ModelComparisonProps {
  text: string;
}

export default function ModelComparison({ text }: ModelComparisonProps) {
  const computeScore = (t: string): number => {
    const POS = ["great", "amazing", "excellent", "love", "wonderful", "fantastic", "brilliant", "perfect", "awesome"];
    const NEG = ["terrible", "awful", "bad", "hate", "worst", "horrible", "poor", "fail", "broken", "sad"];
    const words = t.toLowerCase().split(/\s+/);
    let s = 0;
    words.forEach(w => {
      const clean = w.replace(/[.,!?]/g, "");
      if (POS.includes(clean)) s += 0.3;
      if (NEG.includes(clean)) s -= 0.3;
    });
    return Math.max(-1, Math.min(1, s));
  };

  const vader = computeScore(text);
  // Simulate variation for other models
  const textblob = vader * 0.9 + (Math.random() * 0.1 - 0.05);
  const bert = vader * 0.95 + (Math.random() * 0.08 - 0.04);

  const models = [
    { name: "VADER", score: vader, color: "#1D9E75" },
    { name: "TextBlob", score: textblob, color: "#2563EB" },
    { name: "BERT", score: bert, color: "#7C3AED" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {models.map(({ name, score, color }) => {
        const label = score > 0.05 ? "POSITIVE" : score < -0.05 ? "NEGATIVE" : "NEUTRAL";
        const pct = ((score + 1) / 2) * 100;

        return (
          <div key={name} className="card text-center border border-gray-100 hover:shadow-md transition-shadow p-6 bg-white rounded-card">
            <div className="font-ui font-bold text-sm mb-2" style={{ color }}>
              {name}
            </div>
            <div className="font-code text-2xl font-bold mb-1" style={{ color }}>
              {score >= 0 ? "+" : ""}{score.toFixed(3)}
            </div>
            <div
              className={`font-ui text-xs font-semibold px-2 py-1 rounded-full inline-block ${
                score > 0.05
                  ? "bg-green-100 text-green-700"
                  : score < -0.05
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {label}
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
