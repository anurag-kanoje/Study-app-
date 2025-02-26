import { NextResponse } from 'next/server'
import { initializeOmni } from '@/utils/mini-omni'

let isInitialized = false

export async function GET() {
  if (!isInitialized) {
    try {
      await initializeOmni()
      isInitialized = true
      return NextResponse.json({ status: 'initialized' })
    } catch (error) {
      console.error('Failed to initialize Omni:', error)
      return NextResponse.json(
        { error: 'Failed to initialize Omni' },
        { status: 500 }
      )
    }
  }
  
  return NextResponse.json({ status: 'already initialized' })
}

