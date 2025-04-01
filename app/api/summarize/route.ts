import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required and must be a string" }, { status: 400 })
    }

    // Call Hugging Face API for summarization
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 150,
          min_length: 30,
          do_sample: false,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to summarize text")
    }

    const result = await response.json()
    const summary = Array.isArray(result) ? result[0].summary_text : result.summary_text

    return NextResponse.json({ summary })
  } catch (error) {
    console.error("Error in summarize API:", error)
    return NextResponse.json({ error: (error as Error).message || "Failed to summarize text" }, { status: 500 })
  }
}

