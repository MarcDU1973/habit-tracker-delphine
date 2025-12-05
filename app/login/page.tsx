"use client"

import { useState } from "react"

export default function LoginPage() {
  const [username, setUsername] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })

    if (res.ok) {
      // Weiterleitung zur Habit-Seite
      window.location.href = "/habit"
    } else {
      alert("Login fehlgeschlagen")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-black/40 p-6 rounded-lg text-white shadow-lg w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded text-black w-full mb-4"
        />
        <button
          type="submit"
          className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700 w-full"
        >
          Einloggen
        </button>
      </form>
    </main>
  )
}