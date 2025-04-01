/**
 * Environment variable configuration with fallbacks
 * This ensures the application doesn't crash if environment variables are missing
 */

// Supabase Configuration
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// OneSignal Configuration
export const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || ""
export const ONESIGNAL_SAFARI_WEB_ID = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID || ""

// Hugging Face API (for AI features)
export const HUGGINGFACE_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || ""

// OpenAI API (for AI features)
export const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ""

// Check if critical environment variables are missing
export const isMissingCriticalEnvVars = () => {
  const missingVars = []

  if (!SUPABASE_URL) missingVars.push("NEXT_PUBLIC_SUPABASE_URL")
  if (!SUPABASE_ANON_KEY) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  return missingVars.length > 0 ? missingVars : false
}

// Log warning for missing environment variables
export const logEnvWarnings = () => {
  const missingVars = isMissingCriticalEnvVars()

  if (missingVars) {
    console.warn(`Warning: Missing critical environment variables: ${missingVars.join(", ")}`)
    console.warn("Some features may not work correctly without these variables.")
  }

  if (!ONESIGNAL_APP_ID) {
    console.warn("Warning: NEXT_PUBLIC_ONESIGNAL_APP_ID is missing. Notifications will not work.")
  }

  if (!HUGGINGFACE_API_KEY && !OPENAI_API_KEY) {
    console.warn("Warning: AI API keys are missing. AI features will not work.")
  }
}

