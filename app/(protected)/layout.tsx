import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const user = cookieStore.get("user")?.value

  if (!user) {
    redirect("/login")
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-200 via-sky-500 to-sky-700 text-white">
      <header className="p-4 flex justify-between items-center bg-black/40 backdrop-blur">
        {/* Navigation links oben links */}
        <nav className="flex gap-6">
          <Link href="/" className="hover:text-yellow-300 font-semibold">
            Dashboard
          </Link>
          <Link href="/schwimmer" className="hover:text-yellow-300 font-semibold">
            Schwimmer
          </Link>
          <Link href="/habits" className="hover:text-yellow-300 font-semibold">
            Habits
          </Link>
        </nav>

        {/* App-Titel mittig */}
        <h1 className="font-bold text-lg">Habit App</h1>

        {/* Logout rechts */}
        <Link
          href="/logout"
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </Link>
      </header>

      <main className="p-8">{children}</main>
    </section>
  )
}