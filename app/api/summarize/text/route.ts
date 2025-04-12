import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const { text: summary } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Summarize the following text in a concise manner, highlighting the key points and main ideas:
      
      ${text}
      
      Provide a well-structured summary that captures the essence of the text.`,
    })

    return NextResponse.json({ summary }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

