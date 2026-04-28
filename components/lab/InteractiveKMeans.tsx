'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { useMLWorker } from '@/hooks/useMLWorker';
import { RotateCcw, Download, FileSpreadsheet, Layers, Share2, Zap, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Storage } from '@/lib/storage';
import { Exporter } from '@/lib/export';
import { Analytics } from '@/lib/analytics';
import { toast } from 'sonner'; // Using sonner if available, else fallback to alert

const COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];

export function InteractiveKMeans() {
  const { workerApi } = useMLWorker();
  
  // Base Data
  const [dataPoints, setDataPoints] = useState(() => {
    // Check for shared URL data
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedData = urlParams.get('data');
      if (sharedData) {
        try {
          return JSON.parse(atob(decodeURIComponent(sharedData)));
        } catch (e) {
          console.error("Invalid shared data", e);
        }
      }
    }
    return Storage.get('kmeans_data', Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      cluster: -1
    })));
  });

  const [clusters, setClusters] = useState(Storage.get('kmeans_k', 3));
  const [centroids, setCentroids] = useState<{x: number, y: number}[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [benchmark, setBenchmark] = useState({ timeMs: 0, iterations: 0 });
  
  // Keep original unclustered data for comparison
  const [originalPoints, setOriginalPoints] = useState(dataPoints.map((p: any) => ({ ...p, cluster: -1 })));

  const trainKMeans = useCallback(async () => {
    if (!workerApi) return;
    setIsTraining(true);
    const start = performance.now();
    
    try {
      const X = dataPoints.map((p: any) => [p.x, p.y]);
      const { centroids: newCentroids, clusters: newAssignments, iterations } = await workerApi.trainKMeans(X, clusters);
      
      const coloredPoints = dataPoints.map((p: any, i: number) => ({
        ...p,
        cluster: newAssignments[i]
      }));
      
      setDataPoints(coloredPoints);
      setCentroids(newCentroids.map((c: any) => ({ x: c[0], y: c[1] })));
      
      const end = performance.now();
      setBenchmark({ timeMs: end - start, iterations: iterations || 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setIsTraining(false);
    }
  }, [dataPoints, clusters, workerApi]);

  useEffect(() => {
    Storage.set('kmeans_k', clusters);
    Storage.set('kmeans_data', dataPoints);
    trainKMeans();
  }, [clusters, workerApi, trainKMeans]); 

  const addDataPoint = (e: any) => {
    if (e && e.activeCoordinate) {
      const newPoints = [...dataPoints, { x: Math.random() * 100, y: Math.random() * 100, cluster: -1 }];
      setDataPoints(newPoints);
      setOriginalPoints(newPoints.map((p: any) => ({ ...p, cluster: -1 })));
      Analytics.trackEvent('add_data_point', { algorithm: 'KMeans' });
    }
  };

  const resetData = () => {
    const fresh = Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      cluster: -1
    }));
    setDataPoints(fresh);
    setOriginalPoints(fresh);
    Analytics.trackButtonClick('reset_scatter', 'KMeans');
  };

  const loadStorytellingDataset = (type: 'blobs' | 'moons' | 'circles') => {
    let fresh: any[] = [];
    if (type === 'blobs') {
      // 3 clear blobs
      fresh = [
        ...Array.from({length: 50}, () => ({ x: 20 + Math.random()*15, y: 20 + Math.random()*15, cluster: -1 })),
        ...Array.from({length: 50}, () => ({ x: 80 + Math.random()*15, y: 80 + Math.random()*15, cluster: -1 })),
        ...Array.from({length: 50}, () => ({ x: 20 + Math.random()*15, y: 80 + Math.random()*15, cluster: -1 }))
      ];
      setClusters(3);
    } else if (type === 'moons') {
      // Interleaved moons
      fresh = Array.from({length: 150}, (_, i) => {
        const t = Math.random() * Math.PI;
        const group = i % 2;
        return {
          x: group === 0 ? 50 + Math.cos(t)*30 + Math.random()*5 : 50 + 15 + Math.cos(t)*30 + Math.random()*5,
          y: group === 0 ? 50 + Math.sin(t)*30 + Math.random()*5 : 50 - 15 + Math.sin(t)*30 + Math.random()*5,
          cluster: -1
        };
      });
      setClusters(2);
    }
    setDataPoints(fresh);
    setOriginalPoints(fresh);
    Analytics.trackEvent('load_dataset', { type });
  };

  const handleShare = () => {
    const encoded = encodeURIComponent(btoa(JSON.stringify(dataPoints.map(p => ({ x: p.x, y: p.y })))));
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    navigator.clipboard.writeText(url);
    Analytics.trackButtonClick('share_link', 'KMeans');
    alert("Shareable link copied to clipboard!"); // Replace with toast if UI supports it
  };

  const handleExportGraph = () => {
    Analytics.trackButtonClick('export_graph', 'KMeans');
    Exporter.exportGraphPNG('kmeans-graph-container', 'kmeans_clustering');
  };

  const handleExportCSV = () => {
    Analytics.trackButtonClick('export_csv', 'KMeans');
    Exporter.exportCSV(dataPoints, 'kmeans_dataset');
  };

  const currentDisplayData = comparisonMode ? originalPoints : dataPoints;

  return (
    <div className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-3xl shadow-2xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Controls */}
        <div className="flex-1 space-y-6">
          <div>
             <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-purple-400">Number of Clusters (K)</label>
                <span className="font-mono text-xs text-gray-400">{clusters}</span>
             </div>
             <Slider 
                value={[clusters]} 
                onValueChange={(v) => {
                  setClusters(v[0]);
                  Analytics.trackEvent('slider_change', { param: 'clusters', value: v[0] });
                }} 
                min={1} 
                max={5} 
                step={1} 
             />
             <p className="text-xs text-gray-500 mt-2">Adjust K to change spatial partitioning density.</p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-3">Preloaded Storytelling Datasets</h4>
            <div className="flex gap-2">
              <Button onClick={() => loadStorytellingDataset('blobs')} className="flex-1 text-[10px] uppercase tracking-widest bg-blue-600/20 hover:bg-blue-600/40 text-blue-200">
                <PlayCircle className="w-3 h-3 mr-1" /> 3 Blobs
              </Button>
              <Button onClick={() => loadStorytellingDataset('moons')} className="flex-1 text-[10px] uppercase tracking-widest bg-orange-600/20 hover:bg-orange-600/40 text-orange-200">
                <PlayCircle className="w-3 h-3 mr-1" /> Interlocking
              </Button>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-2">Try an example to see KMeans logic.</p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
             <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1 flex items-center gap-2">
                 <Zap className="w-3 h-3 text-yellow-500" /> Web Worker Benchmark
               </h4>
               <p className="text-[10px] text-gray-500 uppercase tracking-wider">Off-thread Execution Performance</p>
             </div>
             <div className="text-right">
               <div className="text-sm font-mono text-white">{benchmark.timeMs.toFixed(2)} <span className="text-[10px] text-gray-500">ms</span></div>
               <div className="text-sm font-mono text-purple-400">{benchmark.iterations} <span className="text-[10px] text-gray-500">iters</span></div>
             </div>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-white">Comparison Mode</span>
              <Button 
                onClick={() => {
                  setComparisonMode(!comparisonMode);
                  Analytics.trackEvent('toggle_comparison', { mode: !comparisonMode });
                }}
                className={`text-[10px] px-3 py-1 uppercase tracking-widest font-black transition-all ${comparisonMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
              >
                <Layers className="w-3 h-3 mr-2" /> {comparisonMode ? 'Raw' : 'Clustered'}
              </Button>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Toggle Before vs After Web Worker assignment.</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={resetData} className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-black">
               <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </Button>
            <Button onClick={handleShare} className="flex-1 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/40 text-indigo-100 text-[10px] uppercase tracking-widest font-black">
               <Share2 className="w-3 h-3 mr-1" /> Share
            </Button>
            <Button onClick={handleExportGraph} className="flex-1 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/40 text-purple-100 text-[10px] uppercase tracking-widest font-black">
               <Download className="w-3 h-3 mr-1" /> PNG
            </Button>
          </div>
        </div>

        {/* Right Side: Graph */}
        <div id="kmeans-graph-container" className="flex-[1.5] h-[500px] border border-white/5 rounded-2xl bg-black/60 relative overflow-hidden" aria-live="polite">
          {isTraining && (
             <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-purple-400 font-black animate-pulse flex items-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-purple-500" /> Computing off-thread...
             </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 30, right: 30, bottom: 30, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="x" type="number" stroke="rgba(255,255,255,0.3)" label={{ value: 'Feature 1', position: 'insideBottom', offset: -20, fill: '#6b7280' }} />
              <YAxis dataKey="y" type="number" stroke="rgba(255,255,255,0.3)" label={{ value: 'Feature 2', angle: -90, position: 'insideLeft', offset: 0, fill: '#6b7280' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }} itemStyle={{ color: '#fff' }} />
              <Legend verticalAlign="top" height={36} />
              
              <Scatter name={comparisonMode ? "Raw Data" : "Clustered Vectors"} data={currentDisplayData} onClick={addDataPoint} style={{ cursor: 'crosshair' }}>
                {currentDisplayData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.cluster === -1 ? '#6b7280' : COLORS[entry.cluster % COLORS.length]} />
                ))}
              </Scatter>
              
              {!comparisonMode && centroids.length > 0 && (
                <Scatter name="Centroids" data={centroids} fill="#ffffff" shape="cross" />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
