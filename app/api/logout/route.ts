import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })
  // Cookie löschen
  response.cookies.set("user", "", { maxAge: 0, path: "/" })
  return response
}