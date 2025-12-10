
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

    // Nutzer aus eigener Tabelle 'users' holen
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", cleanUsername)
      .single();

    // Debug (nur serverseitig)
    console.log("Supabase result:", { user, error });

    if (error || !user) {
      return NextResponse.json({ error: "User nicht gefunden" }, { status: 401 });
    }

    // Erfolg → Cookie setzen (clientseitig lesbar, da NICHT httpOnly)
    const res = NextResponse.json({ success: true, username: user.username });

    // WICHTIG: httpOnly NICHT setzen, wenn du den Cookie im Browser-Skript auslesen willst.

// app/api/login/route.ts (Ausschnitt; du hast sie schon)
res.cookies.set("user", user.username, {
  httpOnly: false,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24,
});


    return res;
  } catch (e: any) {
    console.error("Login-Route Fehler:", e?.message ?? e);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
