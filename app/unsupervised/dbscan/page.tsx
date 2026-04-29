'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScatterChart as ScatterIcon, Settings, Play, Pause, RefreshCw, Activity } from 'lucide-react';
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

export default function DBSCANPage() {
  const {
    data,
    setData,
    isTraining,
    setIsTraining,
    error,
    setError,
    handleFileUpload,
  } = useMLModel();

  const [epsilon, setEpsilon] = useState(10);
  const [minPts, setMinPts] = useState(4);
  const [assignments, setAssignments] = useState<number[]>([]);
  const [foundClusters, setFoundClusters] = useState(0);

  const generateSynthetic = useCallback(() => {
    const points = [];
    // Clustered data
    for (let c = 0; c < 3; c++) {
      const centerX = 20 + Math.random() * 60;
      const centerY = 20 + Math.random() * 60;
      for (let i = 0; i < 30; i++) {
        points.push([
          centerX + (Math.random() - 0.5) * 15,
          centerY + (Math.random() - 0.5) * 15,
          "unlabeled"
        ]);
      }
    }
    // Noise
    for (let i = 0; i < 20; i++) {
      points.push([Math.random() * 100, Math.random() * 100, "noise"]);
    }
    setData(points);
    setAssignments(new Array(points.length).fill(0));
  }, [setData]);

  useEffect(() => {
    generateSynthetic();
  }, [generateSynthetic]);

  const runDBSCAN = () => {
    if (!data || data.length === 0) return;
    setIsTraining(true);

    // Actual DBSCAN Logic
    const points = data.map((p, i) => ({
      x: Number(p[0]),
      y: Number(p[1]),
      id: i,
      cluster: 0,
      visited: false
    }));

    let clusterIdx = 0;

    const getNeighbors = (p: any) => {
      return points.filter(q => 
        Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2)) <= epsilon
      );
    };

    for (let i = 0; i < points.length; i++) {
      if (points[i].visited) continue;
      points[i].visited = true;

      const neighbors = getNeighbors(points[i]);
      if (neighbors.length < minPts) {
        points[i].cluster = -1; // Noise
      } else {
        clusterIdx++;
        points[i].cluster = clusterIdx;
        
        let seedSet = [...neighbors.filter(n => n.id !== points[i].id)];
        while (seedSet.length > 0) {
          const q = seedSet.pop();
          if (!q) continue;
          if (q.cluster === -1) q.cluster = clusterIdx;
          if (q.visited) continue;

          q.visited = true;
          const qNeighbors = getNeighbors(q);
          if (qNeighbors.length >= minPts) {
            seedSet.push(...qNeighbors);
          }
          if (q.cluster === 0) q.cluster = clusterIdx;
        }
      }
    }

    setAssignments(points.map(p => p.cluster));
    setFoundClusters(clusterIdx);
    setIsTraining(false);
  };

  const steps = [
    { title: 'Core Identification', description: 'Find points with at least MinPts within Epsilon radius.' },
    { title: 'Density Reachability', description: 'Connect points that belong to the neighborhood of core points.' },
    { title: 'Cluster Expansion', description: 'Recursively propagate cluster labels through reachable core points.' },
    { title: 'Noise Filtering', description: 'Isolate points that do not meet density criteria as outliers.' }
  ];

  const colors = ['#2dd4bf', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'];
  const uniqueClusterIds = Array.from(new Set(assignments)).sort((a,b) => a-b);

  const chartData = uniqueClusterIds.map(cid => ({
    name: cid === -1 ? 'Noise' : cid === 0 ? 'Unassigned' : `Cluster ${cid}`,
    points: data.filter((_, i) => assignments[i] === cid).map(p => ({ x: p[0], y: p[1] })),
    color: cid === -1 ? 'rgba(255,255,255,0.1)' : cid === 0 ? 'rgba(255,255,255,0.3)' : colors[cid % colors.length]
  }));

  return (
    <div className="min-h-screen bg-[#010a0a] text-white pb-24 selection:bg-teal-500/30">
       <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.03),transparent_40%)] pointer-events-none" />

       <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        <div className="mb-16 border-b border-teal-500/10 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
               <ScatterIcon className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-400">
              DBSCAN <span className="text-teal-400 not-italic">Density</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
              Partition spatial environments through connectivity thresholds. 
              Isolate high-variance noise from localized manifold clusters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
           <Card className="bg-black/40 border-teal-500/20 border backdrop-blur-3xl shadow-2xl overflow-hidden group">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-teal-500" /> Density Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-10">
              <div className="space-y-12">
                <div>
                   <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Epsilon (Radius)</label>
                    <span className="text-3xl font-black text-teal-400 font-mono tracking-tighter">{epsilon}</span>
                  </div>
                  <Slider value={[epsilon]} onValueChange={(v) => setEpsilon(v[0])} min={1} max={30} step={1} />
                </div>

                <div>
                   <div className="flex justify-between items-end mb-6">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">MinPts (Density)</label>
                    <span className="text-3xl font-black text-teal-400 font-mono tracking-tighter">{minPts}</span>
                  </div>
                  <Slider value={[minPts]} onValueChange={(v) => setMinPts(v[0])} min={1} max={15} step={1} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <p className="text-[8px] text-teal-500 font-black uppercase tracking-widest mb-1">Clusters</p>
                      <p className="text-2xl font-black text-white">{foundClusters}</p>
                   </div>
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <p className="text-[8px] text-red-500 font-black uppercase tracking-widest mb-1">Noise</p>
                      <p className="text-2xl font-black text-white">{assignments.filter(a => a === -1).length}</p>
                   </div>
                </div>

                <Button 
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all shadow-2xl"
                  onClick={runDBSCAN}
                  disabled={isTraining}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  {isTraining ? 'SCANNING...' : 'IDENTIFY CLUSTERS'}
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
              
              <Card className="bg-black/60 border-teal-500/20 border backdrop-blur-3xl p-10 h-[550px]">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-10">Geometric Density Map</h3>
                <div className="h-full pb-10">
                   <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis type="number" dataKey="x" stroke="#222" tick={false} />
                        <YAxis type="number" dataKey="y" stroke="#222" tick={false} />
                        <ChartTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Legend />
                        {chartData.map((cluster) => (
                           <Scatter 
                             key={cluster.name} 
                             name={cluster.name} 
                             data={cluster.points} 
                             fill={cluster.color} 
                             shape={cluster.name === 'Noise' ? 'cross' : 'circle'}
                           />
                        ))}
                      </ScatterChart>
                   </ResponsiveContainer>
                </div>
              </Card>
           </div>
        </div>

        <AlgorithmInfo 
          title="Density-Based Spatial Clustering"
          description="DBSCAN is a density-based clustering non-parametric algorithm: given a set of points in some space, it groups together points that are closely packed together, marking as outliers points that lie alone in low-density regions."
          steps={steps}
        />
       </div>
    </div>
  );
}
