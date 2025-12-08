"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function HabitClient({ user }: { user: string }) {
  const [habits, setHabits] = useState<any[]>([])
  const [tracking, setTracking] = useState<Record<string, any>>({})

  useEffect(() => {
    
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const fetchData = async () => {
      const { data: habitsData } = await supabase.from("habits").select("*")
      setHabits(habitsData || [])

      const { data: trackingData } = await supabase.from("tracking").select("*")
      const map: Record<string, any> = {}
      trackingData?.forEach(t => {
        map[t.habit] = t
      })
      setTracking(map)
    }
    fetchData()
  }, [])

  const toggleHabit = async (habitId: string, checked: boolean) => {
    if (!user) return
    const today = new Date().toISOString().split("T")[0]

    const { data: existing } = await supabase
      .from("tracking")
      .select("*")
      .eq("user_id", user)
      .eq("habit", habitId)
      .eq("date", today)
      .single()

      
    let newCount = 0
    if (checked) {
      newCount = existing ? existing.count + 1 : 1
    } else {
      newCount = 0
    }

    console.log("Upsert Payload:", {
      user_id: user,
      habit: habitId,
      completed: checked,
      date: today,
      count: newCount
    });
    
    await supabase
      .from("tracking")
      .upsert({
        user_id: user,
        habit: habitId,
        completed: checked,
        date: today,
        count: newCount,
        target_count: existing?.target_count ?? 1,
        last_update: new Date().toISOString(),
      }, { onConflict: "user_id,habit,date" })

    setTracking(prev => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        completed: checked,
        count: newCount,
        target_count: existing?.target_count ?? 1
      }
    }))
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Verfügbare Habits</h1>
        <p className="text-gray-300 mb-6">
          Eingeloggt als <span className="font-semibold">{user}</span>
        </p>
        <ul>
          {habits?.map((habit: any, index: number) => (
            <li
              key={habit.id}
              className="flex items-center justify-between py-3 border-b border-white/20 last:border-b-0"
            >
              <div className="flex flex-col">
                <span className="font-semibold">
                  {index + 1}. {habit.name}
                </span>
                <span className="text-gray-300 text-sm">{habit.description}</span>
                {tracking[habit.id] && (
                  <span className="text-gray-400 text-xs mt-1">
                    Fortschritt: {tracking[habit.id].count} / {tracking[habit.id].target_count}
                  </span>
                )}
              </div>
              <input
                type="checkbox"
                checked={tracking[habit.id]?.completed || false}
                onChange={e => toggleHabit(habit.id, e.target.checked)}
                className="w-5 h-5 accent-green-500 cursor-pointer"
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}