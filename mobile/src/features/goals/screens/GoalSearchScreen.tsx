/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MainStackParamList } from '../../../navigation/types';
import { useGoals } from '../hooks/useGoals';
import { GoalCard } from '../components/GoalCard';
import { BodyMD, Icon } from '../../../design-system';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const GoalSearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useGoals(debouncedTerm ? { search: debouncedTerm } : { search: '---none---' });
  const goals = debouncedTerm ? (data?.results || []) : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderItem = useCallback(({ item }: any) => (
    <GoalCard
      goal={item}
      onPress={() => navigation.navigate('GoalDetails', { id: item.id })}
    />
  ), [navigation]);

  const renderEmpty = useCallback(() => (
    debouncedTerm.length > 0 && !isLoading ? (
      <View className="flex-1 items-center justify-center pt-20">
        <BodyMD className="text-slate-500">No results found for "{debouncedTerm}"</BodyMD>
      </View>
    ) : null
  ), [debouncedTerm, isLoading]);

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2 mr-2">
          <Icon name="ArrowLeft" size={24} color="#0F172A" />
        </TouchableOpacity>
        
        <View className="flex-1 flex-row items-center bg-slate-100 rounded-full px-3 h-10">
          <Icon name="Search" size={18} color="#94A3B8" />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search goals..."
            className="flex-1 ml-2 text-text-light dark:text-text-dark font-medium"
            placeholderTextColor="#94A3B8"
            autoFocus
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Icon name="X" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};
