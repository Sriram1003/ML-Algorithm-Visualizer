'use client';

import { useState, useEffect } from 'react';
import { Brain, Network, Menu, X, GitMerge, ArrowLeft, Cpu } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@/lib/analytics';

// Define the props for the RotatingText component
interface RotatingTextProps {
  texts: string[];
}

// RotatingText component
const RotatingText: React.FC<RotatingTextProps> = ({ texts }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [texts]);

  return (
    <div className="h-20 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.h2 
          key={currentTextIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "anticipate" }}
          className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tighter"
          aria-live="polite"
        >
          {texts[currentTextIndex]}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
};

interface NavigationProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isScrolled, isMobileMenuOpen, setIsMobileMenuOpen }) => (
  <nav className={`fixed w-full z-50 transition-all duration-500 ${
    isScrolled ? 'py-4 bg-black/60 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'
  }`}>
    <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
      <Link href="/" className="group flex items-center gap-3" aria-label="AlgoVista Home">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform" aria-hidden="true">
           <Brain className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
          Algo<span className="text-purple-500 not-italic">Vista</span>
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-10">
        <NavLinks />
      </div>

      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/5 p-8 flex flex-col gap-6 md:hidden"
        >
          <NavLinks />
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
);

const NavLinks: React.FC = () => (
  <>
    <Link href="/supervised/concepts" className="text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Resources</Link>
    <Link href="/contact" className="text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Connect</Link>
  </>
);

interface AlgorithmCardProps {
  href: string;
  icon: any;
  title: string;
  description: string;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ href, icon: Icon, title, description }) => {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ y: -8 }}
        className="group relative h-full p-10 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-3xl hover:border-purple-500/30 transition-all duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-500 rounded-3xl" />
        
        <div className="relative z-10">
          <div className="mb-10 w-16 h-16 flex items-center justify-center rounded-2xl bg-black/40 border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
             <Icon className="w-8 h-8 text-purple-400 group-hover:text-white transition-colors" />
          </div>
          
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight leading-none uppercase italic italic">
            {title}
          </h3>
          <p className="text-gray-500 leading-relaxed font-light mb-8 max-w-sm group-hover:text-gray-300 transition-colors">
            {description}
          </p>
          
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 group-hover:text-white transition-all">
            Open Laboratory <ArrowLeft className="w-4 h-4 rotate-180" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const Home: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isExploring, setIsExploring] = useState<boolean>(false);

  useEffect(() => {
    Analytics.trackPageVisit('Home');
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const algorithmCards = [
    {
      href: "/supervised/algorithms",
      icon: Brain,
      title: "Supervised",
      description: "Neural architectures for pattern recognition including SVM, Regressions, and Decision Forest logic."
    },
    {
      href: "/unsupervised/algorithms",
      icon: Network,
      title: "Unsupervised",
      description: "Clustering heuristics and dimensionality reduction kernels like K-Means, DBSCAN, and t-SNE."
    },
    {
      href: "/ensemble-methods/algorithms",
      icon: GitMerge,
      title: "Ensemble",
      description: "Multi-layered model aggregation using Gradient Boosting and Random Forest parallel processing."
    },
    {
      href: "/reinforcement-learning",
      icon: Cpu,
      title: "Reinforcement",
      description: "Dynamic agent-based learning environments using Q-Learning and reward-based optimization."
    }
  ];

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-purple-500/30">
      <Navigation 
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Persistent global background elements */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-full max-w-[500px] h-[350px] md:h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-full max-w-[500px] h-[350px] md:h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isExploring ? (
          <motion.div 
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="min-h-screen flex flex-col items-center justify-center pt-20 px-8 relative"
          >
            <div className="text-center relative z-10 max-w-5xl">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-10"
              >
                <div className="w-1 h-1 rounded-full bg-purple-500 animate-ping" />
                Next-Gen ML Learning Engine
              </motion.div>
              
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl break-words hyphens-auto leading-tight font-black tracking-tighter text-white mb-2 uppercase italic">
                Quantified <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 not-italic">Logic</span>
              </h1>
              
              <RotatingText texts={["Visualize Data", "Analyze Kernels", "Train Models", "Optimize Space"]} />
              
              <p className="text-gray-500 text-sm sm:text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto my-12 leading-relaxed px-4">
                Experience the raw math of artificial intelligence through interactive laboratory environments. 
                De-mystify algorithms with high-fidelity visual telemetry.
              </p>
              
              <div className="flex flex-col items-center justify-center gap-6">
                <button 
                  onClick={() => setIsExploring(true)}
                  className="px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-purple-500/20"
                  aria-label="Enter the Algorithm Laboratory"
                >
                  Enter Laboratory
                </button>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1, duration: 2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
               <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 text-center">Scroll to Explore</div>
               <div className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="algorithms"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="min-h-screen pt-32 sm:pt-40 pb-32 px-4 sm:px-8 max-w-7xl mx-auto relative z-10"
          >
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 sm:mb-20 gap-8">
              <div className="flex-1 w-full overflow-hidden">
                <button 
                  onClick={() => setIsExploring(false)}
                  className="flex items-center gap-3 text-gray-500 hover:text-white transition-all group mb-8 uppercase font-black text-[10px] tracking-[0.4em]"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-600/20">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                  Return Home
                </button>
                <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic break-words hyphens-auto">
                  Algorithm <br className="md:hidden" /><span className="text-purple-500 not-italic">Facilitators</span>
                </h2>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm max-w-xs font-light tracking-widest uppercase leading-loose text-left md:text-right">
                 Select a paradigm to begin high-fidelity simulation of machine learning architectures.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-32">
              {algorithmCards.map((card) => (
                <AlgorithmCard key={card.href} {...card} />
              ))}
            </div>

            {/* Elite Portfolio Impact Section */}
            <div className="mt-32 pt-20 border-t border-white/10 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-4 block">System Architecture</span>
                  <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">About the <br/>Engine</h3>
                  <div className="flex gap-4">
                    <a href="https://github.com/Sriram1003" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2">
                      GitHub Source
                    </a>
                  </div>
                </div>
                
                <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-xl font-bold text-white mb-4">Core Technologies</h4>
                    <ul className="space-y-3 text-sm text-gray-400">
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Next.js 13 App Router (Static Export)</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"/> Recharts & D3.js (Data Vis)</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"/> Framer Motion (Hardware Accel)</li>
                      <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Web Workers (Async Processing)</li>
                    </ul>
                  </div>
                  
                  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-xl font-bold text-white mb-4">Engineering Challenges</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Built to solve the <span className="text-purple-400 font-bold">hydration mismatch</span> paradigm between server-side React and heavy client-side SVG libraries like D3. Achieved 60fps animations on large datasets by offloading matrix transformations to non-blocking Web Workers while dynamically importing SVG rendering trees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
export default Home;