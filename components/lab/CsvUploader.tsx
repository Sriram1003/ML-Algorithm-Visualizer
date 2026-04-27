import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface CsvUploaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isTraining: boolean;
  error: string | null;
  dataPoints: number;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onFileUpload, isTraining, error, dataPoints }) => {
  return (
    <Card className="bg-black/60 border-purple-500/30 border backdrop-blur-3xl overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center gap-2 uppercase tracking-[0.2em] text-sm">
          <Upload className="h-5 w-5" /> Source Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-6 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              onClick={() => document.getElementById('fileInput')?.click()}
              disabled={isTraining}
              aria-label="Upload CSV Dataset"
            >
              <Upload className="mr-3 h-5 w-5" aria-hidden="true" />
              Ingest CSV
            </Button>
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onFileUpload}
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="flex-1" aria-live="polite">
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Status</p>
               {dataPoints > 0 ? (
                 <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                    {dataPoints} ROWS LOADED
                 </div>
               ) : (
                 <div className="text-gray-600 font-mono text-xs italic">AWAITING_INPUT_STREAM</div>
               )}
            </div>
          </div>
          {error && (
            <div 
              role="alert"
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-1">Upload Blocked</p>
                <p className="text-red-200/80 text-xs leading-relaxed">{error}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
