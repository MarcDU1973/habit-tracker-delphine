// app/page.tsx
import Button from '@/components/Button'

export default function Home() {
  const leaderboard = [
    { name: "Anna", points: 42 },
    { name: "Ben", points: 37 },
    { name: "Clara", points: 29 },
    { name: "David", points: 25 },
    { name: "Eva", points: 20 },
  ]

  return (
    <main className="flex flex-col items-center justify-center gap-8 p-8">
      
      {/* Box 1: Hero mit Buttons */}
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-center text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-4">🏊‍♂️ Delphine Habit Tracker 🏊‍♂️</h1>
        <p className="text-gray-200 mb-6">Training und (gute) habits erfassen</p>
        <div className="flex justify-center gap-3">
          <Button href="/schwimmer">Schwimmer anzeigen</Button>
          <Button href="/habit">Habit erfassen</Button>
        </div>
      </section>

      {/* Box 2: Leaderboard */}
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <ul>
          {leaderboard.map((user, index) => (
            <li
              key={user.name}
              className="flex justify-between items-center py-2 border-b border-white/20 last:border-b-0"
            >
              <span className="font-medium">
                {index + 1}. {user.name}
              </span>
              <span className="text-cyan-300">{user.points} Punkte</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Box 3: Info */}
      <section className="bg-black/40 backdrop-blur rounded-lg p-6 w-full max-w-lg text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Info</h2>
        <p className="text-gray-200">
          Willkommen beim Habit Tracker 🏊‍♂️ – erfasse deine täglichen Schwimm-Habits und vergleiche dich mit anderen.
        </p>
      </section>
    </main>
  )
}