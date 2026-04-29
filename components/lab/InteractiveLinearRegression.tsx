'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { useMLWorker } from '@/hooks/useMLWorker';
import { RotateCcw, AlertTriangle, Lightbulb, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Storage } from '@/lib/storage';
import { Exporter } from '@/lib/export';
import { Analytics } from '@/lib/analytics';

export function InteractiveLinearRegression() {
  const { workerApi } = useMLWorker();
  
  // Base synthetic data with Persistence
  const [dataPoints, setDataPoints] = useState(
    Storage.get('linreg_data', Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    })).map(p => ({ ...p, y: p.x * 0.8 + 10 + (Math.random() - 0.5) * 30 })))
  );

  const [learningRate, setLearningRate] = useState(Storage.get('linreg_lr', 0.0001));
  const [epochs, setEpochs] = useState(Storage.get('linreg_epochs', 100));
  const [modelLine, setModelLine] = useState<{x: number, y: number}[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trainRealTime = useCallback(async () => {
    if (!workerApi) return;
    setIsTraining(true);
    setError(null);
    
    try {
      const X = dataPoints.map(p => [p.x]);
      const y = dataPoints.map(p => p.y);
      
      const { weights, bias } = await workerApi.trainLinearRegression(X, y, learningRate, epochs);
      
      const xMin = Math.min(...dataPoints.map(p => p.x));
      const xMax = Math.max(...dataPoints.map(p => p.x));
      
      setModelLine([
        { x: xMin, y: weights[0] * xMin + bias },
        { x: xMax, y: weights[0] * xMax + bias }
      ]);
    } catch (e) {
      console.error(e);
      setError("Divergence Error: Try lowering the learning rate. Gradient descent exploded.");
      setModelLine([]);
    } finally {
      setIsTraining(false);
    }
  }, [dataPoints, learningRate, epochs, workerApi]);

  // Train whenever hyperparams change
  useEffect(() => {
    Storage.set('linreg_lr', learningRate);
    Storage.set('linreg_epochs', epochs);
    Storage.set('linreg_data', dataPoints);
    trainRealTime();
  }, [learningRate, epochs, workerApi, dataPoints, trainRealTime]);

  const addDataPoint = (e: any) => {
    if (e && e.activeCoordinate) {
      const newPoints = [...dataPoints, { 
        x: Math.random() * 100, 
        y: Math.random() * 100 
      }];
      setDataPoints(newPoints);
      Analytics.trackEvent('add_data_point', { algorithm: 'LinearRegression' });
    }
  };

  const resetData = () => {
    setDataPoints(
      Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100
      })).map(p => ({ ...p, y: p.x * 0.8 + 10 + (Math.random() - 0.5) * 30 }))
    );
    Analytics.trackButtonClick('reset_scatter', 'LinearRegression');
  };

  const handleExportGraph = () => {
    Analytics.trackButtonClick('export_graph', 'LinearRegression');
    Exporter.exportGraphPNG('regression-graph-container', 'linear_regression_plot');
  };

  const handleExportCSV = () => {
    Analytics.trackButtonClick('export_csv', 'LinearRegression');
    Exporter.exportCSV(dataPoints, 'linear_regression_dataset');
  };

  return (
    <div className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-3xl shadow-2xl">
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Interactive Controls */}
        <div className="flex-1 space-y-8">
          <div>
             <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-400">Learning Rate (α)</label>
                <span className="font-mono text-xs text-gray-400">{learningRate.toFixed(5)}</span>
             </div>
             <Slider 
                value={[learningRate]} 
                onValueChange={(v) => {
                  setLearningRate(v[0]);
                  Analytics.trackEvent('slider_change', { param: 'learningRate', value: v[0] });
                }} 
                min={0.00001} 
                max={0.001} 
                step={0.00001} 
             />
             <p className="text-xs text-gray-500 mt-2">Adjust step size. Too high causes divergence.</p>
          </div>

          <div>
             <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-purple-400">Epochs (Iterations)</label>
                <span className="font-mono text-xs text-gray-400">{epochs}</span>
             </div>
             <Slider 
                value={[epochs]} 
                onValueChange={(v) => {
                  setEpochs(v[0]);
                  Analytics.trackEvent('slider_change', { param: 'epochs', value: v[0] });
                }} 
                min={10} 
                max={500} 
                step={10} 
             />
             <p className="text-xs text-gray-500 mt-2">Number of complete passes through the dataset.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <Button 
               onClick={resetData}
               className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-black"
            >
               <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button 
               onClick={handleExportGraph}
               className="flex-1 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/40 text-blue-100 text-[10px] uppercase tracking-widest font-black"
            >
               <Download className="w-4 h-4 mr-2" /> PNG
            </Button>
            <Button 
               onClick={handleExportCSV}
               className="flex-1 bg-teal-600/20 border border-teal-500/30 hover:bg-teal-600/40 text-teal-100 text-[10px] uppercase tracking-widest font-black"
            >
               <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
            </Button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-400 text-sm items-start">
               <AlertTriangle className="w-5 h-5 shrink-0" />
               <p>{error}</p>
            </div>
          )}
          
          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
             <div className="flex gap-3 mb-2">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Explain this graph</h4>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed">
                The scatter points represent independent (X) and dependent (Y) variables. The Web Worker runs <strong>Stochastic Gradient Descent</strong> in a background thread to find the line of best fit (minimizing Mean Squared Error). Notice how modifying the Learning Rate instantly re-calculates the regression line!
             </p>
          </div>
        </div>

        {/* Right Side: Recharts SVG Interactive Graph */}
        <div id="regression-graph-container" className="flex-1 h-[300px] md:h-[400px] border border-white/5 rounded-2xl bg-black/60 relative overflow-hidden" aria-live="polite">
          {isTraining && (
             <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-blue-400 font-black animate-pulse flex items-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Computing...
             </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dataPoints} margin={{ top: 30, right: 30, bottom: 30, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="x" type="number" stroke="rgba(255,255,255,0.3)" label={{ value: 'Feature X', position: 'insideBottom', offset: -20, fill: '#6b7280' }} />
              <YAxis dataKey="y" type="number" stroke="rgba(255,255,255,0.3)" label={{ value: 'Target Y', angle: -90, position: 'insideLeft', offset: 0, fill: '#6b7280' }} />
              <Tooltip 
                 contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }} 
                 itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36} />
              
              {/* Actual Data Points */}
              <Scatter name="Raw Data" data={dataPoints} fill="#3b82f6" fillOpacity={0.6} onClick={addDataPoint} style={{ cursor: 'crosshair' }} />
              
              {/* Regression Line overlay */}
              {modelLine.length > 0 && !error && (
                <Line 
                   name="Best Fit (Hypothesis)"
                   data={modelLine} 
                   type="linear" 
                   dataKey="y" 
                   stroke="#a855f7" 
                   strokeWidth={3} 
                   dot={false}
                   activeDot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
