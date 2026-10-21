# StudyBuddy

Current project status, migration context, deployment readiness, and Android IOException diagnosis are maintained in:

- `docs/DEVELOPMENT_STATUS_AND_BUILD_DIAGNOSIS.md`

## Quick Start (Current Root App)

1. Copy env template and set Supabase keys (required):
   - `cp .env.example .env`
   - Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - Apply [src/database/schema.sql](src/database/schema.sql) in your Supabase SQL editor
2. Install dependencies: `npm install`
3. Start Expo: `npm run start`
4. Run Android/iOS: `npm run android` / `npm run ios`

## Mobile features (current)

- Auth: login, signup, role selection (student / teacher / parent)
- Study groups and shared study materials (Supabase)
- AI video generator (script; optional OpenAI / Replicate keys)
- AI notes with on-device OCR (Tesseract.js)

## Build

- Preview APK: `eas build --platform android --profile preview`
- Production bundle: `eas build --platform android --profile production`

