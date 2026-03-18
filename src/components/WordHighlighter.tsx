"use client";

interface WordHighlighterProps {
  text: string;
}

export default function WordHighlighter({ text }: WordHighlighterProps) {
  const POS = new Set([
    "great", "amazing", "excellent", "good", "love", "wonderful", "fantastic", 
    "happy", "positive", "best", "brilliant", "superb", "perfect", "awesome", 
    "incredible", "delightful", "outstanding"
  ]);
  
  const NEG = new Set([
    "terrible", "awful", "bad", "hate", "worst", "horrible", "poor", "sad", 
    "disappointing", "ugly", "dreadful", "pathetic", "broken", "fail", 
    "useless", "boring", "slow", "annoying", "negative"
  ]);

  const words = text.split(/(\s+)/);

  return (
    <div className="font-body text-base leading-loose p-4 bg-gray-50 rounded-card min-h-[80px]">
      {words.map((w, i) => {
        const clean = w.toLowerCase().replace(/[.,!?;:]/g, "");
        if (POS.has(clean)) {
          return (
            <span key={i} className="token-positive cursor-default" title="+0.3">
              {w}
            </span>
          );
        }
        if (NEG.has(clean)) {
          return (
            <span key={i} className="token-negative cursor-default" title="-0.3">
              {w}
            </span>
          );
        }
        return (
          <span key={i} className="token-neutral">
            {w}
          </span>
        );
      })}
    </div>
  );
}
