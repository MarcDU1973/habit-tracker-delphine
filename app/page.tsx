// app/page.tsx
export default function Home() {
  const leaderboard = [
    { name: "Anna", points: 42 },
    { name: "Ben", points: 37 },
    { name: "Clara", points: 29 },
    { name: "David", points: 25 },
    { name: "Eva", points: 20 },
  ]

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