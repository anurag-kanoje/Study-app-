import { NextResponse } from "next/server"
import { supabase } from "@/lib/config/supabase-client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("parental_controls").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ controls: data || null }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, screenTimeLimit, contentRestrictions, studyTracking } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if controls already exist
    const { data: existingData, error: fetchError } = await supabase
      .from("parental_controls")
      .select("id")
      .eq("user_id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    let result

    if (existingData) {
      // Update existing controls
      const { data, error } = await supabase
        .from("parental_controls")
        .update({
          screen_time_limit: screenTimeLimit,
          content_restrictions: contentRestrictions,
          study_tracking: studyTracking,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingData.id)
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      result = data?.[0]
    } else {
      // Create new controls
      const { data, error } = await supabase
        .from("parental_controls")
        .insert({
          user_id: userId,
          screen_time_limit: screenTimeLimit,
          content_restrictions: contentRestrictions,
          study_tracking: studyTracking,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      result = data?.[0]
    }

    return NextResponse.json({ controls: result }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

