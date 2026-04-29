'use client';

import { useState, useEffect } from 'react';
import { Boxes, Settings, Play, Pause, RefreshCw, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import dynamic from 'next/dynamic';

const ScatterChart = dynamic(() => import('recharts').then(mod => mod.ScatterChart) as any, { ssr: false });
const Scatter = dynamic(() => import('recharts').then(mod => mod.Scatter) as any, { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis) as any, { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis) as any, { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid) as any, { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip) as any, { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend) as any, { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer) as any, { ssr: false });
import { UMAP } from 'umap-js';

const UMAPPage = () => {
  const [data, setData] = useState<{ x: number, y: number, z: number }[]>([]);
  const [umapData, setUmapData] = useState<{ x: number, y: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [nNeighbors, setNNeighbors] = useState(15);
  const [minDist, setMinDist] = useState(0.1);

  useEffect(() => {
    // Generate random data points
    const newData = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100 // Adding a third dimension for demonstration
    }));
    setData(newData);
  }, []);

  const handleDataUpload = (uploadedData: any[]) => {
    const processedData = uploadedData.map(row => ({
      x: Number(row.x || 0),
      y: Number(row.y || 0),
      z: Number(row.z || 0)
    }));
    
    setData(processedData);
    setIsRunning(false);
  };

  const runUMAP = () => {
    setIsRunning(true);
    const umap = new UMAP({
      nNeighbors: nNeighbors,
      minDist: minDist,
      metric: 'euclidean'
    });

    const inputData = data.map(d => [d.x, d.y, d.z]);
    const transformedData = umap.fit(inputData);
    setUmapData(transformedData.map(point => ({ x: point[0], y: point[1] })));
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setUmapData([]);
    setData([]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Boxes className="w-12 h-12 text-purple-400 mr-4" />
          <div>
            <h1 className="text-4xl font-bold text-purple-400">UMAP Visualization</h1>
            <p className="text-gray-300">Interactive visualization of UMAP algorithm</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Data Upload */}
          <Card className="bg-gray-900 border-purple-700 p-6 md:col-span-2">
            <div className="flex items-center mb-6">
              <Upload className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-bold text-purple-400">Upload Data</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-300 mb-4">
                  Upload a CSV file with &apos;x&apos;, &apos;y&apos;, and &apos;z&apos; columns to visualize your own data points.
                </p>
                <FileUpload onDataLoaded={handleDataUpload} />
              </div>
              <div className="flex items-center justify-center border-l border-purple-500/20 pl-8">
                <div className="text-center">
                  <p className="text-purple-400 mb-2">Current Dataset</p>
                  <p className="text-2xl font-bold text-purple-300">{data.length} points</p>
                </div>
              </div>
            </div>
          </Card>

          {/* UMAP Visualization */}
          <Card className="bg-gray-900 border-purple-700 p-6 md:col-span-2">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">UMAP Visualization</h2>
            <div className="h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis type="number" dataKey="x" stroke="#fff" />
                  <YAxis type="number" dataKey="y" stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #666' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  {/* UMAP Data points */}
                  <Scatter
                    name="UMAP Points"
                    data={umapData}
                    fill="#82ca9d"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Controls */}
          <Card className="bg-gray-900 border-purple-700 p-6 md:col-span-2">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-bold text-purple-400">Algorithm Controls</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Neighbors: {nNeighbors}
                </label>
                <Slider
                  value={[nNeighbors]}
                  onValueChange={([value]) => setNNeighbors(value)}
                  min={5}
                  max={50}
                  step={1}
                  className="mb-6"
                />
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Distance: {minDist}
                </label>
                <Slider
                  value={[minDist]}
                  onValueChange={([value]) => setMinDist(value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="mb-6"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="flex gap-4">
                  <Button
                    onClick={runUMAP}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Play className="w-4 h-4 mr-2" /> Run UMAP
                  </Button>
                  <Button
                    onClick={reset}
                    className="flex-1 border-purple-500 text-purple-300 hover:bg-purple-900"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Reset
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UMAPPage;