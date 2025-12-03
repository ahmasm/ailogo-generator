import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, fontFamily } from '../constants/theme';
import { fs, sp, lh, radius } from '../utils/scale';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch JavaScript errors in child components.
 * Prevents the entire app from crashing and shows a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to monitoring service (e.g., Sentry, Crashlytics)
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo.componentStack);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>😵</Text>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              The app encountered an unexpected error. Please try again.
            </Text>
            {__DEV__ && this.state.error && (
              <Text style={styles.errorDetail}>
                {this.state.error.message}
              </Text>
            )}
            <Pressable
              onPress={this.handleRetry}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Try again"
              accessibilityHint="Attempts to recover from the error"
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: sp(24),
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emoji: {
    fontSize: fs(64),
    marginBottom: sp(16),
  },
  title: {
    fontSize: fs(20),
    lineHeight: lh(25),
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: sp(8),
  },
  message: {
    fontSize: fs(14),
    lineHeight: lh(20),
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: sp(24),
  },
  errorDetail: {
    fontSize: fs(11),
    lineHeight: lh(14),
    fontFamily: fontFamily.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: sp(16),
    padding: sp(8),
    backgroundColor: colors.surface,
    borderRadius: radius(8),
    overflow: 'hidden',
  },
  button: {
    backgroundColor: colors.surface,
    paddingVertical: sp(12),
    paddingHorizontal: sp(24),
    borderRadius: radius(50),
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: fs(15),
    lineHeight: lh(20),
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
});
