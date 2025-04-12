import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const { text: response } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an AI study assistant designed to help students with their educational needs.
      
      User message: ${message}
      
      Provide a helpful, educational response that addresses the user's question or concern.
      If the query is related to a subject, provide accurate information and explanations.
      If it's a request for study tips or learning strategies, offer practical advice.
      Keep your response concise, informative, and supportive.`,
    })

    return NextResponse.json({ response }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

