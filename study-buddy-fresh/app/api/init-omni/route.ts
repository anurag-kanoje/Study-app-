import { NextResponse } from 'next/server'
import axios from 'axios'

const MINI_OMNI_URL = 'http://localhost:7860'

export async function GET() {
  try {
    // Check if mini-omni2 server is running
    const response = await axios.get(`${MINI_OMNI_URL}/health`)
    
    if (response.status === 200) {
      return NextResponse.json({ status: 'ok', message: 'mini-omni2 server is running' })
    } else {
      throw new Error('mini-omni2 server is not responding correctly')
    }
  } catch (error) {
    console.error('Failed to connect to mini-omni2 server:', error)
    return NextResponse.json(
      { 
        error: 'Failed to connect to mini-omni2 server. Make sure it is running on http://localhost:7860',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

