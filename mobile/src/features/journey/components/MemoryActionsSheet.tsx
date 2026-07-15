import React from 'react';
import { View, Pressable } from 'react-native';
import { BottomSheet, HeadingMD, BodyMD, Icon } from '../../../design-system';

interface MemoryActionsSheetProps {
  visible: boolean;
  onClose: () => void;
  isFavorite: boolean;
  isPinned: boolean;
  onToggleFavorite: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

export const MemoryActionsSheet = ({
  visible,
  onClose,
  isFavorite,
  isPinned,
  onToggleFavorite,
  onTogglePin,
  onDelete,
}: MemoryActionsSheetProps) => {
  if (!visible) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose} height={350}>
      <View className="flex-row justify-between items-center mb-6">
        <HeadingMD>Memory Actions</HeadingMD>
        <Pressable onPress={onClose} className="p-2 bg-surface-light dark:bg-surface-dark rounded-full">
          <Icon name="X" size={20} color="#374151" />
        </Pressable>
      </View>

      <Pressable 
        className="flex-row items-center p-4 mb-2 bg-surface-light dark:bg-surface-dark rounded-xl"
        onPress={() => { onToggleFavorite(); onClose(); }}
      >
        <Icon name="Star" size={24} color={isFavorite ? "#EF4444" : "#4B5563"} />
        <BodyMD className="ml-3 font-medium text-gray-700">
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </BodyMD>
      </Pressable>

      <Pressable 
        className="flex-row items-center p-4 mb-2 bg-surface-light dark:bg-surface-dark rounded-xl"
        onPress={() => { onTogglePin(); onClose(); }}
      >
        <Icon name="Pin" size={24} color={isPinned ? "#2563EB" : "#4B5563"} />
        <BodyMD className="ml-3 font-medium text-gray-700">
          {isPinned ? 'Unpin from Top' : 'Pin to Top'}
        </BodyMD>
      </Pressable>

      <Pressable 
        className="flex-row items-center p-4 bg-red-50 rounded-xl mt-4"
        onPress={() => { onDelete(); onClose(); }}
      >
        <Icon name="Trash2" size={24} color="#EF4444" />
        <BodyMD className="ml-3 font-medium text-red-600">Delete Memory</BodyMD>
      </Pressable>
    </BottomSheet>
  );
};
