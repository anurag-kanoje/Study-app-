import { NextResponse } from 'next/server'
import { processVideo } from '@/utils/mini-omni'

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json()
    const result = await processVideo(videoUrl)
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    return NextResponse.json({ summary: result.summary })
  } catch (error) {
    console.error('Error in video summarization:', error)
    return NextResponse.json({ error: 'Failed to summarize video' }, { status: 500 })
  }
}

