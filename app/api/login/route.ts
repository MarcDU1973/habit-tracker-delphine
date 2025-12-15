
// app/api/login/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    const cleanUsername = String(username ?? "").trim();

    if (!cleanUsername) {
      return NextResponse.json({ error: "Username fehlt" }, { status: 400 });
    }

    const supabase = createSupabaseServer();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", cleanUsername)
      .single();

    console.log("Supabase result:", { user, error });

    if (error || !user) {
      return NextResponse.json({ error: "User nicht gefunden" }, { status: 401 });
    }

    // Response + Cookie
    const res = NextResponse.json(
      { success: true, username: user.username },
      { status: 200, headers: {
        // Caching vermeiden
        "Cache-Control": "no-store, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      }}
    );

    // Cookie 1 Jahr gültig
    res.cookies.set("user", user.username, {
      httpOnly: false, // Client soll ihn lesen können
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 Jahr
    });

    return res;
  } catch (e: any) {
    console.error("Login-Route Fehler:", e?.message ?? e);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
