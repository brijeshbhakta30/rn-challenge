import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

export default function Spinner({ height }: { height: number }) {
  const width = height;
  const maskHeight = width / 2;
  const layoutStyle = { width, height, borderRadius: maskHeight };
  const borderWidth = { borderWidth: height / 10 };
  const rotation = useRef(new Animated.Value(0));
  const rotate = rotation.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation.current, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      { resetBeforeIteration: true, iterations: Number.MAX_SAFE_INTEGER },
    );
    animation.start();
    return () => {
      animation.stop();
    };
  }, [rotation.current]);

  return (
    <View>
      <View style={[styles.backgroundCircle, borderWidth, layoutStyle]} />
      <Animated.View
        style={[
          styles.maskContainer,
          layoutStyle,
          { transform: [{ rotate }] },
        ]}>
        <View style={[styles.mask, { width: maskHeight, height: maskHeight }]}>
          <View style={[styles.circle, borderWidth, layoutStyle]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderColor: '#000000',
  },
  backgroundCircle: {
    borderColor: 'transparent',
  },
  mask: {
    position: 'absolute',
    overflow: 'hidden',
  },
  maskContainer: {
    position: 'absolute',
  },
});
