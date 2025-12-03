import React from 'react';
import { View, StyleSheet } from 'react-native';
import { icon } from '../../utils/scale';

interface CopyIconProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

/**
 * Copy icon component (two overlapping rectangles)
 * Default size: 16, color: #A1A1AA, backgroundColor: #27272A
 */
export function CopyIcon({
  size = 16,
  color = '#A1A1AA',
  backgroundColor = '#27272A',
}: CopyIconProps) {
  const iconSize = icon(size);

  return (
    <View
      style={[styles.container, { width: iconSize, height: iconSize }]}
      accessible={false}
    >
      <View style={[styles.back, { borderColor: color }]} />
      <View style={[styles.front, { borderColor: color, backgroundColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  back: {
    position: 'absolute',
    left: '8.33%',
    right: '33.33%',
    top: '33.33%',
    bottom: '8.33%',
    borderWidth: 1,
    borderRadius: 2,
  },
  front: {
    position: 'absolute',
    left: '33.33%',
    right: '8.33%',
    top: '8.33%',
    bottom: '33.33%',
    borderWidth: 1,
    borderRadius: 2,
  },
});
