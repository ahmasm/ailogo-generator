import { useEffect, useRef, useCallback } from 'react';
import { subscribeToJob } from '../services/firebase';
import { useJobListenerState } from '../store/useJobStore';
import { parseError } from '../utils/errors';
import { RETRY } from '../constants/network';
import type { Job } from '../types';

export function useJobListener() {
  // Optimized selector - only subscribes to what this hook needs
  const { currentJobId, setStatus, setImageUrl, setError } = useJobListenerState();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const subscribe = useCallback(() => {
    if (!currentJobId) return;

    const unsubscribe = subscribeToJob(
      currentJobId,
      (job: Job) => {
        // Reset retry count on successful update
        retryCountRef.current = 0;

        setStatus(job.status);

        if (job.status === 'done' && job.imageUrl) {
          setImageUrl(job.imageUrl);
        }

        if (job.status === 'failed' && job.errorMessage) {
          setError(job.errorMessage);
        }
      },
      (error) => {
        const appError = parseError(error);
        console.error('Job listener error:', appError);

        // Retry for retryable errors
        if (appError.retryable && retryCountRef.current < RETRY.MAX_RETRIES) {
          retryCountRef.current += 1;
          console.log(`Retrying subscription (${retryCountRef.current}/${RETRY.MAX_RETRIES})...`);

          // Cleanup current subscription
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }

          // Retry after delay
          retryTimeoutRef.current = setTimeout(() => {
            subscribe();
          }, RETRY.LISTENER_DELAY * retryCountRef.current);
        } else {
          // Max retries reached or non-retryable error
          setError(appError.userMessage);
        }
      }
    );

    unsubscribeRef.current = unsubscribe;
  }, [currentJobId, setStatus, setImageUrl, setError]);

  useEffect(() => {
    // Cleanup previous subscription and retry timeout
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    retryCountRef.current = 0;

    // If no job, nothing to subscribe to
    if (!currentJobId) {
      return;
    }

    // Subscribe to job updates
    subscribe();

    // Cleanup on unmount or jobId change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [currentJobId, subscribe]);
}
