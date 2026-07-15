import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton, ListCard } from '../../../design-system';

export const HabitSkeleton: React.FC = () => {
  return (
    <ListCard className="mb-3 border border-secondary-100 dark:border-secondary-900" style={{ padding: 16, borderRadius: 16 }}>
      <View style={styles.headerRow}>
        <Skeleton variant="circular" width={40} height={40} className="mr-4" />
        <View style={{ flex: 1 }}>
          <Skeleton variant="text" width="50%" height={16} className="mb-2" />
          <Skeleton variant="text" width="30%" height={12} />
        </View>
      </View>
    </ListCard>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
