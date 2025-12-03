import { RETRY } from '../constants/network';

// Error types for better user feedback
export type ErrorType =
  | 'network'
  | 'timeout'
  | 'not_found'
  | 'permission'
  | 'validation'
  | 'server'
  | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  userMessage: string;
  retryable: boolean;
}

// Parse Firebase/network errors into user-friendly messages
export function parseError(error: unknown): AppError {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = (error as { code?: string })?.code;

  // Network errors
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('Network') ||
    errorMessage.includes('Failed to fetch') ||
    errorCode === 'unavailable'
  ) {
    return {
      type: 'network',
      message: errorMessage,
      userMessage: 'No internet connection. Please check your network and try again.',
      retryable: true,
    };
  }

  // Timeout errors
  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    return {
      type: 'timeout',
      message: errorMessage,
      userMessage: 'Request timed out. Please try again.',
      retryable: true,
    };
  }

  // Not found errors
  if (errorMessage.includes('not found') || errorCode === 'not-found') {
    return {
      type: 'not_found',
      message: errorMessage,
      userMessage: 'The requested item was not found.',
      retryable: false,
    };
  }

  // Permission errors
  if (
    errorMessage.includes('permission') ||
    errorCode === 'permission-denied' ||
    errorCode === 'unauthenticated'
  ) {
    return {
      type: 'permission',
      message: errorMessage,
      userMessage: 'You don\'t have permission to perform this action.',
      retryable: false,
    };
  }

  // Validation errors
  if (errorMessage.includes('Invalid') || errorMessage.includes('validation')) {
    return {
      type: 'validation',
      message: errorMessage,
      userMessage: 'Invalid input. Please check your data and try again.',
      retryable: false,
    };
  }

  // Server errors
  if (
    errorCode?.startsWith('internal') ||
    errorMessage.includes('server') ||
    errorMessage.includes('500')
  ) {
    return {
      type: 'server',
      message: errorMessage,
      userMessage: 'Server error. Please try again later.',
      retryable: true,
    };
  }

  // Unknown errors
  return {
    type: 'unknown',
    message: errorMessage,
    userMessage: 'Something went wrong. Please try again.',
    retryable: true,
  };
}

// Retry helper with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: AppError) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = RETRY.MAX_RETRIES,
    initialDelay = RETRY.INITIAL_DELAY,
    maxDelay = RETRY.MAX_DELAY,
    onRetry,
  } = options;

  let lastError: AppError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = parseError(error);

      // Don't retry non-retryable errors
      if (!lastError.retryable || attempt === maxRetries) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);

      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
