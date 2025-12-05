import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  const { username } = await request.json()
  const cleanUsername = username.trim()

  // Direkt den passenden Benutzer holen
  const { data: user, error } = await supabase
    .from("login")
    .select("*")
    .eq("username", cleanUsername)
    .single() // liefert direkt ein Objekt statt Array

  if (error || !user) {
    return NextResponse.json({ error: "User nicht gefunden" }, { status: 401 })
  }

  // Erfolg → Cookie setzen
  const response = NextResponse.json({ success: true })
  response.cookies.set("user", user.username, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 Tag
  })

  return response
}