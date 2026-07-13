import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const HabitSkeleton: React.FC = () => {
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
        <View style={{ flex: 1 }}>
          <View style={styles.titleLine} />
          <View style={styles.subtitleLine} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
  },
  titleLine: {
    height: 16,
    width: '50%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitleLine: {
    height: 12,
    width: '30%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  }
});
