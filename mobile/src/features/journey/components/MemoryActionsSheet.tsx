import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Star, Pin, Trash2, X } from 'lucide-react-native';

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
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-3xl p-6 pb-10">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold">Memory Actions</Text>
                <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                  <X size={20} color="#374151" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                className="flex-row items-center p-4 mb-2 bg-gray-50 rounded-xl"
                onPress={() => { onToggleFavorite(); onClose(); }}
              >
                <Star size={24} color={isFavorite ? "#EF4444" : "#4B5563"} fill={isFavorite ? "#EF4444" : "transparent"} />
                <Text className="text-base ml-3 font-medium text-gray-700">
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center p-4 mb-2 bg-gray-50 rounded-xl"
                onPress={() => { onTogglePin(); onClose(); }}
              >
                <Pin size={24} color={isPinned ? "#2563EB" : "#4B5563"} />
                <Text className="text-base ml-3 font-medium text-gray-700">
                  {isPinned ? 'Unpin from Top' : 'Pin to Top'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center p-4 bg-red-50 rounded-xl mt-4"
                onPress={() => { onDelete(); onClose(); }}
              >
                <Trash2 size={24} color="#EF4444" />
                <Text className="text-base ml-3 font-medium text-red-600">Delete Memory</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
