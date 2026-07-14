import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';

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
              <TouchableOpacity
                key={range.value}
                onPress={() => onSelectRange(range.value)}
                className={`px-4 py-2 rounded-full mr-2 ${isSelected ? 'bg-blue-600' : 'bg-gray-100'}`}
              >
                <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export const DateRangeSelector = FilterBar; // Alias if needed
