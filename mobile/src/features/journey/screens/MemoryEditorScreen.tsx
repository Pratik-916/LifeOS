import React, { useEffect } from 'react';
import { View, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useJourneyMutations } from '../hooks/useJourneyMutations';
import { useMemory } from '../hooks/useMemory';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Image as ImageIcon } from 'lucide-react-native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  favorite: z.boolean().optional(),
  pinned: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const DRAFT_KEY = '@journey_memory_draft';

export const MemoryEditorScreen = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'MemoryEditor'>>();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const { id } = route.params || {};
  
  const { data: memory } = useMemory(id || '', !!id);
  const { createMemory, updateMemory } = useJourneyMutations();

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      location: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      favorite: false,
      pinned: false,
    },
  });

  useEffect(() => {
    if (memory) {
      reset({
        title: memory.title,
        description: memory.description,
        category: memory.category,
        location: memory.location,
        date: memory.date ? memory.date.split('T')[0] : format(new Date(), 'yyyy-MM-dd'),
        favorite: memory.favorite,
        pinned: memory.pinned,
      });
    } else if (!id) {
      // Load draft only for new memory
      AsyncStorage.getItem(DRAFT_KEY).then((draft) => {
        if (draft) {
          try {
            reset(JSON.parse(draft));
          } catch (e) {
            console.error('Error parsing draft', e);
          }
        }
      });
    }
  }, [memory, reset, id]);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/incompatible-library
      const subscription = watch((value) => {
        const handler = setTimeout(() => {
          AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(value));
        }, 1000);
        return () => clearTimeout(handler);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, id]);

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    };

    if (id) {
      updateMemory.mutate({ id, payload }, {
        onSuccess: () => {
          navigation.goBack();
        }
      });
    } else {
      createMemory.mutate(payload, {
        onSuccess: () => {
          AsyncStorage.removeItem(DRAFT_KEY);
          navigation.goBack();
        }
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16 }}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Title"
            placeholder="A memorable day..."
            value={value}
            onChangeText={onChange}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Description"
            placeholder="Write down the details..."
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        )}
      />

      <View className="flex-row justify-between mb-4 mt-2">
        <View className="flex-1 mr-2">
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Category"
                placeholder="E.g., Travel, Work"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        <View className="flex-1 ml-2">
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Location"
                placeholder="E.g., Paris"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Date (YYYY-MM-DD)"
            placeholder="YYYY-MM-DD"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Card className="mb-6 mt-2">
        <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
          <Typography variant="body" className="font-medium text-gray-700">Favorite</Typography>
          <Controller
            control={control}
            name="favorite"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
        </View>
        <View className="flex-row items-center justify-between py-2">
          <Typography variant="body" className="font-medium text-gray-700">Pin to Top</Typography>
          <Controller
            control={control}
            name="pinned"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
        </View>
      </Card>

      <View className="mb-8">
        <Typography variant="h3" className="mb-2">Images</Typography>
        <TouchableOpacity className="bg-gray-100 h-32 rounded-xl items-center justify-center border-2 border-dashed border-gray-300">
          <ImageIcon size={32} color="#9CA3AF" />
          <Typography variant="caption" className="mt-2 text-gray-500">Tap to add images (Placeholder)</Typography>
        </TouchableOpacity>
      </View>

      <Button
        title={id ? "Update Memory" : "Save Memory"}
        onPress={handleSubmit(onSubmit)}
        className="mb-10"
      />
    </ScrollView>
  );
};
