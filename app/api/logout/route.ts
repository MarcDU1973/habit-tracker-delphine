
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Cookie invalidieren
  res.cookies.set("user", "", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return res;
}
