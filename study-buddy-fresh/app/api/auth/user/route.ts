import { NextResponse } from "next/server"
import { supabase } from "@/lib/config/supabase-client"

export async function GET() {
  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

