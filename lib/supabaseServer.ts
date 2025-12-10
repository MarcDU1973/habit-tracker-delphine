
// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Server-seitiger Supabase-Client, z. B. für API-Route-Handler.
 * Nutzt die öffentlichen Env-Variablen (Anon Key), passend zu eurer Cookie-basierten Auth.
 *
 * Wichtig:
 *  - NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY müssen gesetzt sein.
 *  - KEIN JSX in dieser Datei (nur TS/JS).
 */
export function createSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase-Umgebungsvariablen fehlen: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createClient(url, anonKey);
}
