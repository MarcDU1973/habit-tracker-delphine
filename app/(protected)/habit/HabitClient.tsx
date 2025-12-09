
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Habit {
  id: string;
  name: string;
  description?: string;
}

interface Tracking {
  habit: string;
  completed: boolean;
  count: number;
  target_count: number;
}

export default function HabitClient({ user }: { user: string }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tracking, setTracking] = useState<Record<string, Tracking>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: habitsData, error: habitsError } = await supabase.from("habits").select("*");
        if (habitsError) throw habitsError;
        setHabits(habitsData || []);

        const { data: trackingData, error: trackingError } = await supabase
          .from("tracking")
          .select("*")
          .eq("user_id", user);
        if (trackingError) throw trackingError;

        const map: Record<string, Tracking> = {};
        trackingData?.forEach((t) => {
          map[t.habit] = t;
        });
        setTracking(map);
      } catch (err: any) {
        console.error("Fehler beim Laden:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const toggleHabit = async (habitId: string, checked: boolean) => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const current = tracking[habitId];
    const newCount = checked ? (current ? current.count : 1) : 0;

    try {
      const { error } = await supabase
        .from("tracking")
        .upsert(
          {
            user_id: user,
            habit: habitId,
            completed: checked,
            date: today,
            count: newCount,
            target_count: current?.target_count ?? 1,
            last_update: new Date().toISOString(),
          },
          { onConflict: "user_id,habit,date" }
        );

      if (error) throw error;

      setTracking((prev) => ({
        ...prev,
        [habitId]: {
          ...prev[habitId],
          completed: checked,
          count: newCount,
          target_count: current?.target_count ?? 1,
        },
      }));
    } catch (err: any) {
      console.error("Fehler beim Upsert:", err.message);
    }
  };

  const incrementHabit = async (habitId: string) => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const current = tracking[habitId];
    const newCount = current ? current.count + 1 : 1;

    try {
      const { error } = await supabase
        .from("tracking")
        .upsert(
          {
            user_id: user,
            habit: habitId,
            completed: newCount >= (current?.target_count ?? 1),
            date: today,
            count: newCount,
            target_count: current?.target_count ?? 1,
            last_update: new Date().toISOString(),
          },
          { onConflict: "user_id,habit,date" }
        );

      if (error) throw error;

      setTracking((prev) => ({
        ...prev,
        [habitId]: {
          ...prev[habitId],
          completed: newCount >= (current?.target_count ?? 1),
          count: newCount,
          target_count: current?.target_count ?? 1,
        },
      }));
    } catch (err: any) {
      console.error("Fehler beim Increment:", err.message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Lade Daten...</p>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Verfügbare Habits</h1>
        <p className="text-gray-300 mb-6">
          Eingeloggt als <span className="font-semibold">{user}</span>
        </p>
        <ul>
          {habits.map((habit, index) => (
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
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tracking[habit.id]?.completed || false}
                  onChange={(e) => toggleHabit(habit.id, e.target.checked)}
                  className="w-5 h-5 accent-green-500 cursor-pointer"
                />
                <button
                  onClick={() => incrementHabit(habit.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                >
                  +1
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
