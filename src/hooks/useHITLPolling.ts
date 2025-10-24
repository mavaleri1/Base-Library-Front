import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import type { ProcessingStatusWithHITL } from '../types';

interface UseHITLPollingOptions {
  threadId: string | null;
  enabled?: boolean;
  interval?: number;
  onInterrupt?: (status: ProcessingStatusWithHITL) => void;
  onComplete?: (status: ProcessingStatusWithHITL) => void;
  onError?: (error: Error) => void;
}

interface UseHITLPollingResult {
  status: ProcessingStatusWithHITL | null;
  isPolling: boolean;
  error: Error | null;
  startPolling: () => void;
  stopPolling: () => void;
  refreshStatus: () => Promise<void>;
}

export const useHITLPolling = ({
  threadId,
  enabled = true,
  interval = 3000,
  onInterrupt,
  onComplete,
  onError,
}: UseHITLPollingOptions): UseHITLPollingResult => {
  const [status, setStatus] = useState<ProcessingStatusWithHITL | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const previousStatusRef = useRef<string | undefined>(undefined);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const fetchStatus = useCallback(async () => {
    if (!threadId || !isMountedRef.current) return;

    try {
      const newStatus = await api.getThreadState(threadId);
      
      if (!isMountedRef.current) return;

      setStatus(newStatus);
      setError(null);

      if (newStatus.interrupted && newStatus.awaiting_feedback) {
        stopPolling();
        onInterrupt?.(newStatus);
      } 
      else if (newStatus.status === 'completed' && previousStatusRef.current !== 'completed') {
        stopPolling();
        onComplete?.(newStatus);
      }
      else if (newStatus.status === 'failed') {
        stopPolling();
        const err = new Error(newStatus.error || 'Processing failed with error');
        setError(err);
        onError?.(err);
      }

      previousStatusRef.current = newStatus.status;
    } catch (err: any) {
      if (!isMountedRef.current) return;
      
      const error = err instanceof Error ? err : new Error(err.message || 'Error getting status');
      setError(error);
      onError?.(error);
      stopPolling();
    }
  }, [threadId, onInterrupt, onComplete, onError, stopPolling]);

  const startPolling = useCallback(() => {
    if (!threadId || isPolling) return;

    setIsPolling(true);
    setError(null);
    previousStatusRef.current = undefined;

    fetchStatus();

    intervalRef.current = setInterval(fetchStatus, interval);
  }, [threadId, isPolling, fetchStatus, interval]);

  const refreshStatus = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    isMountedRef.current = true;

    if (enabled && threadId) {
      startPolling();
    }

    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [enabled, threadId, startPolling, stopPolling]);

  return {
    status,
    isPolling,
    error,
    startPolling,
    stopPolling,
    refreshStatus,
  };
};



