'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitMerge, Layers, Brain, ArrowRight, Play, RefreshCw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StackingPage() {
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    {
      title: "Input Data",
      desc: "The original dataset is fed into multiple diverse base models.",
      icon: <Layers className="w-8 h-8 text-teal-400" />
    },
    {
      title: "Base Learners",
      desc: "Level 0 models (SVM, KNN, Decision Trees) make individual predictions.",
      icon: <Brain className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Predictions Meta-Data",
      desc: "Base model predictions become the new features for the next stage.",
      icon: <GitMerge className="w-8 h-8 text-purple-400" />
    },
    {
      title: "Meta-Learner",
      desc: "Level 1 model (usually Logistic Regression) combines predictions for the final output.",
      icon: <Brain className="w-8 h-8 text-pink-400" />
    }
  ];

  const runSimulation = () => {
    setIsProcessing(true);
    setStep(0);
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsProcessing(false);
          return 3;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-purple-400 flex items-center gap-3">
            <GitMerge className="w-10 h-10" />
            Stacking Ensemble Visualizer
          </h1>
          <div className="bg-gray-900/50 p-6 rounded-lg border border-purple-500/30">
            <p className="text-gray-300">
              Stacking (Stacked Generalization) is an ensemble method where a <strong>Meta-Model</strong> 
              is trained to combine the predictions of several <strong>Base-Models</strong>. 
              Unlike Bagging or Boosting, Stacking often uses models of different types.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Workflow Visualization */}
          <Card className="lg:col-span-8 bg-gray-900 border-purple-500/30 overflow-hidden min-h-[350px] md:h-[500px]">
            <CardHeader>
              <CardTitle className="text-purple-400">Stacking Workflow Animation</CardTitle>
            </CardHeader>
            <CardContent className="relative flex flex-col items-center justify-center p-12">
              
              <div className="flex flex-col items-center gap-12 w-full max-w-md">
                {/* Level 0: Input */}
                <motion.div 
                  animate={{ scale: step >= 0 ? 1 : 0.8, opacity: step >= 0 ? 1 : 0.3 }}
                  className={`p-4 rounded-lg border ${step === 0 ? 'border-teal-500 bg-teal-900/20' : 'border-gray-700 bg-gray-800'}`}
                >
                  <p className="text-sm font-bold">Original Dataset</p>
                </motion.div>

                <ArrowRight className="rotate-90 text-gray-600" />

                {/* Level 1: Base Models */}
                <div className="flex justify-between w-full gap-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        y: step >= 1 ? 0 : 20, 
                        opacity: step >= 1 ? 1 : 0.2,
                        borderColor: step === 1 ? '#3b82f6' : '#374151'
                      }}
                      className="p-3 rounded-lg border bg-gray-800 flex flex-col items-center"
                    >
                      <Brain className="w-6 h-6 mb-2 text-blue-400" />
                      <p className="text-xs">Base Model {i}</p>
                    </motion.div>
                  ))}
                </div>

                <ArrowRight className="rotate-90 text-gray-600" />

                {/* Level 2: Predictions Buffer */}
                <motion.div 
                  animate={{ 
                    scale: step >= 2 ? 1 : 0.5, 
                    opacity: step >= 2 ? 1 : 0,
                    borderColor: step === 2 ? '#a855f7' : '#374151'
                  }}
                  className="p-4 rounded-lg border bg-purple-900/20 border-purple-500"
                >
                  <p className="text-xs font-bold text-center">Prediction Matrix (New Features)</p>
                </motion.div>

                <ArrowRight className="rotate-90 text-gray-600" />

                {/* Level 3: Meta-Learner */}
                <motion.div 
                  animate={{ 
                    scale: step >= 3 ? 1.1 : 0.8, 
                    opacity: step >= 3 ? 1 : 0.2,
                    backgroundColor: step === 3 ? '#db2777' : '#1f2937'
                  }}
                  className="p-4 rounded-lg border border-pink-500 bg-pink-900/20 shadow-[0_0_20px_rgba(219,39,119,0.3)]"
                >
                  <p className="text-sm font-bold">Meta-Learner Model</p>
                  {step === 3 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] mt-1 text-center font-mono">Final Output: 89% Acc</motion.p>}
                </motion.div>
              </div>

            </CardContent>
          </Card>

          {/* Controls & Steps info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-gray-900 border-purple-500/30 p-6">
              <Button 
                onClick={runSimulation} 
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-6"
              >
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Run Animation'}
              </Button>

              <div className="space-y-4">
                {steps.map((s, i) => (
                  <div key={i} className={`flex gap-4 p-3 rounded-lg transition-all duration-300 ${step === i ? 'bg-purple-900/40 border-l-4 border-purple-500' : 'opacity-40'}`}>
                    <div className="mt-1">{s.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm">{s.title}</h4>
                      <p className="text-xs text-gray-400">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gray-900 border-purple-500/30 p-6">
              <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2 mb-3">
                <Info className="w-5 h-5" /> Why Stacking?
              </h3>
              <ul className="text-xs text-gray-300 space-y-2 list-disc pl-4">
                <li>Best for combining very different types of models.</li>
                <li>Base models can &quot;specialize&quot; in different parts of data.</li>
                <li>Meta-learner finds the best way to weight conflicting predictions.</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
