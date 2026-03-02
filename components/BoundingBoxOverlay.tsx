import type { BoundingBox } from '@/types/detection';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

type Props = {
  bbox: BoundingBox | null;
  width: number;
  height: number;
  label?: string;
  confidence?: number;
};

/**
 * BoundingBoxOverlay component
 * Draws a live bounding box around detected objects using React Native Animated Views
 */
export default function BoundingBoxOverlay({ bbox, width, height, label = 'Car', confidence }: Props) {
  // Animated pulse effect for the bounding box
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (bbox) {
      // Create a subtle pulse animation
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repeat
        false
      );
    } else {
      pulseOpacity.value = 1;
    }
  }, [bbox]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (!bbox) {
    return null;
  }

  const { x, y, width: boxWidth, height: boxHeight } = bbox;

  // Ensure bounding box is within canvas bounds
  const clampedX = Math.max(0, Math.min(x, width - boxWidth));
  const clampedY = Math.max(0, Math.min(y, height - boxHeight));
  const clampedWidth = Math.min(boxWidth, width - clampedX);
  const clampedHeight = Math.min(boxHeight, height - clampedY);

  const strokeWidth = 3;
  const cornerLength = 20;

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <Animated.View
        style={[
          styles.boundingBox,
          {
            left: clampedX,
            top: clampedY,
            width: clampedWidth,
            height: clampedHeight,
            borderWidth: strokeWidth,
          },
          animatedStyle,
        ]}
      >
        {/* Corner accents */}
        {/* Top-left */}
        <View style={[styles.cornerH, styles.cornerTL, { width: cornerLength, height: strokeWidth }]} />
        <View style={[styles.cornerV, styles.cornerTL, { width: strokeWidth, height: cornerLength }]} />

        {/* Top-right */}
        <View style={[styles.cornerH, styles.cornerTR, { width: cornerLength, height: strokeWidth }]} />
        <View style={[styles.cornerV, styles.cornerTR, { width: strokeWidth, height: cornerLength }]} />

        {/* Bottom-left */}
        <View style={[styles.cornerH, styles.cornerBL, { width: cornerLength, height: strokeWidth }]} />
        <View style={[styles.cornerV, styles.cornerBL, { width: strokeWidth, height: cornerLength }]} />

        {/* Bottom-right */}
        <View style={[styles.cornerH, styles.cornerBR, { width: cornerLength, height: strokeWidth }]} />
        <View style={[styles.cornerV, styles.cornerBR, { width: strokeWidth, height: cornerLength }]} />

        {/* Label */}
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>
            {label} {confidence ? `${Math.round(confidence * 100)}%` : ''}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  boundingBox: {
    position: 'absolute',
    borderColor: '#60A5FA',
    borderRadius: 8,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
  },
  cornerH: {
    position: 'absolute',
    backgroundColor: '#60A5FA',
  },
  cornerV: {
    position: 'absolute',
    backgroundColor: '#60A5FA',
  },
  cornerTL: {
    top: -1.5,
    left: -1.5,
  },
  cornerTR: {
    top: -1.5,
    right: -1.5,
  },
  cornerBL: {
    bottom: -1.5,
    left: -1.5,
  },
  cornerBR: {
    bottom: -1.5,
    right: -1.5,
  },
  labelContainer: {
    position: 'absolute',
    top: -32,
    left: 0,
    backgroundColor: '#60A5FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

