import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DeviceMotion } from 'expo-sensors';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  compass: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    backgroundColor: 'white',
  },
});

export default memo(({ onHeadingChange }) => {
  const [heading, setHeading] = useState(0);

  const onHeadingChanged = useCallback(
    (h) => {
      h = Math.round(h);
      setHeading(h);
      onHeadingChange(h);
    },
    [onHeadingChange]
  );

  useFocusEffect(
    useCallback(() => {
      let headingSub;

      const watchCompass = async () => {
        const { status } = await DeviceMotion.requestPermissionsAsync();
        if ('granted' !== status) return;

        headingSub = DeviceMotion.addListener(({ rotation }) => {
          if (null == rotation?.alpha) return;
          let az = -(rotation.alpha * 57.29577951308232) % 360;
          if (0 > az) az += 360;
          onHeadingChanged(az, 2);
        });
      };

      watchCompass();

      return () => {
        headingSub?.remove();
      };
    }, [onHeadingChanged])
  );

  return (
    <View style={styles.container}>
      <Compass heading={heading} />
    </View>
  );
});

const Compass = ({ heading }) => {
  const rotation = useRef(new Animated.Value(heading));
  const prev = useRef(0);

  const rotate = useCallback((angle) => {
    const leap = 90 < Math.abs(angle - prev.current);
    prev.current = angle;
    const duration = leap ? 0 : 100;
    rotation.current.stopAnimation();
    Animated.timing(rotation.current, {
      toValue: angle,
      duration,
      isInteraction: false,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    rotate(heading);
  }, [heading, rotate]);

  const transform = [
    {
      rotate: rotation.current.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '-360deg'],
      }),
    },
  ];

  return (
    <Animated.View style={[styles.compass, { transform }]}>
      <Svg viewBox="0 0 100 100" fill="black">
        <Path d="M50.03 5a2.516 2.516 0 00-2.43 1.76L34.493 48.548a2.51 2.51 0 00-.372 1.454c-.026.51.104 1.017.372 1.452l13.105 41.782c.737 2.352 4.065 2.352 4.802 0l13.105-41.785c.27-.436.399-.945.372-1.456a2.513 2.513 0 00-.372-1.45L52.401 6.76A2.513 2.513 0 0050.03 5zM39.403 50.288h6.205c.152 2.306 2.048 4.134 4.392 4.134 2.344 0 4.24-1.828 4.392-4.134h6.461L50 84.078z" />
      </Svg>
    </Animated.View>
  );
};
