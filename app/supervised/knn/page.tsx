'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, LayoutGrid } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { KNN, trainTestSplit, calculateClassificationMetrics } from '@/lib/ml';
import { useMLModel } from '@/hooks/useMLModel';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';
import { MetricsDisplay } from '@/components/lab/MetricsDisplay';

const KNNPage: React.FC = () => {
  const {
    data,
    isTraining,
    metrics,
    error,
    setIsTraining,
    setMetrics,
    setError,
    handleFileUpload,
  } = useMLModel();

  const [nNeighbors, setNNeighbors] = useState<number>(5);
  const [weights, setWeights] = useState<string>('uniform');

  const trainModel = () => {
    if (!data) return;
    setIsTraining(true);
    
    setTimeout(() => {
        try {
            const X = data.map(row => row.slice(0, -1).map(v => typeof v === 'string' ? 0 : v));
            const y = data.map(row => row[row.length - 1]);

            const { X_train, y_train, X_test, y_test } = trainTestSplit(X, y);

            const knn = new KNN(nNeighbors);
            const predictions = knn.predict(X_train as number[][], y_train, X_test as number[][]);
            
            const results = calculateClassificationMetrics(y_test, predictions);
            setMetrics(results);
            setIsTraining(false);
        } catch (err) {
            setError("Failed to train model: " + (err as Error).message);
            setIsTraining(false);
        }
    }, 500);
  };

  const knnSteps = [
    {
      title: 'Distance Metric',
      description: 'KNN uses distance metrics like Euclidean or Manhattan to find the nearest neighbors.'
    },
    {
      title: 'Voting Mechanism',
      description: 'The class of a data point is determined by majority voting among its neighbors.'
    },
    {
      title: 'Hyperparameter K',
      description: 'The number of neighbors (K) is a critical hyperparameter that affects model performance.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-24">
      {/* Background patterns */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        {/* Header Section */}
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
               <LayoutGrid className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter uppercase italic">
              KNN <span className="text-purple-500 not-italic">Lab</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Deploy space-based classification via multi-dimensional neighbor analysis. 
             Optimize distance heuristics and boundary density.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Controls */}
          <Card className="bg-black/40 border-purple-500/20 border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-purple-500/10 transition-colors" />
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-500" /> Model Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Neighbors (K)</label>
                    <span className="text-purple-400 font-mono text-xl font-bold">{nNeighbors}</span>
                  </div>
                  <Slider
                    value={[nNeighbors]}
                    onValueChange={([value]) => setNNeighbors(value)}
                    min={1}
                    max={20}
                    step={1}
                    className="py-4"
                  />
                  <p className="text-[10px] text-gray-500 italic">Determines the local density threshold for classification.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Weight Distribution</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['uniform', 'distance'].map((w) => (
                      <button
                        key={w}
                        onClick={() => setWeights(w)}
                        className={`p-3 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                          weights === w 
                            ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                            : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl group"
                  onClick={trainModel}
                  disabled={!data || isTraining}
                >
                  {isTraining ? (
                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                       Computing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                       <Zap className="h-5 w-5 fill-white group-hover:animate-pulse" />
                       Initialize Logic
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Uploader and Metrics */}
          <div className="lg:col-span-2 space-y-8">
            <CsvUploader 
              onFileUpload={handleFileUpload}
              isTraining={isTraining}
              error={error}
              dataPoints={data?.length || 0}
            />
            
            <MetricsDisplay metrics={metrics} />
          </div>
        </div>

        {/* Info Section */}
        <AlgorithmInfo 
          title="K-Nearest Neighbors (KNN)"
          description="K-Nearest Neighbors is a non-parametric, lazy learning algorithm. It stores all available cases and classifies new cases based on a similarity measure (e.g., distance functions). It's effective in low-dimensional settings with non-linear boundaries."
          steps={knnSteps}
        />
      </div>
    </div>
  );
};

export default KNNPage;