import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    const { text: summary } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze the image at this URL: ${imageUrl}
      
      Provide a detailed description of what you see in the image, and summarize any text content that appears in it.
      Focus on the main elements, text, and overall context of the image.`,
    })

    return NextResponse.json({ summary }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

