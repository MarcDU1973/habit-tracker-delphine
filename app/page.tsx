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



export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="text-center text-white space-y-6">
        <h1 className="text-4xl font-bold">Schwimmdaten-Analyse</h1>
        <p className="text-white/80">Profile, Bestzeiten und Trainingstimer</p>
        <div className="flex items-center justify-center gap-3">
          <Button href="/schwimmer">Schwimmer anzeigen</Button>
          <Button href="/timer">Trainingstimer erstellen</Button>
        </div>
      </section>
    </main>
  )
}


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Habit Tracker 🏊‍♂️</h1>
      <p className="text-gray-700 mb-8">
        Willkommen! Erfasse deine täglichen Schwimm-Habits und vergleiche dich mit anderen.
      </p>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <ul>
          {leaderboard.map((user, index) => (
            <li
              key={user.name}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <span className="font-medium">
                {index + 1}. {user.name}
              </span>
              <span className="text-gray-600">{user.points} Punkte</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}