// Centralized strings for future i18n support
// When ready to add i18n, replace this with a proper library like i18next

export const strings = {
  // App
  appName: 'AI Logo',

  // Input Screen
  input: {
    title: 'AI Logo',
    promptPlaceholder: 'Describe your logo...',
    surpriseMe: 'Surprise me',
    createButton: 'Create',
    creatingButton: 'Creating...',
  },

  // Output Screen
  output: {
    title: 'Your Design',
    promptLabel: 'Prompt',
    copy: 'Copy',
    copied: 'Copied!',
    noImage: 'No image available',
    loadError: 'Failed to load image',
    noPrompt: 'No prompt provided',
  },

  // Status Chip
  status: {
    processing: {
      title: 'Creating Your Design',
      subtitle: 'Logo is rendering now...',
    },
    done: {
      title: 'Your Design is Ready!',
      subtitle: 'Tap to view',
    },
    failed: {
      title: 'Oops, something went wrong',
      subtitle: 'Click to try again',
    },
  },

  // Style Labels
  styles: {
    noStyle: 'No Style',
    monogram: 'Monogram',
    abstract: 'Abstract',
    mascot: 'Mascot',
  },

  // Errors
  errors: {
    network: 'No internet connection. Please check your network and try again.',
    timeout: 'Request timed out. Please try again.',
    notFound: 'The requested item was not found.',
    permission: "You don't have permission to perform this action.",
    validation: 'Invalid input. Please check your data and try again.',
    server: 'Server error. Please try again later.',
    unknown: 'Something went wrong. Please try again.',
    jobCreationTimeout: 'Job creation timed out. Please check your internet connection.',
  },

  // Alerts
  alerts: {
    pleaseWait: 'Please Wait',
    logoGenerating: 'A logo is currently being generated.',
    connectionError: 'Connection Error',
    error: 'Error',
    cancel: 'Cancel',
    retry: 'Retry',
    tryAgain: 'Try Again',
  },

  // Accessibility
  a11y: {
    closeButton: 'Close',
    closeHint: 'Returns to the input screen',
    copyPrompt: 'Copy prompt',
    copyHint: 'Copies the prompt text to clipboard',
    copiedToClipboard: 'Copied to clipboard',
    createButton: 'Create logo',
    createDisabled: 'Create button disabled, enter a prompt first',
    creatingLogo: 'Creating logo, please wait',
    createHint: 'Generates a new logo based on your prompt',
    statusProcessing: 'Creating your design. Logo is rendering now.',
    statusDone: 'Your design is ready! Double tap to view.',
    statusFailed: 'Something went wrong. Double tap to try again.',
    statusDoneHint: 'Opens the generated logo',
    statusFailedHint: 'Allows you to retry',
  },

  // Error Boundary
  errorBoundary: {
    title: 'Oops! Something went wrong',
    message: 'The app encountered an unexpected error. Please try again.',
  },
} as const;

// Type helper for nested access
export type Strings = typeof strings;
