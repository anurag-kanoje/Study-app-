import { Translate } from '@google-cloud/translate/build/src/v2'

const translate = new Translate({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  key: process.env.GOOGLE_CLOUD_API_KEY,
})

export async function translateText(text: string, targetLanguage: string) {
  try {
    const [translation] = await translate.translate(text, targetLanguage)
    return translation
  } catch (error) {
    console.error('Error translating text:', error)
    return text // Return original text if translation fails
  }
}

