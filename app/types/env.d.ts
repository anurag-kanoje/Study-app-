declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      OPENAI_API_KEY: string
      ASSEMBLYAI_API_KEY: string
      DATABASE_URL: string
      NEXT_PUBLIC_APP_URL: string
    }
  }
}

export {} 