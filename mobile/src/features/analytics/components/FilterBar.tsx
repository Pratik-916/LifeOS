import React from 'react';
import { View, ScrollView } from 'react-native';
import { FilterChip } from '../../../design-system';

const RANGES = [
  { label: 'Today', value: 'today' },
  { label: '7 Days', value: '7_days' },
  { label: '30 Days', value: '30_days' },
  { label: '90 Days', value: '90_days' },
];

interface FilterBarProps {
  selectedRange: string;
  onSelectRange: (range: string) => void;
}

export const FilterBar = ({ selectedRange, onSelectRange }: FilterBarProps) => {
  return (
    <View className="mb-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row px-4">
          {RANGES.map((range) => {
            const isSelected = selectedRange === range.value;
            return (
              <FilterChip
                key={range.value}
                label={range.label}
                selected={isSelected}
                onPress={() => onSelectRange(range.value)}
                className="mr-2"
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export const DateRangeSelector = FilterBar; // Alias if needed
