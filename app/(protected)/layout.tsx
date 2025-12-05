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
    <section className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 flex justify-between items-center bg-black/40">
        <h1 className="font-bold">Habit App</h1>
        {/* Variante 2: Link zur Logout-Seite */}
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