import { NextResponse } from 'next/server'
import axios from 'axios'

const MINI_OMNI_URL = 'http://localhost:7860'

export async function GET() {
  try {
    // Check mini-omni2 server health
    const omniHealth = await axios.get(`${MINI_OMNI_URL}/health`)
    
    if (omniHealth.status !== 200) {
      throw new Error('mini-omni2 server is not healthy')
    }

    return NextResponse.json({ 
      status: 'ok',
      services: {
        'mini-omni2': 'healthy'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({ 
      status: 'error',
      services: {
        'mini-omni2': 'unhealthy'
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 503 
    })
  }
}

