
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Habit {
  id: string;
  name: string;
  description?: string;
}

interface Tracking {
  habit: string;        // Habit-ID
  completed: boolean;   // für HEUTE
  count: number;        // für HEUTE
  target_count: number; // Tagesziel
}

export default function HabitClient({ user }: { user: string }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tracking, setTracking] = useState<Record<string, Tracking>>({});
  const [loading, setLoading] = useState(true);

  // Hilfsfunktion: heute im Format YYYY-MM-DD
  const todayStr = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Habits laden
        const { data: habitsData, error: habitsError } = await supabase
          .from("habits")
          .select("*");
        if (habitsError) throw habitsError;
        setHabits(habitsData || []);

        // 2) Tracking NUR für HEUTE und den aktuellen Nutzer laden
        const today = todayStr();
        const { data: trackingData, error: trackingError } = await supabase
          .from("tracking")
          .select("*")
          .eq("user_id", user)
          .eq("date", today);

        if (trackingError) throw trackingError;

        // 3) Map aufbauen: Habit-ID → Tracking von HEUTE
        const map: Record<string, Tracking> = {};
        trackingData?.forEach((t) => {
          map[t.habit] = t as Tracking;
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

  // Optional: UI-Reset genau um Mitternacht (Client-seitig)
  useEffect(() => {
    const msUntilMidnight = () => {
      const now = new Date();
      const next = new Date(now);
      next.setDate(now.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      return next.getTime() - now.getTime();
    };

    const timer = setTimeout(() => {
      // UI-Reset (heutige Anzeige “leer” machen) – Datenbank bleibt unverändert
      setTracking({});
    }, msUntilMidnight());

    return () => clearTimeout(timer);
  }, []);

  const toggleHabit = async (habitId: string, checked: boolean) => {
    if (!user) return;
    const today = todayStr();
    const current = tracking[habitId];
    // Wenn checked true wird: count mindestens 1, sonst 0
    const newCount = checked ? (current ? current.count || 1 : 1) : 0;

    try {
      const { error } = await supabase
        .from("tracking")
        .upsert(
          {
            user_id: user,              // bei euch: username im tracking.user_id
            habit: habitId,             // Habit-ID
            completed: checked,         // HEUTE
            date: today,                // HEUTE
            count: newCount,            // HEUTE
            target_count: current?.target_count ?? 1,
            last_update: new Date().toISOString(),
          },
          { onConflict: "user_id,habit,date" } // supabase-js v2
        );

      if (error) throw error;

      setTracking((prev) => ({
        ...prev,
        [habitId]: {
          ...(prev[habitId] ?? {
            habit: habitId,
            completed: false,
            count: 0,
            target_count: 1,
          }),
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
    const today = todayStr();
    const current = tracking[habitId];
    const nextCount = current ? current.count + 1 : 1;
    const target = current?.target_count ?? 1;

    try {
      const { error } = await supabase
        .from("tracking")
        .upsert(
          {
            user_id: user,
            habit: habitId,
            completed: nextCount >= target, // automatisch auf “erledigt” wenn count >= target
            date: today,
            count: nextCount,
            target_count: target,
            last_update: new Date().toISOString(),
          },
          { onConflict: "user_id,habit,date" }
        );

      if (error) throw error;

      setTracking((prev) => ({
        ...prev,
        [habitId]: {
          ...(prev[habitId] ?? {
            habit: habitId,
            completed: false,
            count: 0,
            target_count: target,
          }),
          count: nextCount,
          completed: nextCount >= target,
          target_count: target,
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
          {habits.map((habit, index) => {
            const tracked = tracking[habit.id]; // HEUTE
            const checked = tracked?.completed || false;
            const count = tracked?.count ?? 0;
            const target = tracked?.target_count ?? 1;

            return (
              <li
                key={habit.id}
                className="flex items-center justify-between py-3 border-b border-white/20 last:border-b-0"
              >
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {index + 1}. {habit.name}
                  </span>
                  <span className="text-gray-300 text-sm">{habit.description}</span>

                  {/* Fortschritt HEUTE */}
                  <span className="text-gray-400 text-xs mt-1">
                    Fortschritt (heute): {count} / {target}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
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
            );
          })}
        </ul>
      </section>
    </main>
  );
}
