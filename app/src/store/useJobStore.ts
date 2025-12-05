import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { JobStatus, LogoStyle } from '../types';

interface JobState {
  // Current job
  currentJobId: string | null;
  status: JobStatus;
  prompt: string;
  style: LogoStyle;
  imageUrl: string | null;
  errorMessage: string | null;

  // Actions
  setPrompt: (prompt: string) => void;
  setStyle: (style: LogoStyle) => void;
  startJob: (jobId: string) => void;
  setStatus: (status: JobStatus) => void;
  setImageUrl: (url: string) => void;
  setError: (message: string) => void;
  reset: () => void;
}

const initialState = {
  currentJobId: null,
  status: 'idle' as JobStatus,
  prompt: '',
  style: 'no-style' as LogoStyle,
  imageUrl: null,
  errorMessage: null,
};

export const useJobStore = create<JobState>((set) => ({
  ...initialState,

  setPrompt: (prompt) => set({ prompt }),

  setStyle: (style) => set({ style }),

  startJob: (jobId) =>
    set({
      currentJobId: jobId,
      status: 'processing',
      imageUrl: null,
      errorMessage: null,
    }),

  setStatus: (status) => set({ status }),

  setImageUrl: (url) => set({ imageUrl: url }),

  setError: (message) =>
    set({
      status: 'failed',
      errorMessage: message,
    }),

  reset: () => set(initialState),
}));

// Optimized selectors to prevent unnecessary re-renders

// Use for InputScreen - only subscribes to needed state
export const useInputScreenState = () =>
  useJobStore(
    useShallow((state) => ({
      prompt: state.prompt,
      style: state.style,
      status: state.status,
      currentJobId: state.currentJobId,
      errorMessage: state.errorMessage,
      imageUrl: state.imageUrl,
    }))
  );

// Actions selector - useShallow needed to prevent new object reference each render
export const useInputScreenActions = () =>
  useJobStore(
    useShallow((state) => ({
      setPrompt: state.setPrompt,
      setStyle: state.setStyle,
      startJob: state.startJob,
      setStatus: state.setStatus,
      setImageUrl: state.setImageUrl,
      setError: state.setError,
      reset: state.reset,
    }))
  );

// Use for OutputScreen - only subscribes to display data
export const useOutputScreenState = () =>
  useJobStore(
    useShallow((state) => ({
      imageUrl: state.imageUrl,
      prompt: state.prompt,
      style: state.style,
    }))
  );

// Use for StatusChip - only status related
export const useStatusChipState = () =>
  useJobStore(
    useShallow((state) => ({
      status: state.status,
      errorMessage: state.errorMessage,
      imageUrl: state.imageUrl,
      currentJobId: state.currentJobId,
    }))
  );

// Use for useJobListener hook - mixed state + actions
export const useJobListenerState = () =>
  useJobStore(
    useShallow((state) => ({
      currentJobId: state.currentJobId,
      setStatus: state.setStatus,
      setImageUrl: state.setImageUrl,
      setError: state.setError,
    }))
  );
