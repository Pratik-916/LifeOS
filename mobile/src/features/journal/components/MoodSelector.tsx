import React from 'react';
import { View, ScrollView } from 'react-native';
import { Label, HeadingMD, Caption, Card } from '../../../design-system';

interface MoodSelectorProps {
  value: string;
  onChange: (mood: string) => void;
}

const MOODS = [
  { label: 'Happy', value: 'happy', emoji: '😀' },
  { label: 'Good', value: 'good', emoji: '🙂' },
  { label: 'Neutral', value: 'neutral', emoji: '😐' },
  { label: 'Sad', value: 'sad', emoji: '😔' },
  { label: 'Very Sad', value: 'very-sad', emoji: '😢' },
];

export const MoodSelector = ({ value, onChange }: MoodSelectorProps) => {
  return (
    <View className="mb-4">
      <Label className="mb-2">How are you feeling?</Label>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {MOODS.map((mood) => {
          const isSelected = value === mood.value;
          return (
            <Card
              key={mood.value}
              onPress={() => onChange(mood.value)}
              className={`items-center justify-center mr-3 p-3 rounded-2xl border ${
                isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
              }`}
              style={{ width: 72 }}
            >
              <HeadingMD className="text-2xl mb-1">{mood.emoji}</HeadingMD>
              <Caption className={`text-center ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>
                {mood.label}
              </Caption>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};
