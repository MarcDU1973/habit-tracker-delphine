// app/schwimmer/page.tsx
export default function SchwimmerPage() {
    // Platzhalter – hier später echte Daten laden
    const swimmers = [
      { id: 1, name: 'Anna', club: 'Frankfurt', best: '100m Freistil – 00:59.21' },
      { id: 2, name: 'Lukas', club: 'Mainz', best: '200m Rücken – 02:11.54' },
    ]
  
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 text-white">
        <h2 className="text-3xl font-semibold mb-6">Aktive Schwimmer</h2>
        <ul className="grid sm:grid-cols-2 gap-4">
          {swimmers.map(s => (
            <li key={s.id} className="rounded-lg bg-white/10 ring-1 ring-white/20 p-4">
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-white/80">{s.club}</p>
              <p className="mt-2 text-sm">{s.best}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  