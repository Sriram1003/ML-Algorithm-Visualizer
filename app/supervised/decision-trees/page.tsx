'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Zap, GitBranch } from 'lucide-react';
import { Tree } from 'react-d3-tree';
import { Slider } from '@/components/ui/slider';
import { DecisionTree, trainTestSplit, calculateClassificationMetrics, normalize } from '@/lib/ml';
import { useMLModel } from '@/hooks/useMLModel';
import AlgorithmInfo from '@/components/lab/AlgorithmInfo';
import { CsvUploader } from '@/components/lab/CsvUploader';
import { MetricsDisplay } from '@/components/lab/MetricsDisplay';

interface TreeNode {
  name: string;
  children?: TreeNode[];
  value?: number;
}

const DecisionTreePage: React.FC = () => {
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

  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const [minSamples, setMinSamples] = useState<number>(2);

  const convertToD3 = (node: any): TreeNode => {
      if (node.leaf) return { name: `Predict: ${node.value}` };
      return {
          name: `Idx ${node.featureIndex} < ${node.threshold.toFixed(2)}`,
          children: [
              convertToD3(node.left),
              convertToD3(node.right)
          ]
      };
  };

  const trainModel = () => {
    if (!data) return;
    setIsTraining(true);
    setTimeout(() => {
        try {
            const X_raw = data.map(row => row.slice(0, -1).map(v => typeof v === 'string' ? 0 : v));
            const X = normalize(X_raw);
            const y = data.map(row => row[row.length - 1]);

            const { X_train, y_train, X_test, y_test } = trainTestSplit(X, y);

            const dt = new DecisionTree(maxDepth);
            dt.fit(X_train as number[][], y_train);
            const predictions = dt.predict(X_test as number[][]);

            const results = calculateClassificationMetrics(y_test, predictions);
            setMetrics(results);

            const visualTree = convertToD3((dt as any).root);
            setTreeData(visualTree);
            setIsTraining(false);
        } catch (err) {
            setError((err as Error).message);
            setIsTraining(false);
        }
    }, 500);
  };

  const dtSteps = [
    {
      title: 'Splitting Criteria',
      description: 'Find optimal features and thresholds to split data into homogeneous groups.'
    },
    {
      title: 'Information Gain',
      description: 'Measure entropy reduction to ensure each decision leaf maximizes certainty.'
    },
    {
      title: 'Tree Pruning',
      description: 'Restrict maximum depth to prevent overfitting on specific noise in the training set.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-24">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
        {/* Header Section */}
        <div className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
               <GitBranch className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-500">
              Decision <span className="text-amber-500 not-italic">Tree</span>
            </h1>
          </div>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-2xl">
             Construct hierarchical decision logic via recursive feature partition. 
             Optimize node split thresholds and leaf node purity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-black/40 border-amber-500/20 border backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-white text-xs uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <Settings className="h-4 w-4 text-amber-500" /> Tree Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-mono">Max Depth</label>
                    <span className="text-amber-500 font-mono text-xl font-bold">{maxDepth}</span>
                  </div>
                  <Slider
                    value={[maxDepth]}
                    onValueChange={([value]) => setMaxDepth(value)}
                    min={1}
                    max={10}
                    step={1}
                    className="py-4 font-amber"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-mono">Min Samples</label>
                    <span className="text-amber-500 font-mono text-xl font-bold">{minSamples}</span>
                  </div>
                  <Slider
                    value={[minSamples]}
                    onValueChange={([value]) => setMinSamples(value)}
                    min={1}
                    max={20}
                    step={1}
                    className="py-4"
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black uppercase tracking-[0.2em] py-8 rounded-xl transition-all hover:scale-[1.02] shadow-2xl"
                  onClick={trainModel}
                  disabled={!data || isTraining}
                >
                  {isTraining ? 'Building Tree...' : 'Initialize Logic'}
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
               <Card className="bg-white/5 border-amber-500/20 border backdrop-blur-3xl p-8 relative overflow-hidden h-[350px] md:h-[500px]">
                  <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] mb-6">Logical Architecture</h3>
                  {treeData ? (
                    <div className="w-full h-full border border-white/5 rounded-xl bg-black/20 overflow-hidden">
                      <Tree
                        data={treeData}
                        orientation="vertical"
                        pathFunc="step"
                        translate={{ x: 200, y: 50 }}
                        renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
                          <g onClick={toggleNode}>
                            <circle r={12} fill="#F59E0B" stroke="#000" strokeWidth="2" />
                            <text fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle" dy=".35em" className="pointer-events-none">
                              {nodeDatum.name.includes('Predict') ? 'P' : 'D'}
                            </text>
                            <title>{nodeDatum.name}</title>
                          </g>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-700 italic text-xs uppercase tracking-widest text-center px-12">
                       Awaiting model initialization to render decision topology
                    </div>
                  )}
               </Card>
            </div>
          </div>
        </div>

        <AlgorithmInfo 
          title="Decision Tree Classifier"
          description="Decision trees partition the feature space into rectangular regions using an axis-parallel splitting strategy. This results in a highly interpretable model that mimics human logical deduction."
          steps={dtSteps}
        />
      </div>
    </div>
  );
};

export default DecisionTreePage;