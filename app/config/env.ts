const getEnvVar = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const env = {
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY'),
  },
  assemblyai: {
    apiKey: getEnvVar('ASSEMBLYAI_API_KEY'),
  },
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL'),
  }
} as const 