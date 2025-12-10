
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
  const [mode, setMode] = useState<RangeMode>("today");

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

  const maxPoints = useMemo(() => {
    return leaderboard.length ? Math.max(...leaderboard.map((e) => e.total)) : 0;
  }, [leaderboard]);

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-yellow-400 text-black"; // Gold
    if (index === 1) return "bg-gray-300 text-black";   // Silber
    if (index === 2) return "bg-orange-400 text-black"; // Bronze
    return "bg-black/40 text-white";
  };

  return (
    <main className="flex flex-col items-center justify-center gap-8 p-8">
      {/* Box 1: Hero */}
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-center text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-4">🏊‍♂️ Delphine Habit Tracker 🏊‍♂️</h1>
        <p className="text-gray-200 mb-6">Training und (gute) Habits erfassen</p>
        <div className="flex justify-center gap-3">
          <Button href="/schwimmer">Schwimmer anzeigen</Button>
          <Button href="/habit">Habit erfassen</Button>
        </div>
      </section>

      {/* Schalter Heute | Gesamt mittig */}
      <div className="flex justify-center mb-2">
        <div className="flex gap-2 bg-black/30 rounded-lg p-2">
          <button
            onClick={() => setMode("today")}
            className={`px-4 py-2 rounded ${
              mode === "today"
                ? "bg-white text-blue-700 font-semibold"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Heute
          </button>
          <button
            onClick={() => setMode("all")}
            className={`px-4 py-2 rounded ${
              mode === "all"
                ? "bg-white text-blue-700 font-semibold"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Gesamt
          </button>
        </div>
      </div>

      {/* Box 2: Leaderboard */}
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">🏆 Leaderboard</h2>
        {loading ? (
          <p className="text-gray-300 text-center">Lade Daten...</p>
        ) : errorMsg ? (
          <p className="text-red-300 text-center">{errorMsg}</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-gray-300 text-center">
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

      {/* Box 3: Tagesbestleistung }
      {mode === "today" && leaderboard.length > 0 && (
        <section className="bg-green-600 backdrop-blur rounded-lg p-6 w-full max-w-lg text-white shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🌟 Tagesbestleistung</h2>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{leaderboard[0].user_id}</span>
            <p className="text-lg mt-2">{leaderboard[0].total} Punkte heute!</p>
          </div>
        </section>
      )}*/}

      {/* Box 4: Info */}
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">ℹ️ Info</h2>
        <p className="text-gray-200">
          Willkommen beim Habit Tracker 🏊‍♂️ – erfasse deine täglichen Schwimm-Habits und vergleiche dich mit anderen.
        </p>
      </section>
    </main>
  );
}
