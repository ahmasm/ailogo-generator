import React, { useEffect, useRef, useCallback } from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, fontFamily } from '../constants/theme';
import { fs, sp, lh, radius, height, icon } from '../utils/scale';

const starsIcon = require('../../assets/stars.png');

interface CreateButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function CreateButton({ onPress, disabled = false, loading = false }: CreateButtonProps) {
  const isDisabled = disabled || loading;
  const showGrayBg = disabled && !loading;

  // Pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Haptic feedback on press
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [onPress]);

  useEffect(() => {
    if (loading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading, pulseAnim]);

  const accessibilityLabel = loading
    ? 'Creating logo, please wait'
    : disabled
    ? 'Create button disabled, enter a prompt first'
    : 'Create logo';

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityHint="Generates a new logo based on your prompt"
      style={({ pressed }) => [
        styles.container,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      <Animated.View style={[styles.gradientWrapper, { opacity: loading ? pulseAnim : 1 }]}>
        <LinearGradient
          colors={showGrayBg ? [colors.surface, colors.surface] : ['#943CFF', '#2938DC']}
          locations={[0.246, 1]}
          start={{ x: 1, y: 0.5 }}
          end={{ x: 0, y: 0.5 }}
          style={styles.gradient}
        >
          {loading ? (
            <>
              <Text style={styles.text}>Creating...</Text>
              <ActivityIndicator color={colors.textPrimary} size="small" />
            </>
          ) : (
            <>
              <Text style={[styles.text, showGrayBg && styles.textDisabled]}>Create</Text>
              <Image source={starsIcon} style={[styles.icon, showGrayBg && styles.iconDisabled]} />
            </>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    // Figma: cornerRadius 50, height 56
    borderRadius: radius(50),
    height: height(56),
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gradientWrapper: {
    flex: 1,
  },
  gradient: {
    // Figma: padding 24 horizontal, 12 vertical, itemSpacing 8
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sp(12),
    paddingHorizontal: sp(24),
    gap: sp(8),
  },
  text: {
    // Figma: fontSize 17, lineHeight 22, ExtraBold, letterSpacing -0.17
    fontSize: fs(17),
    lineHeight: lh(22),
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
    letterSpacing: fs(-0.17),
  },
  textDisabled: {
    color: colors.textMuted,
  },
  icon: {
    // Figma: stars icon 20x20
    width: icon(20),
    height: icon(20),
    resizeMode: 'contain',
  },
  iconDisabled: {
    opacity: 0.5,
  },
});
