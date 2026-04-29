export default function Loading() {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full max-w-[500px] h-[350px] md:h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-full max-w-[500px] h-[350px] md:h-[500px] bg-teal-600/10 blur-[150px] rounded-full" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Skeleton Ring */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-t-2 border-r-2 border-purple-500 rounded-full animate-spin [animation-duration:1s]" />
          <div className="absolute inset-2 border-b-2 border-l-2 border-teal-500 rounded-full animate-spin [animation-duration:1.5s] direction-reverse" />
          <div className="absolute inset-4 border-t-2 border-l-2 border-indigo-500 rounded-full animate-spin [animation-duration:2s]" />
        </div>
        
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/50 animate-pulse">
          Initializing Engine
        </h2>
        <div className="flex gap-2 mt-4">
           <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.3s]" />
           <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]" />
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
