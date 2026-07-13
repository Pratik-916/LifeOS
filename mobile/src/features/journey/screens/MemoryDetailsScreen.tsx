import React, { useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList, MemoryDetailsRouteProp } from '../../../navigation/types';
import { useMemory, useJourneyMutations } from '../hooks';
import { Typography } from '../../../components/ui/Typography';
import { ArrowLeft, Edit2, Trash2, Heart, Pin, Calendar, MapPin, Share } from 'lucide-react-native';
import { CategoryChip } from '../components/JourneyBadges';
import { format, parseISO } from 'date-fns';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const MemoryDetailsScreen = () => {
  const route = useRoute<MemoryDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { id } = route.params;

  const { data: memory, isLoading } = useMemory(id);
  const { deleteMemory, favoriteMemory, pinMemory, isDeleting } = useJourneyMutations();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleEdit = useCallback(() => {
    navigation.navigate('MemoryEditor', { id });
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory? It will be moved to the archive.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteMemory(id);
            navigation.goBack();
          }
        }
      ]
    );
  }, [deleteMemory, id, navigation]);

  if (isLoading || !memory) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="h-14 flex-row items-center px-4 border-b border-slate-100">
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>
        <View className="p-6">
          <View className="h-8 w-3/4 bg-slate-200 rounded animate-pulse mb-4" />
          <View className="h-4 w-1/2 bg-slate-200 rounded animate-pulse mb-8" />
          <View className="h-4 w-full bg-slate-200 rounded animate-pulse mb-2" />
          <View className="h-4 w-full bg-slate-200 rounded animate-pulse mb-2" />
          <View className="h-4 w-4/5 bg-slate-200 rounded animate-pulse" />
        </View>
      </SafeAreaView>
    );
  }

  const primaryImage = memory.images && memory.images.length > 0 ? memory.images[0].image : null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="h-14 flex-row items-center justify-between px-4 z-10 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View className="flex-row">
          <TouchableOpacity onPress={() => pinMemory(id)} className="p-2">
            <Pin size={20} color={memory.pinned ? '#D97706' : '#64748B'} fill={memory.pinned ? '#D97706' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => favoriteMemory(id)} className="p-2">
            <Heart size={20} color={memory.favorite ? '#E11D48' : '#64748B'} fill={memory.favorite ? '#E11D48' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} className="p-2">
            <Edit2 size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {primaryImage && (
          <Image 
            source={{ uri: primaryImage }} 
            className="w-full h-72 bg-slate-200"
            resizeMode="cover"
          />
        )}
        
        <View className="p-6">
          <View className="flex-row flex-wrap items-center gap-2 mb-4">
            <CategoryChip category={memory.category} />
            {memory.visibility === 'shared' || memory.visibility === 'public' ? (
              <View className="flex-row items-center px-2 py-1 bg-slate-100 rounded-full">
                <Share size={12} color="#64748B" />
                <Typography variant="caption" className="text-slate-600 ml-1">
                  {memory.visibility}
                </Typography>
              </View>
            ) : null}
          </View>
          
          <Typography variant="h1" className="text-3xl text-slate-900 font-bold mb-4 leading-9">
            {memory.title}
          </Typography>

          <View className="flex-row flex-wrap gap-4 mb-8">
            <View className="flex-row items-center">
              <Calendar size={16} color="#64748B" />
              <Typography variant="body" className="text-slate-600 ml-2 font-medium">
                {format(parseISO(memory.date), 'MMMM d, yyyy')}
              </Typography>
            </View>
            
            {memory.location ? (
              <View className="flex-row items-center">
                <MapPin size={16} color="#64748B" />
                <Typography variant="body" className="text-slate-600 ml-2 font-medium">
                  {memory.location}
                </Typography>
              </View>
            ) : null}
          </View>

          {memory.description ? (
            <Typography variant="body" className="text-slate-700 text-lg leading-8 mb-8">
              {memory.description}
            </Typography>
          ) : null}

          {/* Additional Images Gallery could go here */}

          <View className="border-t border-slate-100 pt-6 mt-4 flex-row justify-between items-center">
            <View>
              <Typography variant="caption" className="text-slate-400">
                Created: {format(parseISO(memory.createdAt), 'MMM d, yyyy')}
              </Typography>
              <Typography variant="caption" className="text-slate-400">
                Last updated: {format(parseISO(memory.updatedAt), 'MMM d, yyyy')}
              </Typography>
            </View>
            
            <TouchableOpacity 
              onPress={handleDelete}
              disabled={isDeleting}
              className="p-3 bg-rose-50 rounded-full"
            >
              <Trash2 size={20} color="#E11D48" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
