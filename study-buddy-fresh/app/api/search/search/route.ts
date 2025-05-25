import { NextResponse } from 'next/server'
import { queryOmni } from '@/utils/mini-omni'

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: 'No query provided' }, { status: 400 })
    }

    const result = await queryOmni(`Provide a concise summary of the topic: ${query}`)
    
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    
    return NextResponse.json({ summary: result.text })
  } catch (error) {
    console.error('Error searching topic:', error)
    return NextResponse.json({ error: 'Failed to search topic' }, { status: 500 })
  }
}

