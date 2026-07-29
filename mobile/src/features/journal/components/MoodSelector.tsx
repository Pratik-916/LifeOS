import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { BodyMD } from '../../../design-system';

interface MoodSelectorProps {
  value: string;
  onChange: (mood: string) => void;
}

const MOODS = [
  { label: 'Great', value: 'great', emoji: '😊' },
  { label: 'Good', value: 'good', emoji: '🙂' },
  { label: 'Okay', value: 'okay', emoji: '😐' },
  { label: 'Difficult', value: 'difficult', emoji: '😔' },
  { label: 'Exhausted', value: 'exhausted', emoji: '😴' },
];

export const MoodSelector = ({ value, onChange }: MoodSelectorProps) => {
  return (
    <View className="mb-8 px-2">
      <BodyMD className="text-slate-800 font-bold mb-4">How did today feel?</BodyMD>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {MOODS.map((mood) => {
          const isSelected = value === mood.value;
          return (
            <Pressable
              key={mood.value}
              onPress={() => onChange(mood.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              className={`flex-row items-center justify-center mr-2 px-4 py-3 rounded-full border ${
                isSelected 
                  ? 'border-indigo-200 bg-indigo-50' 
                  : 'border-slate-200 bg-white'
              }`}
            >
              <BodyMD className="mr-2 text-lg">{mood.emoji}</BodyMD>
              <BodyMD className={`${isSelected ? 'text-indigo-900 font-medium' : 'text-slate-600'}`}>
                {mood.label}
              </BodyMD>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
