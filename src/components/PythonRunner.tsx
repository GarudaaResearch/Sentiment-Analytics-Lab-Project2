"use client";

import { useState } from "react";
import { usePyodide } from "@/hooks/usePyodide";
import { Play, Terminal, Loader2, AlertCircle } from "lucide-react";

interface PythonRunnerProps {
  code: string;
  onRun?: (output: string) => void;
  className?: string;
  showTerminal?: boolean; // Currently console is always shown, but this matches future needs
}

export default function PythonRunner({ code, onRun, className }: PythonRunnerProps) {
  const { loading, error, runCode } = usePyodide();
  const [output, setOutput] = useState<string>("# Click ▶ Run to execute...");
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setOutput(">>> Running...");
    
    const result = await runCode(code);
    setOutput(result || ">>> [No Output]");
    setRunning(false);
    
    if (onRun) onRun(result);
  };

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-3 text-red-700 ${className}`}>
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm font-ui">{error}</span>
      </div>
    );
  }

  return (
    <div className={`bg-gray-950 rounded-lg overflow-hidden border border-gray-800 flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-code text-xs text-gray-400 uppercase tracking-wider font-semibold">Console</span>
        </div>
        <button
          onClick={handleRun}
          disabled={loading || running}
          className="flex items-center gap-1.5 font-ui text-xs bg-accent hover:bg-primary-600 text-white px-3 py-1.5 rounded transition-all font-semibold disabled:opacity-50 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Initializing...
            </>
          ) : running ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Running...
            </>
          ) : (
            <>
              <Play className="w-3 h-3" /> Run Code
            </>
          )}
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-auto scrollbar-thin">
        <pre className="font-code text-xs leading-relaxed whitespace-pre-wrap">
          {output.split("\n").map((line, i) => {
            let cls = "text-gray-300";
            if (line.startsWith(">>>")) cls = "text-accent font-semibold";
            if (line.includes("POSITIVE") || line.includes("✅")) cls = "text-green-400";
            if (line.includes("NEGATIVE") || line.includes("Traceback")) cls = "text-red-400";
            if (line.startsWith("#")) cls = "text-gray-500 italic";
            
            return <div key={i} className={cls}>{line || "\u00A0"}</div>;
          })}
        </pre>
      </div>
    </div>
  );
}
