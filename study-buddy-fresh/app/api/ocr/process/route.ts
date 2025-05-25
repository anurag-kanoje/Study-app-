import { NextResponse } from 'next/server'
import { processImage } from '@/utils/mini-omni'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const buffer = await image.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString('base64')

    const result = await processImage(base64Image)
    
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    
    return NextResponse.json({ text: result.text })
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
  }
}

