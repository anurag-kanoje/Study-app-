import { NextResponse } from "next/server"
import { supabase } from "@/lib/config/supabase-client"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

