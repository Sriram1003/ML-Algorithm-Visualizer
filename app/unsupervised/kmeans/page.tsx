'use client';

import { useState, useEffect, useCallback } from 'react';
import { Boxes, Settings, Play, Pause, RefreshCw, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import dynamic from 'next/dynamic';
import { useMLModel } from '@/hooks/useMLModel';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';

const ScatterChart = dynamic(() => import('recharts').then(mod => mod.ScatterChart) as any, { ssr: false });
const Scatter = dynamic(() => import('recharts').then(mod => mod.Scatter) as any, { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis) as any, { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis) as any, { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid) as any, { ssr: false });
const ChartTooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip) as any, { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend) as any, { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer) as any, { ssr: false });

const KMeansPage = () => {
  const {
    data,
    setData,
    isTraining,
    setIsTraining,
    error,
    setError,
    handleFileUpload
  } = useMLModel();

  const [numClusters, setNumClusters] = useState(3);
  const [centroids, setCentroids] = useState<{ x: number, y: number }[]>([]);
  const [assignments, setAssignments] = useState<number[]>([]);
  const [iterations, setIterations] = useState(0);

  const initializeCentroids = useCallback((points: any[]) => {
    if (!points || points.length === 0) return;
    const newCentroids = Array.from({ length: numClusters }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setCentroids(newCentroids);
    setAssignments(Array(points.length).fill(0));
  }, [numClusters]);

  useEffect(() => {
    // Generate default synthetic data
    const newData = Array.from({ length: 150 }, () => [
      Math.random() * 100,
      Math.random() * 100,
      "unlabeled"
    ]);
    setData(newData);
    initializeCentroids(newData);
  }, [setData, initializeCentroids]); // numClusters causes it to re-init centeroids properly

  const stepKMeans = useCallback(() => {
    if (!data || data.length === 0) return;

    // Assignment Step
    const newAssignments = data.map(point => {
      let minDist = Infinity;
      let clusterId = 0;
      centroids.forEach((centroid, i) => {
        const dist = Math.sqrt(Math.pow(Number(point[0]) - centroid.x, 2) + Math.pow(Number(point[1]) - centroid.y, 2));
        if (dist < minDist) {
          minDist = dist;
          clusterId = i;
        }
      });
      return clusterId;
    });

    // Update Step
    const newCentroids = centroids.map((_, i) => {
      const clusterPoints = data.filter((_, index) => newAssignments[index] === i);
      if (clusterPoints.length === 0) return centroids[i];

      const sumX = clusterPoints.reduce((sum, p) => sum + Number(p[0]), 0);
      const sumY = clusterPoints.reduce((sum, p) => sum + Number(p[1]), 0);
      return {
        x: sumX / clusterPoints.length,
        y: sumY / clusterPoints.length
      };
    });

    setAssignments(newAssignments);
    setCentroids(newCentroids);
    setIterations(prev => prev + 1);
  }, [data, centroids, setAssignments, setCentroids, setIterations]);

  useEffect(() => {
    let interval: any;
    if (isTraining) {
      interval = setInterval(stepKMeans, 500);
    }
    return () => clearInterval(interval);
  }, [isTraining, stepKMeans]);

  const reset = () => {
    setIsTraining(false);
    setIterations(0);
    initializeCentroids(data);
  };

  const chartColors = ['#a855f7', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

  const kmeansSteps = [
    {
      title: 'Centroid Initialization',
      description: 'Randomly place K initial centroids in the data space.'
    },
    {
      title: 'Cluster Assignment',
      description: 'Assign each data point to the nearest centroid based on Euclidean distance.'
    },
    {
      title: 'Mean Recalculation',
      description: 'Move centroids to the geometric center (mean) of their assigned points.'
    }
  ];

  const processedChartData = Array.from({ length: numClusters }).map((_, i) => ({
    name: `Cluster ${i + 1}`,
    data: data?.filter((_, index) => assignments[index] === i).map(p => ({ x: p[0], y: p[1] })) || [],
    color: chartColors[i % chartColors.length]
  }));

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-24">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
               <Boxes className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500">
              K-Means <span className="text-purple-500 not-italic">Clustering</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Explore partition-based clustering via iterative centroid optimization. 
             Visualize the convergence of spatial heuristics in high-fidelity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-purple-500/20 border backdrop-blur-3xl shadow-2xl overflow-hidden group">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-500" /> Kernel Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-10">
              <div className="space-y-12">
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Number of Clusters (K)</label>
                    <span className="text-3xl font-black text-purple-500 font-mono tracking-tighter">{numClusters}</span>
                  </div>
                  <Slider 
                    value={[numClusters]} 
                    onValueChange={(v) => { setNumClusters(v[0]); reset(); }} 
                    min={2} 
                    max={5} 
                    step={1}
                    className="py-4"
                  />
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[10px] text-purple-500 font-black uppercase tracking-widest mb-2 font-mono">Iteration Count</p>
                   <p className="text-4xl font-black text-white font-mono tracking-tighter">{iterations}</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    className={`flex-1 h-16 rounded-xl font-black uppercase tracking-widest transition-all ${isTraining ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-2xl'}`}
                    onClick={() => setIsTraining(!isTraining)}
                  >
                    {isTraining ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                    {isTraining ? 'Halt' : 'Launch'}
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-16 px-8 rounded-xl border-white/5 text-white/40 hover:text-white hover:bg-white/5"
                    onClick={reset}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                </div>
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
            
            <Card className="bg-black/60 border-purple-500/20 border backdrop-blur-3xl p-10 h-[500px] relative">
              <div className="absolute top-8 right-8 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Live Simulation</span>
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-10">Cluster Visualization</h3>
              <div className="h-full pb-10">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis type="number" dataKey="x" stroke="#333" />
                    <YAxis type="number" dataKey="y" stroke="#333" />
                    <ChartTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
                    <Legend iconType="circle" />
                    {processedChartData.map((cluster) => (
                      <Scatter
                        key={cluster.name}
                        name={cluster.name}
                        data={cluster.data}
                        fill={cluster.color}
                        animationDuration={300}
                      />
                    ))}
                    <Scatter
                      name="Centroids"
                      data={centroids}
                      fill="#fff"
                      shape="cross"
                      size={200}
                      strokeWidth={2}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        <AlgorithmInfo 
          title="K-Means Partitioning"
          description="K-Means is a vector quantization method that aims to partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean."
          steps={kmeansSteps}
        />
      </div>
    </div>
  );
};

export default KMeansPage;