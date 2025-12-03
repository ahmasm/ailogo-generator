import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, fontFamily } from '../constants/theme';
import { fs, sp, lh, radius, s, height } from '../utils/scale';
import type { JobStatus } from '../types';

interface StatusChipProps {
  status: JobStatus;
  onPress?: () => void;
  errorMessage?: string | null;
  imageUrl?: string | null;
}

function StatusChipComponent({ status, onPress, errorMessage, imageUrl }: StatusChipProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'idle') {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [status, fadeAnim]);

  // Spin animation for processing state
  useEffect(() => {
    if (status === 'processing') {
      const spin = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      );
      spin.start();
      return () => spin.stop();
    } else {
      spinAnim.setValue(0);
    }
  }, [status, spinAnim]);

  if (status === 'idle') {
    return null;
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          title: 'Creating Your Design',
          subtitle: 'Logo is rendering now...',
          subtitleColor: '#71717A',
          tappable: false,
        };
      case 'done':
        return {
          title: 'Your Design is Ready!',
          subtitle: 'Tap to view',
          subtitleColor: '#D4D4D8',
          tappable: true,
        };
      case 'failed':
        return {
          title: 'Oops, something went wrong',
          subtitle: 'Click to try again',
          subtitleColor: '#D4D4D8',
          tappable: true,
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderLeftSection = () => {
    switch (status) {
      case 'processing':
        return (
          <View style={[styles.leftSection, styles.leftProcessing]}>
            <ActivityIndicator size="large" color={colors.textPrimary} />
          </View>
        );
      case 'done':
        return imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.previewImage}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
          />
        ) : (
          <View style={[styles.leftSection, styles.leftDone]}>
            <LinearGradient
              colors={['#943DFF', '#2938DC']}
              style={styles.previewPlaceholder}
            >
              <Text style={styles.checkIcon}>✓</Text>
            </LinearGradient>
          </View>
        );
      case 'failed':
        return (
          <View style={[styles.leftSection, styles.leftFailed]}>
            {/* Alert circle icon - Figma: 32x32 */}
            <View style={styles.alertCircle}>
              <View style={styles.alertCircleInner}>
                <View style={styles.alertLine} />
                <View style={styles.alertDot} />
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const renderRightSection = () => {
    const content = (
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{config.title}</Text>
        <Text style={[styles.subtitle, { color: config.subtitleColor }]} numberOfLines={1}>
          {config.subtitle}
        </Text>
      </View>
    );

    switch (status) {
      case 'processing':
        return (
          <View style={styles.rightSection}>
            <BlurView intensity={5} style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(148, 61, 255, 0.05)', 'rgba(41, 56, 220, 0.05)']}
              start={{ x: 1, y: 0.5 }}
              end={{ x: 0, y: 0.5 }}
              locations={[0.2459, 1]}
              style={[StyleSheet.absoluteFill]}
            />
            <View style={[styles.rightContent, { backgroundColor: '#27272A' }]}>
              {content}
            </View>
          </View>
        );
      case 'done':
        return (
          <LinearGradient
            colors={['#943DFF', '#2938DC']}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
            locations={[0.2459, 1]}
            style={styles.rightSection}
          >
            <View style={styles.rightContent}>
              {content}
            </View>
          </LinearGradient>
        );
      case 'failed':
        return (
          <View style={[styles.rightSection, { backgroundColor: '#EF4444' }]}>
            <View style={styles.rightContent}>
              {content}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const getAccessibilityLabel = () => {
    switch (status) {
      case 'processing':
        return 'Creating your design. Logo is rendering now.';
      case 'done':
        return 'Your design is ready! Double tap to view.';
      case 'failed':
        return 'Something went wrong. Double tap to try again.';
      default:
        return '';
    }
  };

  const ChipContent = (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }]}
      accessible={!config.tappable}
      accessibilityLabel={!config.tappable ? getAccessibilityLabel() : undefined}
      accessibilityRole={!config.tappable ? 'text' : undefined}
    >
      {renderLeftSection()}
      {renderRightSection()}
    </Animated.View>
  );

  if (config.tappable && onPress) {
    const handlePressWithHaptic = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    };

    return (
      <Pressable
        onPress={handlePressWithHaptic}
        style={({ pressed }) => pressed && styles.pressed}
        accessible
        accessibilityRole="button"
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={status === 'done' ? 'Opens the generated logo' : 'Allows you to retry'}
      >
        {ChipContent}
      </Pressable>
    );
  }

  return ChipContent;
}

const styles = StyleSheet.create({
  container: {
    // Figma: 342x70, flex row
    width: '100%',
    height: height(70),
    flexDirection: 'row',
    borderRadius: radius(16),
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  // Left section - 70x70 icon area
  leftSection: {
    width: s(70),
    height: height(70),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: radius(16),
    borderBottomLeftRadius: radius(16),
  },
  leftProcessing: {
    backgroundColor: '#18181B',
  },
  leftDone: {
    backgroundColor: '#27272A',
  },
  leftFailed: {
    // Figma: rgba(239, 68, 68, 0.7) over image - appears lighter than solid #EF4444
    backgroundColor: '#F87171',
  },
  previewImage: {
    width: s(70),
    height: height(70),
    borderTopLeftRadius: radius(16),
    borderBottomLeftRadius: radius(16),
  },
  previewPlaceholder: {
    width: s(70),
    height: height(70),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: radius(16),
    borderBottomLeftRadius: radius(16),
  },
  checkIcon: {
    fontSize: fs(28),
    color: '#FAFAFA',
    fontWeight: 'bold',
  },
  // Alert circle icon - Figma: 32x32
  alertCircle: {
    width: s(32),
    height: s(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertCircleInner: {
    // Figma: Subtract - 28.67x28.67, white bg
    width: s(28.67),
    height: s(28.67),
    borderRadius: s(14.33),
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertLine: {
    // Figma: Vector 2610 - the "!" line (dark on white bg)
    width: s(2.4),
    height: s(7),
    backgroundColor: '#2A353D',
    borderRadius: s(1.2),
    marginBottom: s(2),
  },
  alertDot: {
    // Figma: Vector - the "!" dot (dark on white bg)
    width: s(2.4),
    height: s(2.4),
    backgroundColor: '#2A353D',
    borderRadius: s(1.2),
  },
  // Right section - 272x70 content area
  rightSection: {
    flex: 1,
    height: height(70),
    borderTopRightRadius: radius(16),
    borderBottomRightRadius: radius(16),
    overflow: 'hidden',
  },
  rightContent: {
    flex: 1,
    paddingHorizontal: sp(12),
    justifyContent: 'center',
  },
  textContainer: {
    gap: sp(2),
  },
  title: {
    // Figma: fontSize 16, fontWeight 800, lineHeight 21, letterSpacing -0.01em
    fontSize: fs(16),
    lineHeight: lh(21),
    fontFamily: fontFamily.extraBold,
    color: '#FAFAFA',
    letterSpacing: fs(-0.16),
  },
  subtitle: {
    // Figma: fontSize 13, fontWeight 500, lineHeight 18, letterSpacing -0.01em
    fontSize: fs(13),
    lineHeight: lh(18),
    fontFamily: fontFamily.medium,
    letterSpacing: fs(-0.13),
  },
});

// Memoized export - prevents unnecessary re-renders when parent updates
// Custom comparison skips onPress since function identity may change
// but functionality stays the same
export const StatusChip = React.memo(StatusChipComponent, (prevProps, nextProps) => {
  return (
    prevProps.status === nextProps.status &&
    prevProps.errorMessage === nextProps.errorMessage &&
    prevProps.imageUrl === nextProps.imageUrl
  );
});
