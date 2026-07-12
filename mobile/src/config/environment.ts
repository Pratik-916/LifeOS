import { z } from 'zod';

const environmentSchema = z.object({
  apiUrl: z.string().url('EXPO_PUBLIC_API_URL must be a valid URL'),
  env: z.enum(['development', 'staging', 'production']).default('development'),
});

export type Environment = z.infer<typeof environmentSchema>;

const processEnv = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  env: process.env.EXPO_PUBLIC_ENV,
};

let env: Environment;

try {
  env = environmentSchema.parse(processEnv);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Invalid environment configuration:', error.format());
  }
  throw new Error('Environment validation failed. Check your .env file.');
}

export const environment = env;
