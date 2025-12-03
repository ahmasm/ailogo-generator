import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageSourcePropType } from 'react-native';
import { colors, fontFamily } from '../constants/theme';
import { fs, sp, lh, radius, s } from '../utils/scale';
import type { LogoStyle } from '../types';

interface StyleCardProps {
  style: LogoStyle;
  label: string;
  image?: ImageSourcePropType;
  isSelected: boolean;
  onPress: () => void;
}

export function StyleCard({ style, label, image, isSelected, onPress }: StyleCardProps) {
  const isNoStyle = style === 'no-style';

  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${label} style${isSelected ? ', selected' : ''}`}
      accessibilityState={{ selected: isSelected }}
      accessibilityHint={isSelected ? 'Currently selected style' : `Double tap to select ${label} style`}
    >
      <View style={[styles.imageContainer, isSelected && styles.imageContainerSelected]}>
        {image ? (
          <>
            <Image
              source={image}
              style={[styles.image, isNoStyle && styles.imageNoStyle]}
            />
            {isNoStyle && (
              <View style={styles.noStyleOverlay}>
                <View style={styles.slashIconContainer}>
                  {/* Circle with diagonal line - prohibited sign */}
                  <View style={styles.slashCircle} />
                  <View style={styles.slashLine} />
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>{label[0]}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelUnselected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: sp(6), // Figma: itemSpacing 6 between image and caption
  },
  imageContainer: {
    // Figma: 90x90, cornerRadius 16
    width: s(90),
    height: s(90),
    borderRadius: radius(16),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  imageContainerSelected: {
    // Figma: stroke 2px solid #FAFAFA
    borderColor: colors.textPrimary,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageNoStyle: {
    // Scale up to hide white border in PNG (overflow: hidden clips it)
    transform: [{ scale: 1.08 }],
  },
  noStyleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slashIconContainer: {
    // Figma: 40x40
    width: s(40),
    height: s(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  slashCircle: {
    // Figma: 83.33% of 40 = 33.33, border 2.7px - single circle
    position: 'absolute',
    width: s(33),
    height: s(33),
    borderRadius: s(17),
    borderWidth: s(2.7),
    borderColor: '#FAFAFA',
  },
  slashLine: {
    // Diagonal line through the circle
    position: 'absolute',
    width: s(33),
    height: s(2.7),
    backgroundColor: '#FAFAFA',
    transform: [{ rotate: '-45deg' }],
  },
  placeholderImage: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: fs(24),
    fontFamily: fontFamily.bold,
    color: colors.textMuted,
  },
  label: {
    // Figma: fontSize 13, lineHeight 18
    fontSize: fs(13),
    lineHeight: lh(18),
    textAlign: 'center',
  },
  labelSelected: {
    // Figma: Bold, #FAFAFA, letterSpacing -0.13 when selected
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    letterSpacing: fs(-0.13),
  },
  labelUnselected: {
    // Figma: Regular, #71717A when unselected
    fontFamily: fontFamily.regular,
    color: colors.textMuted,
  },
});
