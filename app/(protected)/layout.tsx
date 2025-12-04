// app/(protected)/layout.tsx
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const user = cookieStore.get("user")?.value

  if (!user) {
    // Wenn kein Cookie vorhanden → Redirect zur Login-Seite
    redirect("/login")
  }

  return (
    <section className="min-h-screen bg-gray-900 text-white">
      {/* Optional: Header mit Logout */}
      <header className="p-4 flex justify-between items-center bg-black/40">
        <h1 className="font-bold">Habit App</h1>
        <form action="/api/logout" method="post">
          <button
            type="submit"
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </form>
      </header>
      <main className="p-8">{children}</main>
    </section>
  )
}