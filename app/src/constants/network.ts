// Centralized network configuration constants

// Timeout values (in milliseconds)
export const TIMEOUT = {
  JOB_CREATION: 10000, // 10 seconds
  DEFAULT: 10000,
} as const;

// Retry configuration
export const RETRY = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  LISTENER_DELAY: 2000, // For real-time listeners
} as const;

// Job creation specific (can use different values if needed)
export const JOB_CREATION_RETRY = {
  MAX_RETRIES: 2,
  INITIAL_DELAY: 1000,
} as const;
