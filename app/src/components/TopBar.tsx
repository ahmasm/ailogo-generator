import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily } from '../constants/theme';
import { fs, sp, lh, height } from '../utils/scale';

export function TopBar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Logo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Figma: height 60, paddingTop/Bottom 12
    height: height(60),
    paddingTop: sp(12),
    paddingBottom: sp(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    // Figma: Manrope-ExtraBold, 17px, letterSpacing -0.17, lineHeight 22
    fontSize: fs(17),
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
    letterSpacing: fs(-0.17),
    lineHeight: lh(22),
  },
});
