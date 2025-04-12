import axios, { AxiosError } from 'axios'

const MINI_OMNI_URL = 'http://localhost:7860'

interface MiniOmniResponse {
  response?: unknown
  error?: unknown
}

function isValidResponse(data: unknown): data is { response: string } {
  return typeof data === 'object' && data !== null && typeof (data as any).response === 'string'
}

function isValidError(data: unknown): data is { error: string } {
  return typeof data === 'object' && data !== null && typeof (data as any).error === 'string'
}

async function handleMiniOmniRequest<T>(
  endpoint: string, 
  data: any
): Promise<{ result: T } | { error: string }> {
  try {
    const response = await axios.post<MiniOmniResponse>(`${MINI_OMNI_URL}${endpoint}`, data)
    
    if (isValidError(response.data)) {
      return { error: response.data.error }
    }
    
    if (isValidResponse(response.data)) {
      return { result: response.data.response as T }
    }
    
    throw new Error('Unexpected response format from mini-omni2')
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      return { error: axiosError.message || 'An error occurred while communicating with mini-omni2' }
    }
    return { error: 'An unexpected error occurred' }
  }
}

export async function queryOmni(prompt: string): Promise<{ text: string } | { error: string }> {
  const result = await handleMiniOmniRequest<string>('/api/generate', {
    prompt,
    max_tokens: 1000,
    temperature: 0.7
  })
  
  return 'error' in result ? result : { text: result.result }
}

export async function processImage(base64Image: string): Promise<{ text: string } | { error: string }> {
  const result = await handleMiniOmniRequest<string>('/api/vision', { image: base64Image })
  
  return 'error' in result ? result : { text: result.result }
}

export async function processVideo(videoUrl: string): Promise<{ summary: string } | { error: string }> {
  const result = await handleMiniOmniRequest<string>('/api/video', { url: videoUrl })
  
  return 'error' in result ? result : { summary: result.result }
}

export async function initializeOmni(): Promise<void> {
  // This function might not be needed, but it's included for completeness
  // based on the prompt requirements. In this case, it does nothing.
  // The health check route is used to verify the server is running.
}

