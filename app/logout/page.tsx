"use client"

import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="bg-black/50 p-8 rounded-xl shadow-lg text-center text-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Logout</h1>
        <p className="mb-6 text-gray-300">Möchtest du dich wirklich abmelden?</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Ja, abmelden
          </button>
          <button
            onClick={() => router.push("/habit")}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Nein, zurück
          </button>
        </div>
      </div>
    </main>
  )
}