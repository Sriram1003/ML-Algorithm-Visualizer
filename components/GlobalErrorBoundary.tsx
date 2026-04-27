'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-black/60 border border-red-500/30 rounded-3xl p-10 backdrop-blur-3xl text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">
              Runtime <span className="text-red-500 not-italic">Crash</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              The laboratory encountered a critical kernel failure. This could be due to memory exhaustion or invalid dataset dimensions.
            </p>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-8 text-left">
              <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1">Stack Trace Excerpt</p>
              <p className="text-[10px] font-mono text-gray-600 truncate">{this.state.error?.message}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-6 rounded-xl"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Reboot Laboratory
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
