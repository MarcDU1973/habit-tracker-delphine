
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Cookie 'user' auslesen (username/email), clientseitig */
function readUserCookie(): string | null {
  // Robuste Regex, berücksichtigt evtl. Leerzeichen vor dem Cookie
  const match = document.cookie.match(/(?:^|;\s*)user=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** Cookie 'user' clientseitig löschen (Fallback, falls API nicht erreichbar) */
function clearUserCookie() {
  document.cookie = "user=; Max-Age=0; path=/; SameSite=Lax";
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  // Initial: Cookie lesen
  useEffect(() => {
    const cookieUser = readUserCookie();
    setIsLoggedIn(!!cookieUser);
    setDisplayName(cookieUser);
  }, []);

  // Optional: Logout via API (empfohlen), fallback auf clientseitiges Löschen
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) {
        // Fallback, falls API nicht erreichbar
        clearUserCookie();
      }
    } catch {
      clearUserCookie();
    } finally {
      router.push("/login");
      router.refresh(); // sofortige Aktualisierung der UI
    }
  };

  const navLinks = [
    { href: "/", label: "Startseite" },
    { href: "/habit", label: "Habits" },
    { href: "/schwimmer", label: "Schwimmer" },
  ];

  const linkClasses = (href: string) =>
    `px-3 py-2 rounded transition ${
      pathname === href ? "bg-white text-blue-700 font-bold" : "text-white hover:bg-blue-500"
    }`;

  return (
    <nav className="bg-blue-700 p-4 flex flex-wrap items-center gap-4 shadow-md justify-between">
      {/* Link-Liste (links) */}
      <div className="flex flex-wrap gap-3">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Rechts: Anzeige + Login/Logout */}
      <div className="flex items-center gap-3">
        {displayName && (
          <span className="hidden sm:inline text-white/90">
            Eingeloggt als <span className="font-semibold">{displayName}</span>
          </span>
        )}

        {!isLoggedIn ? (
          <Link
            href="/login"
            className="px-3 py-2 rounded bg-white text-blue-700 font-semibold hover:bg-blue-100"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded bg-white text-blue-700 font-semibold hover:bg-blue-100"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
