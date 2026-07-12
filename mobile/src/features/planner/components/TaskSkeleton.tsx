import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const TaskSkeleton: React.FC = () => {
  const [animatedValue] = React.useState(() => new Animated.Value(0.3));

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  return (
    <Animated.View style={[styles.container, { opacity: animatedValue }]}>
      <View style={styles.headerRow}>
        <View style={styles.circle} />
        <View style={styles.titleLine} />
      </View>
      <View style={styles.subtitleLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  titleLine: {
    height: 16,
    width: '60%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  subtitleLine: {
    height: 12,
    width: '40%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginLeft: 32,
  }
});
