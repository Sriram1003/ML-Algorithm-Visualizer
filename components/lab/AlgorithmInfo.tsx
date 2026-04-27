import React from 'react';

interface AlgorithmStep {
  title: string;
  description: string;
}

interface AlgorithmInfoProps {
  title: string;
  description: string;
  steps: AlgorithmStep[];
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ title, description, steps }) => (
  <section className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/20 shadow-2xl" aria-label={`Information about ${title}`}>
    <h2 className="text-3xl font-black text-white mb-6 tracking-tight uppercase">
      Mechanism <span className="text-purple-400">Analysis</span>
    </h2>
    <div className="mb-10 p-6 bg-white/5 rounded-xl border border-white/5">
      <h3 className="text-purple-400 font-bold mb-2 uppercase tracking-widest text-xs">{title}</h3>
      <p className="text-gray-300 leading-relaxed italic">
        {description}
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {steps.map((step, idx) => (
        <article key={idx} className="bg-gradient-to-br from-purple-900/40 to-black p-6 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all group">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/40 transition-colors" aria-hidden="true">
             <span className="text-purple-400 font-black">{idx + 1}</span>
          </div>
          <h4 className="font-bold text-white mb-2 uppercase tracking-tight">{step.title}</h4>
          <p className="text-sm text-gray-400 leading-relaxed font-light">{step.description}</p>
        </article>
      ))}
    </div>
  </section>
);

AlgorithmInfo.displayName = 'AlgorithmInfo';

export default React.memo(AlgorithmInfo);
