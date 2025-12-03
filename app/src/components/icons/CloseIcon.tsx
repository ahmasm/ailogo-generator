import React from 'react';
import { View, StyleSheet } from 'react-native';
import { s, icon } from '../../utils/scale';

interface CloseIconProps {
  size?: number;
  color?: string;
}

/**
 * Close (X) icon component
 * Default size: 20, color: #FAFAFA
 */
export function CloseIcon({ size = 20, color = '#FAFAFA' }: CloseIconProps) {
  const iconSize = icon(size);
  const lineWidth = s(size * 0.6875); // 13.75/20 ratio
  const lineHeight = s(size * 0.1); // 2/20 ratio

  return (
    <View
      style={[styles.container, { width: iconSize, height: iconSize }]}
      accessible={false}
    >
      <View
        style={[
          styles.line,
          {
            width: lineWidth,
            height: lineHeight,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
      <View
        style={[
          styles.line,
          {
            width: lineWidth,
            height: lineHeight,
            backgroundColor: color,
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    borderRadius: 1,
  },
});
