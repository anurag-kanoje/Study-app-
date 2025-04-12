import { NextResponse } from "next/server"
import { supabase } from "@/lib/config/supabase-client"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user, session: data.session }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

