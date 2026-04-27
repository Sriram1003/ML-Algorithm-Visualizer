import { useState, useCallback } from 'react';
import { Metrics } from '@/lib/ml';

export interface MLModelState {
  data: any[][] | null;
  isTraining: boolean;
  metrics: Metrics | null;
  losses: number[] | null;
  error: string | null;
}

export function useMLModel() {
  const [data, setData] = useState<any[][] | null>(null);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [losses, setLosses] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // 1. Check for empty files
    if (file.size === 0) {
      setError("FILE_ERROR: The selected file is empty.");
      return;
    }

    // 2. Check for large files (Limit to 10MB for browser-side ML)
    if (file.size > 10 * 1024 * 1024) {
      setError("LIMIT_ERROR: File size exceeds 10MB. Please use a smaller sample for interactive visualization.");
      return;
    }

    // 3. Check file extension
    if (!file.name.endsWith('.csv')) {
      setError("FORMAT_ERROR: Invalid file type. Please upload a .csv file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        let rows = csvData.split('\n')
          .filter(row => row.trim())
          .map(row => row.split(',').map(cell => cell.trim()));
        
        // 4. Validate Row Count
        if (rows.length < 5) {
          throw new Error("DATASET_ERROR: Insufficient data. Minimum 5 rows required.");
        }

        const headers = rows[0];
        const dataRows = rows.slice(1);

        // 5. Standardize Row Length (Missing columns)
        const expectedColumnCount = headers.length;
        const uniformRows = dataRows.filter(row => {
          if (row.length !== expectedColumnCount) {
             console.warn(`Skipping malformed row: ${row}`);
             return false;
          }
          return true;
        });

        if (uniformRows.length < 4) {
          throw new Error("MALFORMED_DATA: Majority of rows have incorrect column counts.");
        }

        // 6. Check for Internal Missing Values / Non-Numeric Features
        const processedData: any[][] = [];
        for (let i = 0; i < uniformRows.length; i++) {
          const row = uniformRows[i];
          const processedRow: any[] = [];
          
          for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            
            // Check for missing values
            if (cell === "" || cell === undefined || cell === null) {
              throw new Error(`VALUE_ERROR: Missing value detected at row ${i + 2}, column ${j + 1}.`);
            }

            // For all columns except the last (label), ensure numeric
            if (j < row.length - 1) {
              const num = Number(cell);
              if (isNaN(num)) {
                throw new Error(`TYPE_ERROR: Non-numeric feature detected at row ${i + 2}, column ${j + 1} ("${cell}"). Features must be numeric.`);
              }
              processedRow.push(num);
            } else {
              // The label can be anything, but we'll try to convert if numeric
              processedRow.push(isNaN(Number(cell)) ? cell : Number(cell));
            }
          }
          processedData.push(processedRow);
        }

        // 7. Detect Duplicate Rows
        const uniqueRows = new Set(processedData.map(r => JSON.stringify(r)));
        if (uniqueRows.size < processedData.length) {
          const duplicateCount = processedData.length - uniqueRows.size;
          console.info(`CLEANING_LOG: Removed ${duplicateCount} duplicate rows.`);
          setData(Array.from(uniqueRows).map(r => JSON.parse(r)));
        } else {
          setData(processedData);
        }

      } catch (err) {
        setError((err as Error).message);
        setData(null);
      }
    };

    reader.onerror = () => {
      setError("IO_ERROR: Failed to read file from disk.");
    };

    reader.readAsText(file);
  }, []);

  return {
    data,
    setData,
    isTraining,
    setIsTraining,
    metrics,
    setMetrics,
    losses,
    setLosses,
    error,
    setError,
    handleFileUpload,
  };
}
