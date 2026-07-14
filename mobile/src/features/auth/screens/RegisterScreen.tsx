import React from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/useAuthStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Typography } from '../../../components/ui/Typography';
import { AuthStackParamList } from '../../../navigation/AuthStack';

const registerSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"],
});

type RegisterFormData = z.infer<typeof registerSchema>;
type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const setTokens = useAuthStore((state) => state.setTokens);
  
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', first_name: '', last_name: '', password: '', password_confirm: '' }
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // First register
      await apiClient.post('/api/v1/auth/register/', data);
      
      // Then login to get tokens
      const loginResponse = await apiClient.post('/api/v1/auth/login/', {
        email: data.email,
        password: data.password
      });
      return loginResponse.data;
    },
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white justify-center px-6"
    >
      <View className="mb-8">
        <Typography variant="h1" className="mb-2 text-blue-600">LifeOS</Typography>
        <Typography variant="body" className="text-gray-500">Create a new account</Typography>
      </View>

      {mutation.isError && (
        <View className="bg-red-50 p-3 rounded-lg mb-4 border border-red-100">
          <Typography variant="caption" className="text-red-600">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(mutation.error as unknown as any).response?.data?.email?.[0] || (mutation.error as unknown as any).response?.data?.message || mutation.error.message || 'Registration failed.'}
          </Typography>
        </View>
      )}

      <Controller
        control={control}
        name="first_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="First Name (optional)"
            placeholder="Enter your first name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.first_name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="last_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Last Name (optional)"
            placeholder="Enter your last name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.last_name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            placeholder="Enter your email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            placeholder="Create a password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
            secureTextEntry
          />
        )}
      />

      <Controller
        control={control}
        name="password_confirm"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password_confirm?.message}
            secureTextEntry
          />
        )}
      />

      <Button 
        title="Sign Up" 
        className="mt-4"
        onPress={handleSubmit(onSubmit)} 
        isLoading={mutation.isPending}
      />

      <View className="mt-6 flex-row justify-center">
        <Typography variant="body" className="text-gray-500">Already have an account? </Typography>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Typography variant="body" className="text-blue-600 font-bold">Sign In</Typography>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
