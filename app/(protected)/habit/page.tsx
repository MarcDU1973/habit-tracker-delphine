import { supabase } from '@/lib/supabaseClient'
import { cookies } from 'next/headers'

export default async function HabitPage() {
  // Cookie auslesen (async!)
  const cookieStore = await cookies()
  const user = cookieStore.get("user")?.value

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <section className="bg-black/40 backdrop-blur rounded-lg p-6 text-white shadow-lg">
          <h1 className="text-xl font-bold mb-4">Nicht eingeloggt</h1>
          <p className="text-gray-300 mb-4">
            Bitte zuerst <a href="/login" className="text-cyan-400 underline">einloggen</a>, um deine Habits zu sehen.
          </p>
        </section>
      </main>
    )
  }

  

  const { data: habits, error } = await supabase.from('habits').select('*')

  if (error) {
    console.error(error)
    return <p className="text-red-500">Fehler beim Laden der Habits</p>
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Verfügbare Habits</h1>
        <p className="text-gray-300 mb-6">Eingeloggt als <span className="font-semibold">{user}</span></p>
        <ul>
          {habits?.map((habit: any, index: number) => (
            <li
              key={habit.id}
              className="flex flex-col py-3 border-b border-white/20 last:border-b-0"
            >
              <span className="font-semibold">{index + 1}. {habit.name}</span>
              <span className="text-gray-300 text-sm">{habit.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}