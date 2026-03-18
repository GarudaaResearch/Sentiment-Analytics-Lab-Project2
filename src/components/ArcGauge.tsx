"use client";

import { motion } from "framer-motion";

interface ArcGaugeProps {
  score: number;
  min?: number;
  max?: number;
  size?: number;
  showLabels?: boolean;
}

export default function ArcGauge({
  score,
  min = -1,
  max = 1,
  size = 280,
  showLabels = true
}: ArcGaugeProps) {
  const pct = (score - min) / (max - min);
  const r = 80, cx = 100, cy = 105;
  const circumference = Math.PI * r;
  const offset = circumference * (1 - pct);
  
  // Color logic
  const color = score > 0.4 ? "#1D9E75" : score > 0.1 ? "#4ade80" : score > -0.1 ? "#EF9F27" : score > -0.4 ? "#f87171" : "#E24B4A";
  const label = score > 0.4 ? "Very Positive" : score > 0.1 ? "Positive" : score > -0.1 ? "Neutral" : score > -0.4 ? "Negative" : "Very Negative";
  
  const angle = pct * 180 - 90;
  const needleX = cx + r * Math.cos((angle * Math.PI) / 180);
  const needleY = cy + r * Math.sin((angle * Math.PI) / 180);

  return (
    <div className="flex flex-col items-center" style={{ maxWidth: size }}>
      <svg viewBox="0 0 200 130" className="w-full h-auto">
        {/* Background arc */}
        <path
          d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
          fill="none"
          stroke="#E5F0EC"
          strokeWidth="16"
          strokeLinecap="round"
        />
        
        {/* Colored zones background */}
        {[
          ["#E24B4A", 0, 0.2],
          ["#f87171", 0.2, 0.35],
          ["#EF9F27", 0.35, 0.65],
          ["#4ade80", 0.65, 0.8],
          ["#1D9E75", 0.8, 1]
        ].map(([c, from, to], i) => {
          const start = circumference * (1 - (from as number));
          return (
            <path
              key={i}
              d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
              fill="none"
              stroke={c as string}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={start}
              opacity="0.15"
            />
          );
        })}

        {/* Active arc */}
        <motion.path
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
        />

        {/* Needle dot */}
        <motion.circle
          animate={{ cx: needleX, cy: needleY }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          cx={needleX}
          cy={needleY}
          r="8"
          fill={color}
          stroke="white"
          strokeWidth="2"
        />

        {/* Center text */}
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fill={color}
          fontSize="22"
          fontWeight="bold"
          fontFamily="JetBrains Mono, monospace"
          className="transition-colors duration-400"
        >
          {score >= 0 ? "+" : ""}{score.toFixed(3)}
        </text>
        
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fill="#6b7280"
          fontSize="10"
          className="font-ui"
        >
          {label}
        </text>

        {showLabels && (
          <>
            <text x={cx - r} y={cy + 18} textAnchor="middle" fill="#aaa" fontSize="9" className="font-ui">−1.0</text>
            <text x={cx + r} y={cy + 18} textAnchor="middle" fill="#aaa" fontSize="9" className="font-ui">+1.0</text>
            <text x={cx} y={cy + 18} textAnchor="middle" fill="#aaa" fontSize="9" className="font-ui">0</text>
          </>
        )}
      </svg>
    </div>
  );
}
