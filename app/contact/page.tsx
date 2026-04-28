'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Phone, Github, Linkedin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation Removed */}

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left Side: Info */}
          <div>
            <h1 className="text-7xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-600">
              Station <span className="text-white">Contact</span>
            </h1>
            <p className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-xl">
              Have inquiries about our algorithm labs or neural visualizations?
              Our ground station is active 24/7 for technical sync.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6 items-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-teal-500/20 transition-all">
                  <Mail className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Electronic Mail</p>
                  <p className="text-xl font-bold">sriram.gaja10@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-6 items-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Direct Comms</p>
                  <p className="text-xl font-bold">[YOUR MOBILE NUMBER]</p>
                </div>
              </div>

              <div className="flex gap-6 items-center group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Orbital HQ</p>
                  <p className="text-xl font-bold">Hyderabad, Telangana, India</p>
                </div>
              </div>
            </div>

            {/* Social Bridges */}
            <div className="mt-16 flex gap-4">
              <a href="https://github.com/Sriram1003" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all group">
                <Github size={20} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="https://www.linkedin.com/in/sriram-gaja-b49aaa255/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all group">
                <Linkedin size={20} className="text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Right Side: Form */}
          {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 shadow-2xl"
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block">Operator Name</label>
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:border-teal-500/50 outline-none transition-all text-sm"
                    placeholder="Enter Identification"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block">Neural ID (Email)</label>
                  <input
                    type="email"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:border-purple-500/50 outline-none transition-all text-sm"
                    placeholder="name@nexus.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block">Transmission Subject</label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:border-purple-500/50 outline-none transition-all text-sm"
                  placeholder="System Inquiry"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block">Message Payload</label>
                <textarea
                  className="w-full h-40 bg-black/40 border border-white/5 rounded-3xl py-4 px-6 focus:border-teal-500/50 outline-none transition-all text-sm resize-none"
                  placeholder="Describe your technical requirements..."
                />
              </div>

              <button className="w-full bg-gradient-to-r from-teal-600 to-purple-600 hover:opacity-90 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.01] shadow-xl shadow-purple-500/10 group uppercase tracking-widest text-sm">
                <span>Broadcast Transmission</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div> */}
        </div>
      </div>
    </div>
  );
}
