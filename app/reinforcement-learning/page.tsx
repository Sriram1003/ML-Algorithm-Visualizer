'use client';

import { useState, useEffect } from 'react';
import { Brain, Layers, Target, Pause, Play, RefreshCw, Bot, Globe, Zap, Star, Search, FileText, Cpu, Coins, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { QLearning } from '@/lib/ml';

const ReinforcementLearningPage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [gameState, setGameState] = useState({ 
    position: 0, 
    isRunning: false, 
    episodes: 0, 
    reward: 0, 
    qTable: Array(5).fill(0).map(() => ({ left: 0, right: 0 })) 
  });
  const goalPosition = 4;
  const router = useRouter();

  useEffect(() => {
    let interval: any;
    if (gameState.isRunning) {
      // Initialize Q-Learning with 2 actions: 0=left, 1=right
      const ql = new QLearning(2, 0.1, 0.9, 0.1); 
      // Seed the Q-table with current state
      gameState.qTable.forEach((row, i) => {
        ql.qTable[i.toString()] = [row.left, row.right];
      });

      interval = setInterval(() => {
        setGameState(prev => {
          const stateStr = prev.position.toString();
          const actionIdx = ql.chooseAction(stateStr);
          const action = actionIdx === 1 ? 'right' : 'left';
          
          const newPosition = action === 'right' ? Math.min(prev.position + 1, goalPosition) : Math.max(prev.position - 1, 0);
          const stepReward = newPosition === goalPosition ? 10 : -1;
          
          ql.update(stateStr, actionIdx, stepReward, newPosition.toString());
          
          const newQTable = prev.qTable.map((row, i) => ({
             left: ql.getQ(i.toString())[0],
             right: ql.getQ(i.toString())[1]
          }));

          // If reached goal, reset to start for next iteration
          const finalPosition = newPosition === goalPosition ? 0 : newPosition;

          return {
            ...prev,
            position: finalPosition,
            reward: prev.reward + stepReward,
            episodes: prev.episodes + 1,
            qTable: newQTable
          };
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [gameState.isRunning, gameState.qTable, goalPosition]);

  const resetGame = () => {
    setGameState({ 
      position: 0, 
      isRunning: false, 
      episodes: 0, 
      reward: 0, 
      qTable: Array(5).fill(0).map(() => ({ left: 0, right: 0 })) 
    });
  };

  const sections = [
    {
      title: 'What is Reinforcement Learning?',
      content: (
        <div className="text-center">
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Brain size={140} className="mx-auto mb-10 text-purple-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]" />
          </motion.div>
          <p className="text-2xl text-purple-100 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Reinforcement Learning (RL) is a paradigm where an <span className="text-purple-400 font-bold">Agent</span> learns to make decisions by performing <span className="text-teal-400 font-bold">Actions</span> in an <span className="text-blue-400 font-bold">Environment</span> to maximize <span className="text-yellow-400 font-bold">Rewards</span>.
          </p>
          <div className="flex justify-center gap-4 text-sm text-purple-400/60 italic">
            <span>#TrialAndError</span>
            <span>#DeepMind</span>
            <span>#Intelligence</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Core Architecture',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
          {[
            { title: "The Agent", description: "The decider or 'brain' that learns from experience", icon: <Bot className="w-12 h-12 text-blue-400" />, shadow: "shadow-blue-500/20" },
            { title: "The Environment", description: "The external world and constraints the agent faces", icon: <Globe className="w-12 h-12 text-emerald-400" />, shadow: "shadow-emerald-500/20" },
            { title: "Actions", description: "Moves the agent can perform to change its state", icon: <Zap className="w-12 h-12 text-yellow-400" />, shadow: "shadow-yellow-500/20" },
            { title: "Rewards", description: "Positive or negative feedback signals guiding growth", icon: <Star className="w-12 h-12 text-amber-500" />, shadow: "shadow-amber-500/20" }
          ].map((concept, i) => (
            <motion.div
              whileHover={{ scale: 1.05, translateY: -5 }}
              key={i}
            >
              <Card className={`bg-gray-900/40 border-white/5 p-8 h-full backdrop-blur-xl hover:bg-gray-900/60 transition-all ${concept.shadow} shadow-lg`}>
                <div className="flex items-center gap-6">
                  <div className="bg-black/40 p-5 rounded-3xl border border-white/5 shadow-inner">
                    {concept.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">{concept.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{concept.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: 'Interactive Q-Learning',
      content: (
        <div className="w-full max-w-5xl mx-auto">
          <Card className="bg-gray-900/30 border-purple-500/20 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="p-12 space-y-12">
              <div className="flex justify-center gap-2 sm:gap-4 md:gap-8 flex-wrap max-w-full">
                {Array(5).fill(0).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: i === gameState.position ? 1.15 : 1,
                      borderColor: i === gameState.position ? "#a855f7" : "rgba(168, 85, 247, 0.2)"
                    }}
                    className={`w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 flex items-center justify-center rounded-[1rem] sm:rounded-[2rem] transition-all relative ${i === goalPosition ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-black/40'}`}
                  >
                    {i === gameState.position && (
                      <motion.div layoutId="agent" className="z-10 bg-purple-600 p-1.5 sm:p-3 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                        <Bot className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
                      </motion.div>
                    )}
                    {i === goalPosition && <Target className="w-6 h-6 sm:w-10 sm:h-10 text-emerald-400 opacity-60 absolute" />}
                    <span className="absolute -bottom-6 sm:bottom-2 text-[8px] sm:text-[10px] text-white/40 sm:text-white/20 font-mono">STATE {i}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8 sm:mt-0 w-full">
                <Button 
                  onClick={() => setGameState(prev => ({ ...prev, isRunning: !prev.isRunning }))} 
                  className={`px-10 h-14 rounded-2xl text-lg font-bold transition-all shadow-xl ${gameState.isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30'}`}
                >
                  {gameState.isRunning ? <Pause className="mr-3" /> : <Play className="mr-3" />} 
                  {gameState.isRunning ? 'Pause Learning' : 'Start Simulation'}
                </Button>
                <Button onClick={resetGame} variant="outline" className="px-10 h-14 rounded-2xl border-white/10 text-white hover:bg-white/5 text-lg">
                  <RefreshCw className="mr-3" /> Reset
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
                    <div className="relative bg-black/60 p-8 rounded-[2.5rem] border border-white/5 text-center">
                      <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 font-mono">Iteration Count</p>
                      <p className="text-5xl font-black text-white font-mono tracking-tighter">{gameState.episodes}</p>
                    </div>
                 </div>
                 <div className="relative group">
                    <div className="absolute inset-0 bg-teal-500/5 blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
                    <div className="relative bg-black/60 p-8 rounded-[2.5rem] border border-white/5 text-center">
                      <p className="text-teal-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 font-mono">Accumulated Reward</p>
                      <p className="text-5xl font-black text-white font-mono tracking-tighter">{gameState.reward}</p>
                    </div>
                 </div>
              </div>

              <div className="pt-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                  <h3 className="font-bold text-white/40 uppercase tracking-[0.3em] text-[10px]">Q-Intelligence Matrix</h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>
                
                <div className="rounded-3xl border border-white/5 overflow-x-auto bg-black/40 shadow-inner">
                  <table className="w-full min-w-[400px] text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-[11px] uppercase tracking-widest text-purple-400 font-black">
                        <th className="p-6">State Vector</th>
                        <th className="p-6 text-center">Policy: Left</th>
                        <th className="p-6 text-center">Policy: Right</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameState.qTable.map((values, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-6 text-gray-400 font-mono text-sm">POSITION_{i}</td>
                          <td className="p-6 text-center">
                            <motion.span 
                              animate={{ color: values.left > values.right ? "#a855f7" : "#4b5563" }}
                              className="font-mono text-lg"
                            >
                              {values.left.toFixed(3)}
                            </motion.span>
                          </td>
                          <td className="p-6 text-center">
                            <motion.span 
                              animate={{ color: values.right > values.left ? "#10b981" : "#4b5563" }}
                              className="font-mono text-lg"
                            >
                              {values.right.toFixed(3)}
                            </motion.span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: 'Advanced RL Models',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
          {[
            { title: "Q-Learning", description: "Foundational table-based value iteration for finite state spaces.", icon: <Search className="w-10 h-10 text-blue-400" />, gradient: "from-blue-500/20" },
            { title: "Deep Q-Network", description: "Neural function approximators for high-dimensional state spaces like pixels.", icon: <Cpu className="w-10 h-10 text-purple-400" />, gradient: "from-purple-500/20" },
            { title: "Actor-Critic", description: "Hybrid model separating the policy maker from the value evaluator.", icon: <Target className="w-10 h-10 text-pink-400" />, gradient: "from-pink-500/20" },
            { title: "Policy Gradient", description: "Direct numerical optimization of action probabilities via gradient ascent.", icon: <Coins className="w-10 h-10 text-amber-400" />, gradient: "from-amber-500/20" }
          ].map((tile, i) => (
            <motion.div whileHover={{ scale: 1.02 }} key={i}>
              <Card className={`bg-gradient-to-br ${tile.gradient} to-gray-900 border-white/5 p-10 h-full backdrop-blur-xl relative overflow-hidden group`}>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  {tile.icon}
                </div>
                <div className="relative z-10 flex items-start gap-8">
                  <div className="bg-black/40 p-5 rounded-[1.5rem] shadow-2xl border border-white/5">
                    {tile.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">{tile.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{tile.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-[100vw] overflow-hidden px-4 sm:px-6 md:px-8 min-h-screen bg-[#020202] text-white pb-32 selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto pt-24">
        {/* Superior Navigation */}
        <div className="flex justify-between items-center mb-24">
          <Button onClick={handlePrev} variant="ghost" className="text-gray-500 hover:text-white group flex items-center gap-3 !bg-transparent">
             <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 group-hover:bg-purple-600/20 transition-all">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             </div>
             <span className="text-xs font-black uppercase tracking-[0.3em]">
               {currentSection === 0 ? 'Home' : 'Back'}
             </span>
          </Button>
          
          <div className="hidden md:flex gap-4">
            {sections.map((_, idx) => (
              <motion.div 
                key={idx} 
                animate={{ 
                  width: currentSection === idx ? 48 : 12,
                  backgroundColor: currentSection === idx ? "#a855f7" : "#1f1f1f"
                }}
                className="h-1.5 rounded-full" 
              />
            ))}
          </div>

          <Button 
            onClick={handleNext} 
            disabled={currentSection === sections.length - 1} 
            className="h-12 bg-purple-600 hover:bg-purple-700 rounded-2xl px-10 shadow-lg shadow-purple-500/20 disabled:opacity-20"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em]">Next Phase</span>
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center"
          >
            <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Phase 0{currentSection + 1}</span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black mb-20 text-center tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 max-w-4xl">
              {sections[currentSection].title}
            </h1>
            {sections[currentSection].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReinforcementLearningPage;