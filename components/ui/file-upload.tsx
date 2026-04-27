'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({ onDataLoaded, accept = ".csv", maxSize = 5, className = "" }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (in MB)
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setFileName(file.name);
    setError(null);

    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      
      const data = rows.slice(1)
        .filter(row => row.trim())
        .map(row => {
          const values = row.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = Number(values[index]) || values[index];
            return obj;
          }, {} as any);
        });

      onDataLoaded(data);
    } catch (err) {
      setError('Error parsing file. Please ensure it\'s a valid CSV.');
    }
  };

  return (
    <Card className={`bg-gray-900 border-purple-700 p-6 ${className}`}>
      <div className="flex flex-col items-center">
        <label className="w-full cursor-pointer">
          <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-colors">
            <Upload className="w-8 h-8 text-purple-400 mb-2" />
            <p className="text-sm text-purple-300">
              {fileName ? fileName : 'Upload CSV file'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Max size: {maxSize}MB
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileUpload}
          />
        </label>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm flex items-center">
            <X className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {fileName && !error && (
          <Button
            onClick={() => {
              setFileName(null);
              setError(null);
            }}
            variant="outline"
            className="mt-4 text-purple-300 border-purple-500"
          >
            <X className="w-4 h-4 mr-2" /> Clear file
          </Button>
        )}
      </div>
    </Card>
  );
}