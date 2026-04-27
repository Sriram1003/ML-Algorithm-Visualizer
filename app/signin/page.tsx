'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, ArrowRight, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-teal-600/10 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-600">
              AlgoVista
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Access your neural dashboard and labs</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500/50 outline-none transition-all text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2 block">Security Token</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-purple-500/50 outline-none transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-teal-600 to-purple-600 hover:opacity-90 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xl shadow-purple-500/20 group">
              <span>Initialize Session</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5">
            <p className="text-center text-xs text-gray-500 uppercase tracking-[0.2em] mb-6 font-bold">Or sync with</p>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 border border-white/5 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                <Github size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Github</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-3 border border-white/5 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                <Mail size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Google</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500">
          Neural network unauthorized? <Link href="/contact" className="text-purple-400 hover:text-purple-300 font-bold">Contact Station</Link>
        </p>
      </motion.div>
    </div>
  );
}
