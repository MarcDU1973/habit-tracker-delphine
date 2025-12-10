
"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Button from "@/components/Button";

interface LeaderboardEntry {
  user_id: string;
  total: number;
}

type RangeMode = "today" | "all";

export default function HomePage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<RangeMode>("today"); // "today" | "all"

  const todayStr = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        let query = supabase.from("tracking").select("user_id, count, date");

        if (mode === "today") {
          query = query.eq("date", todayStr());
        }

        const { data, error } = await query;
        if (error) throw error;

        // Aggregation im Client: Summe count pro user_id
        const totals: Record<string, number> = {};
        (data ?? []).forEach((row: any) => {
          const uid = row.user_id as string;
          const cnt = Number(row.count) || 0;
          totals[uid] = (totals[uid] || 0) + cnt;
        });

        const sorted = Object.entries(totals)
          .map(([user_id, total]) => ({ user_id, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10);

        setLeaderboard(sorted);
      } catch (err: any) {
        console.error("Fehler beim Laden des Leaderboards:", err?.message ?? err);
        setErrorMsg(err?.message ?? "Unbekannter Fehler beim Laden des Leaderboards");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [mode]);

  // Max-Wert für Progress-Balken
  const maxPoints = useMemo(() => {
    return leaderboard.length ? Math.max(...leaderboard.map((e) => e.total)) : 0;
  }, [leaderboard]);

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-yellow-400 text-black"; // Gold
    if (index === 1) return "bg-gray-300 text-black";   // Silber
    if (index === 2) return "bg-orange-400 text-black"; // Bronze
    // Standard (dunkles Card-Design passend zum Layout)
    return "bg-black/40 text-white";
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">🏆 Leaderboard</h2>
          {/* Filter Toggle: Heute vs. Gesamt */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode("today")}
              className={`px-3 py-1 rounded ${mode === "today" ? "bg-white text-blue-700 font-semibold" : "bg-white/10 text-white hover:bg-white/20"}`}
              aria-pressed={mode === "today"}
            >
              Heute
            </button>
            <button
              onClick={() => setMode("all")}
              className={`px-3 py-1 rounded ${mode === "all" ? "bg-white text-blue-700 font-semibold" : "bg-white/10 text-white hover:bg-white/20"}`}
              aria-pressed={mode === "all"}
            >
              Gesamt
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-300">Lade Daten...</p>
        ) : errorMsg ? (
          <p className="text-red-300">{errorMsg}</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-gray-300">
            {mode === "today"
              ? "Heute wurden noch keine Punkte erfasst."
              : "Es liegen noch keine Punkte vor."}
          </p>
        ) : (
          <ul className="space-y-2">
            {leaderboard.map((entry, index) => (
              <li
                key={entry.user_id}
                className={`rounded p-4 ${getRankColor(index)}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    #{index + 1} {entry.user_id}
                  </span>
                  <span className="font-bold">{entry.total} Punkte</span>
                </div>

                {/* Fortschrittsbalken relativ zum Top-Wert */}
                {maxPoints > 0 && (
                  <div className="mt-2 w-full bg-white/20 rounded h-2">
                    <div
                      className="bg-green-500 h-2 rounded"
                      style={{ width: `${(entry.total / maxPoints) * 100}%` }}
                    />
                  </div>
                )}
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
