
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Button from "@/components/Button";

interface LeaderboardEntry {
  user_id: string;
  total: number;
}

export default function HomePage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from("tracking")
          .select("user_id, count");

        if (error) throw error;

        // Aggregation im Client
        const totals: Record<string, number> = {};
        data.forEach((row) => {
          totals[row.user_id] = (totals[row.user_id] || 0) + row.count;
        });

        const sorted = Object.entries(totals)
          .map(([user_id, total]) => ({ user_id, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);

        setLeaderboard(sorted);
      } catch (err: any) {
        console.error("Fehler beim Laden des Leaderboards:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-yellow-400 text-black"; // Gold
    if (index === 1) return "bg-gray-300 text-black";   // Silber
    if (index === 2) return "bg-orange-400 text-black"; // Bronze
    return "bg-black/40 text-white"; // Standard
  };

  return (
    <main className="flex flex-col items-center justify-center gap-8 p-8">
      {/* Box 1: Hero mit Buttons */}
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-center text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-4">🏊‍♂️ Delphine Habit Tracker 🏊‍♂️</h1>
        <p className="text-gray-200 mb-6">Training und (gute) Habits erfassen</p>
        <div className="flex justify-center gap-3">
          <Button href="/schwimmer">Schwimmer anzeigen</Button>
          <Button href="/habit">Habit erfassen</Button>
        </div>
      </section>

      {/* Box 2: Leaderboard */}
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">🏆 Leaderboard</h2>
        {loading ? (
          <p className="text-gray-300">Lade Daten...</p>
        ) : (
          <ul>
            {leaderboard.map((entry, index) => (
              <li
                key={entry.user_id}
                className={`flex justify-between items-center py-3 px-4 mb-2 rounded ${getRankColor(index)}`}
              >
                <span className="font-medium">
                  #{index + 1} {entry.user_id}
                </span>
                <span className="font-bold">{entry.total} Punkte</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Box 3: Info */}
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">ℹ️ Info</h2>
        <p className="text-gray-200">
          Willkommen beim Habit Tracker 🏊‍♂️ – erfasse deine täglichen Schwimm-Habits und vergleiche dich mit anderen.
        </p>
      </section>
    </main>
  );
}
