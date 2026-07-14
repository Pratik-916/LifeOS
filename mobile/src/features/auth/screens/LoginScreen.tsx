import React from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/useAuthStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Typography } from '../../../components/ui/Typography';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/AuthStack';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const setTokens = useAuthStore((state) => state.setTokens);
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      // For compatibility, pass email as username or just map it on backend
      const response = await apiClient.post('/api/v1/auth/login/', {
        email: data.email,
        password: data.password
      });
      return response.data;
    },
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white justify-center px-6"
    >
      <View className="mb-8">
        <Typography variant="h1" className="mb-2 text-blue-600">LifeOS</Typography>
        <Typography variant="body" className="text-gray-500">Sign in to your account</Typography>
      </View>

      {mutation.isError && (
        <View className="bg-red-50 p-3 rounded-lg mb-4 border border-red-100">
          <Typography variant="caption" className="text-red-600">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(mutation.error as unknown as any).response?.data?.message || mutation.error.message || 'Login failed. Please try again.'}
          </Typography>
        </View>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email or Username"
            placeholder="Enter your email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            placeholder="Enter your password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
            secureTextEntry
          />
        )}
      />

      <Button 
        title="Sign In" 
        className="mt-4"
        onPress={handleSubmit(onSubmit)} 
        isLoading={mutation.isPending}
      />

      <View className="mt-6 flex-row justify-center">
        <Typography variant="body" className="text-gray-500">Don't have an account? </Typography>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Typography variant="body" className="text-blue-600 font-bold">Sign Up</Typography>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
