'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Caught by App Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <div className="max-w-xl w-full text-center p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
        <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white italic">
          Visualization Failed to Load
        </h2>
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          The requested interface encountered an unexpected runtime exception. 
          Our telemetry has logged the error payload.
        </p>
        <div className="bg-black/40 border border-red-500/10 p-4 rounded-2xl text-left font-mono text-[10px] text-red-400/80 mb-10 overflow-x-auto">
          {error.message || "Unknown runtime exception"}
        </div>
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Retry Operation
        </button>
      </div>
    </div>
  );
}
