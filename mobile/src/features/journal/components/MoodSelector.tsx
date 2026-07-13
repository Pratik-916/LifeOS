import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../../components/ui/Typography';

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
      <Typography variant="label" className="mb-2">How are you feeling?</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {MOODS.map((mood) => {
          const isSelected = value === mood.value;
          return (
            <TouchableOpacity
              key={mood.value}
              onPress={() => onChange(mood.value)}
              activeOpacity={0.7}
              className={`items-center justify-center mr-3 p-3 rounded-2xl border ${
                isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
              }`}
              style={{ width: 72 }}
            >
              <Typography className="text-2xl mb-1">{mood.emoji}</Typography>
              <Typography variant="caption" className={`text-center ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>
                {mood.label}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
