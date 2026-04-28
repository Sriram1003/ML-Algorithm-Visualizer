'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#020202] text-white flex flex-col items-center justify-center min-h-screen font-sans">
        <div className="max-w-2xl text-center px-6">
          <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-white">Critical System Failure</h1>
          <p className="text-gray-400 mb-12 text-lg">
            A fatal error occurred at the root level of the application. The system could not recover.
          </p>
          <div className="bg-black/50 border border-white/5 p-6 rounded-2xl text-left font-mono text-sm text-red-400 mb-12 overflow-x-auto">
            {error.message || "Unknown root boundary error"}
          </div>
          <button
            onClick={() => reset()}
            className="px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-gray-200 transition-colors"
          >
            Reboot Engine
          </button>
        </div>
      </body>
    </html>
  );
}
