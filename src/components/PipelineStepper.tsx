"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Play, RotateCcw } from "lucide-react";

const STEPS = [
  {
    title: "Raw Text",
    desc: "The original input string.",
    example: "I LOVE this movie!! It's amazing... #classic",
    output: "I LOVE this movie!! It's amazing... #classic",
  },
  {
    title: "Lowercasing",
    desc: "Normalize text to lowercase to avoid case sensitivity.",
    example: "i love this movie!! it's amazing... #classic",
    output: "i love this movie!! it's amazing... #classic",
  },
  {
    title: "Punctuation Removal",
    desc: "Remove special characters that don't carry sentiment.",
    example: "i love this movie its amazing classic",
    output: "i love this movie its amazing classic",
  },
  {
    title: "Stopword Removal",
    desc: "Filter out common words (the, a, is) that add noise.",
    example: "love movie amazing classic",
    output: "love movie amazing classic",
  },
  {
    title: "Tokenization",
    desc: "Split the string into individual word tokens.",
    example: "['love', 'movie', 'amazing', 'classic']",
    output: ["love", "movie", "amazing", "classic"],
  },
];

export default function PipelineStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const next = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="card border border-primary-100 p-6 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-heading text-xl text-primary-600">NLP Preprocessing Pipeline</h3>
          <p className="font-body text-xs text-gray-400">Step through the transformation process</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="flex items-center bg-primary-50 rounded-lg p-1">
            <button onClick={prev} disabled={currentStep === 0} className="p-1 px-2 disabled:opacity-30">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <span className="font-code text-xs px-2 text-primary-600 font-bold">
              {currentStep + 1} / {STEPS.length}
            </span>
            <button onClick={next} disabled={currentStep === STEPS.length - 1} className="p-1 px-2 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="relative mb-12 px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2" />
        <motion.div 
          className="absolute top-1/2 left-0 h-0.5 bg-accent -translate-y-1/2 transition-all"
          animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-4 h-4 rounded-full border-2 transition-all relative z-10 ${
                i <= currentStep ? "bg-accent border-accent" : "bg-white border-gray-200"
              }`}
            >
              {i === currentStep && (
                <motion.div layoutId="activeStep" className="absolute -inset-2 rounded-full border border-accent/20 bg-accent/10" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider">
              Step {currentStep + 1}: {STEPS[currentStep].title}
            </div>
            <p className="font-body text-gray-700 leading-relaxed">
              {STEPS[currentStep].desc}
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 font-code text-sm text-gray-600 italic">
              "Note: This step {currentStep === 0 ? "takes raw input" : "transforms the previous output"}."
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="bg-gray-950 rounded-xl p-6 shadow-inner relative min-h-[160px] flex flex-col justify-center">
          <div className="absolute top-3 left-4 flex gap-1.5 opacity-40">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="font-code text-lg text-white break-all text-center leading-relaxed"
            >
              {Array.isArray(STEPS[currentStep].output) ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {(STEPS[currentStep].output as string[]).map((token, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-2 py-1 bg-accent/20 border border-accent/40 rounded text-accent"
                    >
                      '{token}'
                    </motion.span>
                  ))}
                </div>
              ) : (
                STEPS[currentStep].output
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => currentStep === STEPS.length - 1 ? reset() : next()}
          className="btn-primary group"
        >
          {currentStep === STEPS.length - 1 ? "Start Over" : "Continue Pipeline"} 
          <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${currentStep === STEPS.length - 1 ? "rotate-180" : "group-hover:translate-x-1"}`} />
        </button>
      </div>
    </div>
  );
}
