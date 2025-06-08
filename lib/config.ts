import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  GOOGLE_CLOUD_API_KEY: z.string().min(1),
  ONESIGNAL_APP_ID: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_SECRET: z.string().min(1),
  ENCRYPTION_KEY: z.string().min(1),
});

export const config = {
  // API Clients
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    maxTokens: 2000,
  },
  googleCloud: {
    apiKey: process.env.GOOGLE_CLOUD_API_KEY,
    projectId: 'studybuddy-ocr',
  },
  oneSignal: {
    appId: process.env.ONESIGNAL_APP_ID,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: 'studybuddy-files',
  },

  // Feature Flags
  features: {
    ai: process.env.ENABLE_AI_FEATURES === 'true',
    ocr: process.env.ENABLE_OCR === 'true',
    notifications: process.env.ENABLE_NOTIFICATIONS === 'true',
    offline: process.env.ENABLE_OFFLINE_MODE === 'true',
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
};

// Validate environment variables
try {
  envSchema.parse(process.env);
} catch (error) {
  console.error('Invalid environment variables:', error);
  process.exit(1);
} 