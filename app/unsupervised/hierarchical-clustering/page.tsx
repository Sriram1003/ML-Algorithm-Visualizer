'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Boxes, Settings, Play, RefreshCw, Upload, Network } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Point {
  id: number;
  x: number;
  y: number;
  clusterId: number;
}

export default function HierarchicalClusteringPage() {
  const [data, setData] = useState<Point[]>([]);
  const [clusters, setClusters] = useState<Point[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [k, setK] = useState(3); // Desired number of clusters

  // Generate synthetic data
  const generateData = () => {
    const points: Point[] = [];
    const centers = [[25, 25], [75, 75], [25, 75], [75, 25]];
    for (let c = 0; c < 4; c++) {
      for (let i = 0; i < 20; i++) {
        points.push({
          id: c * 20 + i,
          x: centers[c][0] + (Math.random() - 0.5) * 20,
          y: centers[c][1] + (Math.random() - 0.5) * 20,
          clusterId: c * 20 + i // Initially each point is its own cluster
        });
      }
    }
    setData(points);
    setClusters(points.map(p => ({ ...p, clusterId: 0 })));
  };

  useEffect(() => {
    generateData();
  }, []);

  const handleDataUpload = (uploadedData: any[]) => {
    const processed = uploadedData.map((d, i) => ({
      id: i,
      x: Number(d.x || d.X || 0),
      y: Number(d.y || d.Y || 0),
      clusterId: i
    }));
    setData(processed);
    setClusters(processed.map(p => ({ ...p, clusterId: 0 })));
  };

  const runClustering = () => {
    if (data.length === 0) return;
    setIsProcessing(true);

    // Simple Agglomerative Clustering (Single Linkage for demo speed)
    setTimeout(() => {
      let currentClusters = data.map(p => ({
        points: [p],
        id: p.id
      }));

      const getDist = (c1: any, c2: any) => {
        let minDist = Infinity;
        for (const p1 of c1.points) {
          for (const p2 of c2.points) {
            const d = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
            if (d < minDist) minDist = d;
          }
        }
        return minDist;
      };

      while (currentClusters.length > k) {
        let minD = Infinity;
        let pair = [0, 1];

        for (let i = 0; i < currentClusters.length; i++) {
          for (let j = i + 1; j < currentClusters.length; j++) {
            const d = getDist(currentClusters[i], currentClusters[j]);
            if (d < minD) {
              minD = d;
              pair = [i, j];
            }
          }
        }

        // Merge pair
        const [i, j] = pair;
        const newPoints = [...currentClusters[i].points, ...currentClusters[j].points];
        const newId = currentClusters[i].id;
        
        currentClusters.splice(j, 1);
        currentClusters[i] = { points: newPoints, id: newId };
      }

      // Map back to flat array for Recharts
      const resultPoints: Point[] = [];
      currentClusters.forEach((c, idx) => {
        c.points.forEach(p => {
          resultPoints.push({ ...p, clusterId: idx + 1 });
        });
      });

      setClusters(resultPoints);
      setIsProcessing(false);
    }, 100);
  };

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#00C49F', '#A05195'];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Network className="w-12 h-12 text-purple-400 mr-4" />
          <div>
            <h1 className="text-4xl font-bold text-purple-400">Hierarchical Clustering</h1>
            <p className="text-gray-300">Agglomerative &quot;Bottom-Up&quot; approach visualizer</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          <Card className="bg-gray-900 border-purple-700/50 p-6 md:col-span-4 h-fit">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-xl font-bold">Parameters</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex justify-between">
                  <span>Target Clusters (K):</span>
                  <span className="text-purple-400 font-bold">{k}</span>
                </label>
                <Slider
                  value={[k]}
                  onValueChange={([val]) => setK(val)}
                  min={1}
                  max={6}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <Button onClick={runClustering} disabled={isProcessing} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Play className="w-4 h-4 mr-2" /> {isProcessing ? 'Merging...' : 'Run Algorithm'}
                </Button>
                <Button onClick={generateData} variant="outline" className="w-full border-purple-500 text-purple-400">
                  <RefreshCw className="w-4 h-4 mr-2" /> New Random Data
                </Button>
              </div>

              <div className="pt-6 border-t border-purple-900/50">
                <label className="block text-sm text-gray-400 mb-2">Upload Data</label>
                <FileUpload onDataLoaded={handleDataUpload} />
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-purple-700/50 p-6 md:col-span-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Cluster Visualization</h2>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis type="number" dataKey="x" stroke="#444" tick={false} domain={['auto', 'auto']} />
                  <YAxis type="number" dataKey="y" stroke="#444" tick={false} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  {Array.from({ length: k + 1 }).map((_, i) => (
                    <Scatter
                      key={i}
                      name={i === 0 ? 'Unclustered' : `Cluster ${i}`}
                      data={clusters.filter(p => p.clusterId === i)}
                      fill={i === 0 ? '#444' : colors[(i-1) % colors.length]}
                      shape="circle"
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}