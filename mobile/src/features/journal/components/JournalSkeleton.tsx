import React, { useEffect, useMemo } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';

export const JournalSkeleton = () => {
  const animatedValue = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View className="px-4">
      {[1, 2, 3].map((key) => (
        <Card key={key} className="p-4 mb-3 flex-row justify-between">
          <View className="flex-1 mr-4">
            <Animated.View style={[{ opacity }, styles.line1]} />
            <Animated.View style={[{ opacity }, styles.line2]} />
            <Animated.View style={[{ opacity }, styles.line3]} />
          </View>
          <Animated.View style={[{ opacity }, styles.circle]} />
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  line1: {
    height: 18,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 8,
    width: '60%',
  },
  line2: {
    height: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  line3: {
    height: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    width: '40%',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  }
});
