import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TopBar, PromptInput, StyleSelector, CreateButton, StatusChip } from '../components';
import { colors, spacing } from '../constants/theme';
import { useInputScreenState, useInputScreenActions } from '../store/useJobStore';
import { useJobListener } from '../hooks/useJobListener';
import { createJob } from '../services/firebase';
import { withRetry, type AppError } from '../utils/errors';
import { JOB_CREATION_RETRY } from '../constants/network';
import type { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Input'>;

export function InputScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();

  // Optimized selectors - only re-render when specific state changes
  const { prompt, style, status, currentJobId, errorMessage, imageUrl } = useInputScreenState();
  const { setPrompt, setStyle, startJob, reset } = useInputScreenActions();

  // Listen to job updates
  useJobListener();

  const isProcessing = status === 'processing';
  const canCreate = prompt.trim().length > 0 && !isProcessing;

  // Memoize background style to prevent new object on each render
  const backgroundStyle = useMemo(
    () => [styles.backgroundGradient, { width: screenWidth, height: screenHeight }],
    [screenWidth, screenHeight]
  );

  const handleStatusChipPress = useCallback(() => {
    if (status === 'done' && currentJobId) {
      navigation.navigate('Output', { jobId: currentJobId });
    } else if (status === 'failed') {
      // Reset status to allow retry with same or modified prompt
      reset();
    }
  }, [status, currentJobId, navigation, reset]);

  // Extract error handling for SRP
  const showJobCreationError = useCallback((error: AppError, onRetry: () => void) => {
    if (__DEV__) {
      console.error('Failed to create job:', error);
    }

    if (error.retryable) {
      Alert.alert('Connection Error', error.userMessage, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retry', onPress: onRetry },
      ]);
    } else {
      Alert.alert('Error', error.userMessage);
    }
  }, []);

  const handleCreate = useCallback(async () => {
    if (!canCreate) {
      if (isProcessing) {
        Alert.alert('Please Wait', 'A logo is currently being generated.');
      }
      return;
    }

    try {
      const jobId = await withRetry(
        () => createJob(prompt.trim(), style),
        {
          maxRetries: JOB_CREATION_RETRY.MAX_RETRIES,
          initialDelay: JOB_CREATION_RETRY.INITIAL_DELAY,
          onRetry: __DEV__
            ? (attempt, error) => {
                console.log(`Retrying job creation (${attempt}/${JOB_CREATION_RETRY.MAX_RETRIES}): ${error.message}`);
              }
            : undefined,
        }
      );
      startJob(jobId);
    } catch (error) {
      showJobCreationError(error as AppError, handleCreate);
    }
  }, [canCreate, isProcessing, prompt, style, startJob, showJobCreationError]);

  return (
    <View style={styles.container}>
      {/* Background Gradient - PNG with baked-in blur effect from Figma */}
      <Image
        source={require('../../assets/back-gradient.png')}
        style={backgroundStyle}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Top Bar */}
          <TopBar />

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {/* Status Chip */}
            {status !== 'idle' && (
              <StatusChip
                status={status}
                onPress={handleStatusChipPress}
                errorMessage={errorMessage}
                imageUrl={imageUrl}
              />
            )}

            {/* Prompt Input */}
            <PromptInput value={prompt} onChangeText={setPrompt} />

            {/* Style Selector */}
            <StyleSelector selectedStyle={style} onSelectStyle={setStyle} />

          </ScrollView>

          {/* Bottom Section */}
          <SafeAreaView edges={['bottom']} style={styles.bottomSection}>
            <CreateButton
              onPress={handleCreate}
              disabled={!canCreate}
              loading={isProcessing}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
