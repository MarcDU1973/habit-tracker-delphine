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
    <main className="min-h-screen flex flex-col items-center justify-center gap-12 text-white">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Schwimmdaten-Analyse</h1>
        <p className="text-white/80">Profile, Bestzeiten und Trainingstimer</p>
        <div className="flex items-center justify-center gap-3">
          <Button href="/schwimmer">Schwimmer anzeigen</Button>
          <Button href="/timer">Trainingstimer erstellen</Button>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="bg-white/10 backdrop-blur rounded-lg p-6 w-full max-w-md">
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
              <span className="text-white/80">{user.points} Punkte</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}