import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Metrics } from '@/lib/ml';

interface MetricsDisplayProps {
  metrics: Metrics | null;
  title?: string;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics, title = "Inference Metrics" }) => {
  if (!metrics) {
    return (
      <Card className="bg-black/60 border-white/5 border backdrop-blur-3xl h-full flex items-center justify-center min-h-[300px]">
        <div className="text-center group">
           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 group-hover:text-purple-500/50 transition-colors mb-2">System Idle</div>
           <p className="text-gray-600 text-xs italic font-light tracking-wide">Execute training to reveal performance matrices.</p>
        </div>
      </Card>
    );
  }

  const metricItems = [
    { label: 'Accuracy', value: metrics.accuracy, color: 'emerald' },
    { label: 'Precision', value: metrics.precision, color: 'purple' },
    { label: 'Recall', value: metrics.recall, color: 'blue' },
    { label: 'F1 Score', value: metrics.f1, color: 'pink' },
  ].filter(item => item.value !== undefined);

  return (
    <Card className="bg-black/60 border-purple-500/20 border backdrop-blur-3xl h-full shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-6">
        <CardTitle className="text-white text-sm uppercase tracking-[0.3em] font-black flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 px-8">
        <div className="grid grid-cols-2 gap-6">
          {metricItems.map((item, idx) => (
            <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all group">
              <h3 className={`text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 group-hover:text-${item.color}-400 transition-colors`}>
                {item.label}
              </h3>
              <p className="text-4xl font-black text-white tracking-tighter">
                {((item.value || 0) * 100).toFixed(1)}<span className="text-lg font-light text-gray-600 ml-1">%</span>
              </p>
              <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className={`h-full bg-gradient-to-r from-purple-600 to-${item.color}-400 transition-all duration-1000 ease-out`}
                   style={{ width: `${(item.value || 0) * 100}%` }}
                 />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
