import { useEffect, useState, useCallback } from 'react';
import * as Comlink from 'comlink';

export function useMLWorker() {
  const [workerApi, setWorkerApi] = useState<any>(null);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    // Initialize the worker
    const mlWorker = new Worker(new URL('../lib/workers/ml.worker.ts', import.meta.url), {
      type: 'module',
    });
    
    const api = Comlink.wrap(mlWorker);
    setWorkerApi(api);
    setWorker(mlWorker);

    return () => {
      mlWorker.terminate();
    };
  }, []);

  return { workerApi, worker };
}
