'use client';

import { useState, useEffect } from 'react';
import { Boxes, Settings, Play, Pause, RefreshCw, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import dynamic from 'next/dynamic';

// Lazy load Recharts for performance optimization
const ScatterChart = dynamic(() => import('recharts').then(mod => mod.ScatterChart) as any, { ssr: false });
const Scatter = dynamic(() => import('recharts').then(mod => mod.Scatter) as any, { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis) as any, { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis) as any, { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid) as any, { ssr: false });
const ScatterTooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip) as any, { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend) as any, { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer) as any, { ssr: false });

const TSNEPage = () => {
  const [data, setData] = useState<{ x: number, y: number, z: number }[]>([]);
  const [tsneData, setTsneData] = useState<{ x: number, y: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(0);
  const [perplexity, setPerplexity] = useState(30);

  useEffect(() => {
    // Generate random data points
    const newData = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100 
    }));
    setData(newData);
  }, []);

  const handleDataUpload = (uploadedData) => {
    const processedData = uploadedData.map(row => ({
      x: Number(row.x),
      y: Number(row.y),
      z: Number(row.z)
    }));
    
    setData(processedData);
    setIterations(0);
    setIsRunning(false);
  };

  const runTSNE = () => {
    if (data.length === 0) return;
    setIsRunning(true);
    setIterations(0);

    // Robust constructor selection for tsne-js - Loading it dynamically to avoid build issues
    const tsnejs = require('tsne-js');
    const TSNEConstructor = (tsnejs as any).tSNE || (tsnejs as any).default || tsnejs;
    const tsne = new (TSNEConstructor as any)({
      dim: 2,
      perplexity: perplexity,
      learningRate: 100,
      nIter: 500,
      metric: 'euclidean'
    });

    const inputData = data.map(d => [d.x, d.y, d.z]);
    
    // In tsne-js, we use .init() instead of .initDataRaw()
    tsne.init({
      data: inputData,
      type: 'dense'
    });

    // Handle progress updates via events
    tsne.on('progressIter', ([iter, error]) => {
      setIterations(iter);
    });

    tsne.on('progressData', (points) => {
      setTsneData(points.map((point, i) => ({ x: point[0], y: point[1] })));
    });

    // run() is synchronous or returns a promise depending on env, 
    // but in tsne-js it runs the whole loop. 
    // To keep UI responsive, we wrap it in a small t-SNE specific pattern if needed,
    // but the library is designed to emit events as it goes.
    try {
      tsne.run();
    } catch (err) {
      console.error("t-SNE Error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setIterations(0);
    setTsneData([]);
    setData([]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Boxes className="w-12 h-12 text-purple-400 mr-4" />
          <div>
            <h1 className="text-4xl font-bold text-purple-400">t-SNE Visualization</h1>
            <p className="text-gray-300">Interactive visualization of t-SNE algorithm</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Data Upload */}
          <Card className="bg-gray-900 border-purple-700 p-6 md:col-span-2">
            <div className="flex items-center mb-6">
              <Upload className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-bold text-purple-400">Upload Data</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
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

          {/* t-SNE Visualization */}
          <Card className="bg-gray-900 border-purple-700 p-6 md:col-span-2">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">t-SNE Visualization</h2>
            <div className="h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis type="number" dataKey="x" stroke="#fff" tick={false} domain={['auto', 'auto']} />
                  <YAxis type="number" dataKey="y" stroke="#fff" tick={false} domain={['auto', 'auto']} />
                  <ScatterTooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #666' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Scatter
                    name="t-SNE Points"
                    data={tsneData}
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

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Perplexity: {perplexity}
                </label>
                <Slider
                  value={[perplexity]}
                  onValueChange={([value]) => setPerplexity(value)}
                  min={5}
                  max={50}
                  step={1}
                  className="mb-6"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="bg-black p-4 rounded-lg border border-purple-700 mb-4">
                  <p className="text-purple-400">Iterations</p>
                  <p className="text-2xl font-bold text-purple-300">{iterations}</p>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={runTSNE}
                    disabled={isRunning || data.length === 0}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Play className="w-4 h-4 mr-2" /> {isRunning ? 'Running...' : 'Run t-SNE'}
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

export default TSNEPage;