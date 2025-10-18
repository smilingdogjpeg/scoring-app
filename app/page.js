async function getHouses() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/houses`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function HomePage() {
  const houses = await getHouses()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">🏠 House Leaderboard</h1>
      <ul>
        {houses.map((h) => {
          const total = h.scores.reduce(
            (sum, s) => sum + s.choleric + s.melancholic + s.sanguine + s.phlegmatic,
            0
          )
          return (
            <li key={h.id}>
              {h.name} — {total} points
            </li>
          )
        })}
      </ul>
    </main>
  )
}
