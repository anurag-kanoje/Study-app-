import { NextResponse } from 'next/server'
import { queryOmni } from '@/utils/mini-omni'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    const result = await queryOmni(`Summarize the following text:\n\n${text}`)
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    return NextResponse.json({ summary: result.text })
  } catch (error) {
    console.error('Error in text summarization:', error)
    return NextResponse.json({ error: 'Failed to summarize text' }, { status: 500 })
  }
}

