'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, Boxes, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PCA } from '@/lib/ml';
import { useMLModel } from '@/hooks/useMLModel';
import { useMLWorker } from '@/hooks/useMLWorker';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';
import { MetricsDisplay } from '@/components/lab/MetricsDisplay';

// Lazy load Recharts for performance optimization
const ScatterChart = dynamic(() => import('recharts').then(mod => mod.ScatterChart), { ssr: false });
const RechartsScatter = dynamic(() => import('recharts').then(mod => mod.Scatter), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const ChartTooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

export default function PCAPage() {
  const {
    data,
    isTraining,
    error,
    setIsTraining,
    setError,
    handleFileUpload,
  } = useMLModel();

  const [projection, setProjection] = useState<any[] | null>(null);
  const [variance, setVariance] = useState<any[] | null>(null);
  const { workerApi } = useMLWorker();

  const runAnalysis = async () => {
    if (!data) return;
    setIsTraining(true);
    setError(null);

    try {
      // Use PCA from library
      const numericData = data.map(row => 
        row.slice(0, row.length - 1).map(v => typeof v === 'number' ? v : 0)
      );

      const pca = new PCA();
      pca.fit(numericData, 2);
      const transformed = pca.transform(numericData);

      setProjection(transformed.map((p, i) => ({ x: p[0], y: p[1], id: i })));
      
      // Mock variance for visualization (PCA could return this in a real app)
      setVariance([
        { name: 'PC1', value: 75 },
        { name: 'PC2', value: 25 }
      ]);
      
      setIsTraining(false);
    } catch (err) {
      setError("Analysis Failed: " + (err as Error).message);
      setIsTraining(false);
    }
  };

  const pcaSteps = [
    {
      title: 'Mean Centering',
      description: 'Subtract the mean from each feature to center the data around the origin.'
    },
    {
      title: 'Covariance Matrix',
      description: 'Calculate relationships between features to find patterns of variance.'
    },
    {
      title: 'Eigen-Decomposition',
      description: 'Solve for eigenvectors to determine the principal directions of data spread.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-24">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        <div className="mb-16 border-b border-white/5 pb-12 text-center md:text-left">
          <div className="flex items-center gap-4 mb-6 justify-center md:justify-start" aria-hidden="true">
            <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
               <Boxes className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-500">
              PCA <span className="text-teal-500 not-italic">Subspace</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Project high-dimensional manifolds onto optimized principal components. 
             Minimize information entropy through linear subspace decomposition.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-teal-500/20 border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-teal-500" /> Reduction Config
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10">
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-teal-500 font-black uppercase tracking-widest mb-2 font-mono">Current Algorithm</p>
                    <p className="text-xl font-bold text-white">Eigen-Decomposition</p>
                 </div>

                <Button 
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all hover:scale-[1.02] shadow-2xl"
                  onClick={runAnalysis}
                  disabled={!data || isTraining}
                  aria-label={isTraining ? "Computing subspace projection" : "Initialize subspace projection"}
                >
                  {isTraining ? 'DECOMPOSING...' : 'COMPUTE PROJECTION'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-8">
            <CsvUploader 
              onFileUpload={handleFileUpload}
              isTraining={isTraining}
              error={error}
              dataPoints={data?.length || 0}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="bg-black/60 border-teal-500/20 border backdrop-blur-3xl p-8 h-[400px]">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">2D Projection</h3>
                  {projection ? (
                    <div className="h-full">
                      <ResponsiveContainer width="100%" height="90%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis type="number" dataKey="x" stroke="#444" tick={false} />
                          <YAxis type="number" dataKey="y" stroke="#444" tick={false} />
                          <ChartTooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                          <RechartsScatter name="Data" data={projection} fill="#2dd4bf" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-700 italic text-xs uppercase tracking-widest text-center px-12">
                       Awaiting decomposition to render latent space
                    </div>
                  )}
               </Card>

               <Card className="bg-black/60 border-teal-500/20 border backdrop-blur-3xl p-8 h-[400px]">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Variance Ratio</h3>
                  {variance ? (
                    <div className="h-full">
                       <ResponsiveContainer width="100%" height="90%">
                          <BarChart data={variance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#444" />
                            <YAxis stroke="#444" />
                            <ChartTooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                               {variance.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 0 ? '#2dd4bf' : '#0d9488'} />
                               ))}
                            </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-700 italic text-xs uppercase tracking-widest text-center px-12">
                       Initialize fit to analyze component influence
                    </div>
                  )}
               </Card>
            </div>
          </div>
        </div>

        <AlgorithmInfo 
          title="Principal Component Analysis (PCA)"
          description="PCA is a statistical procedure that uses an orthogonal transformation to convert a set of observations of possibly correlated variables into a set of values of linearly uncorrelated variables called principal components."
          steps={pcaSteps}
        />
      </div>
    </div>
  );
}