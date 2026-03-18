"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Layers, Cpu, Zap, Activity } from "lucide-react";

const LAYERS = [
  { id: "input", name: "Input", size: 1, desc: "Token IDs [1, 45, 12...]" },
  { id: "embed", name: "Embedding", size: 4, desc: "128-dimensional dense vectors" },
  { id: "bilstm", name: "BiLSTM", size: 8, desc: "Bidirectional context mapping" },
  { id: "dense", name: "Dense", size: 4, desc: "Feature aggregation" },
  { id: "output", name: "Sigmoid", size: 1, desc: "Sentiment probability (0-1)" },
];

export default function LSTMViewer() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % LAYERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card bg-gray-900 border border-gray-800 p-8 overflow-hidden">
      <div className="flex items-center justify-between mb-10 text-white">
        <div>
          <h3 className="font-heading text-xl">LSTM Layer Flow Visualization</h3>
          <p className="font-ui text-xs text-gray-500">Neural Network State Propagation</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-code text-gray-400">STATUS: ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 py-8">
        {LAYERS.map((layer, i) => (
          <div key={layer.id} className="relative flex flex-col items-center group">
            {/* Connection Wire */}
            {i < LAYERS.length - 1 && (
              <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-800 z-0">
                <motion.div 
                  className="h-full bg-accent shadow-[0_0_10px_#1D9E75]"
                  animate={{ 
                    width: activeLayer === i ? "100%" : "0%",
                    opacity: activeLayer === i ? 1 : 0
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
            
            {/* Layer Node */}
            <motion.div
              animate={{ 
                scale: activeLayer === i ? 1.1 : 1,
                borderColor: activeLayer === i ? "#1D9E75" : "rgb(31, 41, 55)",
                backgroundColor: activeLayer === i ? "rgba(29, 158, 117, 0.1)" : "transparent"
              }}
              className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center relative z-10 transition-colors duration-500`}
            >
              <div className="flex flex-col items-center gap-1">
                {i === 0 && <Cpu className={`w-6 h-6 ${activeLayer === i ? "text-accent" : "text-gray-600"}`} />}
                {i === 1 && <Layers className={`w-6 h-6 ${activeLayer === i ? "text-accent" : "text-gray-600"}`} />}
                {i === 2 && <Brain className={`w-6 h-6 ${activeLayer === i ? "text-accent" : "text-gray-600"}`} />}
                {i === 3 && <Activity className={`w-6 h-6 ${activeLayer === i ? "text-accent" : "text-gray-600"}`} />}
                {i === 4 && <Zap className={`w-6 h-6 ${activeLayer === i ? "text-accent" : "text-gray-600"}`} />}
                <span className={`text-[10px] font-bold font-ui ${activeLayer === i ? "text-white" : "text-gray-600"}`}>{layer.name}</span>
              </div>

              {/* Matrix visualization dots */}
              <div className="absolute -bottom-1 flex gap-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <motion.div 
                    key={j}
                    animate={{ 
                      opacity: activeLayer === i ? [0.2, 1, 0.2] : 0.2,
                      scale: activeLayer === i ? [1, 1.2, 1] : 1
                    }}
                    transition={{ repeat: Infinity, duration: 2, delay: j * 0.2 }}
                    className="w-1 h-1 rounded-full bg-accent"
                  />
                ))}
              </div>
            </motion.div>

            {/* Tooltip */}
            <div className={`mt-4 text-center transition-opacity duration-300 ${activeLayer === i ? "opacity-100" : "opacity-0 invisible md:visible md:opacity-30"}`}>
              <div className="text-[11px] font-code text-accent font-bold mb-1">{layer.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-800 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-[10px] text-gray-500 font-ui uppercase">Batch Size</div>
            <div className="text-sm font-code text-white">32</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-gray-500 font-ui uppercase">Sequence Length</div>
            <div className="text-sm font-code text-white">MAX_LEN=100</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-gray-500 font-ui uppercase">Learning Rate</div>
            <div className="text-sm font-code text-white text-accent">1e-4</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-gray-500 font-ui uppercase">Current Activation</div>
            <div className="text-sm font-code text-white">{LAYERS[activeLayer].name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
