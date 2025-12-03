import React from 'react';
import { View, Text, ScrollView, StyleSheet, ImageSourcePropType } from 'react-native';
import { StyleCard } from './StyleCard';
import { colors, fontFamily } from '../constants/theme';
import { fs, sp, lh } from '../utils/scale';
import type { LogoStyle } from '../types';

// Style images
const styleImages = {
  'no-style': require('../../assets/nostyle.png'),
  'monogram': require('../../assets/monogram.png'),
  'abstract': require('../../assets/abstract.png'),
  'mascot': require('../../assets/mascot.png'),
};

interface StyleOption {
  style: LogoStyle;
  label: string;
  image: ImageSourcePropType;
}

const STYLE_OPTIONS: StyleOption[] = [
  { style: 'no-style', label: 'No Style', image: styleImages['no-style'] },
  { style: 'monogram', label: 'Monogram', image: styleImages['monogram'] },
  { style: 'abstract', label: 'Abstract', image: styleImages['abstract'] },
  { style: 'mascot', label: 'Mascot', image: styleImages['mascot'] },
];

interface StyleSelectorProps {
  selectedStyle: LogoStyle;
  onSelectStyle: (style: LogoStyle) => void;
}

export function StyleSelector({ selectedStyle, onSelectStyle }: StyleSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logo Styles</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STYLE_OPTIONS.map((option) => (
          <StyleCard
            key={option.style}
            style={option.style}
            label={option.label}
            image={option.image}
            isSelected={selectedStyle === option.style}
            onPress={() => onSelectStyle(option.style)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: sp(12), // Figma: itemSpacing between header and carousel
    paddingBottom: sp(12), // Figma: paddingBottom 12
  },
  title: {
    // Figma: fontSize 20, lineHeight 25, ExtraBold
    fontSize: fs(20),
    lineHeight: lh(25),
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
  },
  scrollContent: {
    gap: sp(12), // Figma: itemSpacing 12 between cards
  },
});
