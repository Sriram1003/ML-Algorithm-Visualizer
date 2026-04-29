'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, Activity } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import dynamic from 'next/dynamic';
import { LogisticRegression, trainTestSplit, calculateClassificationMetrics, normalize } from '@/lib/ml';
import { useMLModel } from '@/hooks/useMLModel';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';
import { MetricsDisplay } from '@/components/lab/MetricsDisplay';

// Dynamically import charts with SSR disabled
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar) as any, {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-lg mt-4" />
});

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line) as any, {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-lg mt-4" />
});

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const LogisticRegressionPage: React.FC = () => {
  const {
    data,
    isTraining,
    metrics,
    losses,
    error,
    setIsTraining,
    setMetrics,
    setLosses,
    setError,
    handleFileUpload,
  } = useMLModel();

  const [regularization, setRegularization] = useState<number>(1.0);

  const trainModel = () => {
    if (!data) return;
    setIsTraining(true);
    setTimeout(() => {
      try {
        const X_raw = data.map(row => row.slice(0, -1).map(v => typeof v === 'string' ? 0 : v));
        const X = normalize(X_raw);
        const y = data.map(row => {
          const val = row[row.length - 1];
          return (typeof val === 'number' ? val : (val === '1' || val === 'true' || val === 'Yes' ? 1 : 0));
        });

        const { X_train, y_train, X_test, y_test } = trainTestSplit(X, y as number[]);

        const lr = new LogisticRegression();
        lr.fit(X_train as number[][], y_train, 0.1, 1000);
        const predictions = lr.predict(X_test as number[][]);

        const results = calculateClassificationMetrics(y_test, predictions);
        setMetrics(results);
        setLosses(lr.losses);
        setIsTraining(false);
      } catch (err) {
        setError("Failed to train model: " + (err as Error).message);
        setIsTraining(false);
      }
    }, 500);
  };

  const lrSteps = [
    {
      title: 'Sigmoid Function',
      description: 'Uses the sigmoid function to map predicted values to probabilities between 0 and 1.'
    },
    {
      title: 'Cost Function',
      description: 'Minimizes the log loss function to find the best-fitting weights for the classes.'
    },
    {
      title: 'Gradient Descent',
      description: 'Iteratively updates weights to find the global minimum of the cost function.'
    }
  ];

  const chartData = {
    labels: losses ? losses.map((_, i) => (i * 10).toString()) : [],
    datasets: [
      {
        label: 'Training Loss',
        data: losses || [],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-24">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.03),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        {/* Header Section */}
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Activity className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500">
              Logistic <span className="text-indigo-500 not-italic">Regression</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
            Establish binary classification boundaries via probability curves.
            Optimize sigmoid activation and log-loss minimization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-indigo-500/20 border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-indigo-500" /> Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <label id="reg-label" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Regularization (λ)</label>
                    <span className="text-indigo-400 font-mono text-xl font-bold" aria-live="polite">{regularization.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[regularization]}
                    onValueChange={([value]) => setRegularization(value)}
                    min={0}
                    max={10}
                    step={0.1}
                    className="py-4"
                    aria-labelledby="reg-label"
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all hover:scale-[1.02] shadow-2xl"
                  onClick={trainModel}
                  disabled={!data || isTraining}
                  aria-label={isTraining ? 'Optimizing Weights' : 'Run Logistic Regression Training'}
                >
                  {isTraining ? 'Optimizing Weights...' : 'Run Regression'}
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
              <MetricsDisplay metrics={metrics} />
              <Card className="bg-black/60 border-indigo-500/20 border backdrop-blur-3xl p-8 shadow-2xl">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Optimization Curve</h3>
                {losses ? (
                  <div
                    className="h-[250px]"
                    role="img"
                    aria-label="Training Loss vs Iterations Chart"
                  >
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#666' },
                            title: { display: true, text: 'Log Loss', color: '#666', font: { size: 10 } }
                          },
                          x: {
                            grid: { display: false },
                            ticks: { color: '#666', maxTicksLimit: 10 },
                            title: { display: true, text: 'Iterations', color: '#666', font: { size: 10 } }
                          }
                        },
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: '#111',
                            titleColor: '#fff',
                            bodyColor: '#indigo-400',
                            borderColor: '#333',
                            borderWidth: 1
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-700 italic text-xs uppercase tracking-widest text-center" aria-live="polite">
                    Gradient descent metrics will appear after initialization
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        <AlgorithmInfo
          title="Logistic Regression"
          description="Logistic Regression is a fundamental classification algorithm. Despite its name, it is used for binary classification rather than numeric regression. It models the probability of a default class using the sigmoid function."
          steps={lrSteps}
        />
      </div>
    </div>
  );
};

export default LogisticRegressionPage;