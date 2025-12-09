
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: string;
  username: string;
  team: string;
}

interface HabitTracking {
  habit: string; // ID der Habit
  completed: boolean;
  count: number;
  target_count: number;
}

interface Habit {
  id: string;
  name: string;
}

export default function SchwimmerPage() {
  const [groups, setGroups] = useState<Record<string, User[]>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<HabitTracking[]>([]);
  const [habitNames, setHabitNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Schwimmer laden und nach team gruppieren
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("users").select("id, username, team");
        if (error) throw error;

        const grouped: Record<string, User[]> = {};
        data.forEach((user: User) => {
          if (!grouped[user.team]) grouped[user.team] = [];
          grouped[user.team].push(user);
        });

        setGroups(grouped);
      } catch (err: any) {
        console.error("Fehler beim Laden der Schwimmer:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Alle Habits laden und Mapping erstellen
  useEffect(() => {
    const fetchHabitNames = async () => {
      try {
        const { data, error } = await supabase.from("habits").select("id, name");
        if (error) throw error;

        const map: Record<string, string> = {};
        data.forEach((h: Habit) => {
          map[h.id] = h.name;
        });
        setHabitNames(map);
      } catch (err: any) {
        console.error("Fehler beim Laden der Habit-Namen:", err.message);
      }
    };

    fetchHabitNames();
  }, []);

  // Habits für ausgewählten Schwimmer laden
  const fetchHabitsForUser = async (username: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("tracking")
        .select("habit, completed, count, target_count")
        .eq("user_id", username) // tracking.user_id enthält den Benutzernamen
        .eq("date", today);

      if (error) throw error;
      setHabits(data || []);
    } catch (err: any) {
      console.error("Fehler beim Laden der Habits:", err.message);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    fetchHabitsForUser(user.username);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Lade Schwimmer...</p>;
  }

  return (
    <main className="flex flex-col gap-8 p-8">
      <h1 className="text-3xl font-bold text-center text-white">🏊 Unsere Schwimmer</h1>

      {Object.entries(groups).map(([teamName, users]) => (
        <section
          key={teamName}
          className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-4xl mx-auto text-white shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">{teamName}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="bg-white text-black rounded-lg shadow p-4 cursor-pointer hover:bg-blue-100 transition"
              >
                <h3 className="text-lg font-bold">{user.username}</h3>
                <p className="text-gray-600">Details anzeigen</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Modal für Habit-Details */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-black">
            <h2 className="text-xl font-bold mb-4">
              {selectedUser.username} – Habits heute
            </h2>
            {habits.length > 0 ? (
              <ul className="space-y-2">
                {habits.map((habit, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{habitNames[habit.habit] || habit.habit}</span>
                    <span>
                      {habit.completed ? "✅" : "❌"} ({habit.count}/{habit.target_count})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Keine Habits erfasst.</p>
            )}
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
