import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, fontFamily } from '../constants/theme';
import { fs, sp, lh, radius, height, icon } from '../utils/scale';

const MAX_CHARS = 500;

const SURPRISE_PROMPTS = [
  "A blue lion logo reading 'HEXA' in bold letters",
  "Minimalist mountain logo for outdoor brand",
  "Abstract geometric logo for tech startup",
  "Vintage coffee shop emblem with steam",
  "Modern fitness logo with dynamic movement",
];

interface PromptInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function PromptInput({ value, onChangeText }: PromptInputProps) {
  const charCount = value.length;

  const handleSurpriseMe = () => {
    const randomPrompt = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    onChangeText(randomPrompt);
  };

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">Enter Your Prompt</Text>
        <Pressable
          onPress={handleSurpriseMe}
          style={styles.surpriseButton}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Surprise me"
          accessibilityHint="Fills in a random example prompt"
        >
          <Text style={styles.surpriseEmoji} accessibilityElementsHidden>🎲</Text>
          <Text style={styles.surpriseText}>Surprise me</Text>
        </Pressable>
      </View>

      {/* Text Area - Figma: background blur 15, gradient overlay 5% */}
      <View style={styles.inputWrapper}>
        <BlurView intensity={15} style={styles.blurContainer}>
          <LinearGradient
            colors={['rgba(148, 62, 255, 0.05)', 'rgba(41, 56, 220, 0.05)']}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
            style={styles.gradientOverlay}
          />
        </BlurView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="A blue lion logo reading 'HEXA' in bold letters"
            placeholderTextColor={colors.textMuted}
            value={value}
            onChangeText={(text) => {
              if (text.length <= MAX_CHARS) {
                onChangeText(text);
              }
            }}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Logo prompt"
            accessibilityHint={`Enter a description for your logo. ${MAX_CHARS - charCount} characters remaining.`}
          />
          <View style={styles.footer}>
            <Text
              style={styles.charCount}
              accessibilityLabel={`${charCount} of ${MAX_CHARS} characters used`}
            >
              {charCount}/{MAX_CHARS}
            </Text>
            <Pressable
              onPress={handleClear}
              style={[styles.clearButton, charCount > 0 && styles.clearButtonVisible]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Clear prompt"
              accessibilityHint="Removes all text from the prompt"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.clearText} accessibilityElementsHidden>✕</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: sp(12), // Figma: itemSpacing between header and box
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    // Figma: fontSize 20, lineHeight 25, ExtraBold
    fontSize: fs(20),
    lineHeight: lh(25),
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
  },
  surpriseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sp(8), // Figma: itemSpacing 8
  },
  surpriseEmoji: {
    fontSize: fs(13),
    lineHeight: lh(18),
  },
  surpriseText: {
    // Figma: fontSize 13, lineHeight 18, Regular
    fontSize: fs(13),
    lineHeight: lh(18),
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
  inputWrapper: {
    // Figma: cornerRadius 16, height 175
    borderRadius: radius(16),
    height: height(175),
    overflow: 'hidden',
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  inputContainer: {
    // Figma: padding 12 all sides, backgroundColor #272729
    flex: 1,
    backgroundColor: colors.surface,
    padding: sp(12),
    justifyContent: 'space-between',
  },
  textInput: {
    // Figma: fontSize 16, lineHeight 21, Regular
    flex: 1,
    fontSize: fs(16),
    lineHeight: lh(21),
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    // Figma: fontSize 11, lineHeight 13, color #71717A
    fontSize: fs(11),
    lineHeight: lh(13),
    fontFamily: fontFamily.regular,
    color: colors.textMuted,
  },
  clearButton: {
    width: icon(20),
    height: icon(20),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0, // Hidden by default (Figma shows opacity 0)
  },
  clearButtonVisible: {
    opacity: 1,
  },
  clearText: {
    fontSize: fs(13),
    color: colors.textPrimary,
  },
});
