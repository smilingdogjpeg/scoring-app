import prisma from '@/lib/db'

export async function POST(req) {
  const { adminKey, houseId, choleric, melancholic, sanguine, phlegmatic, gameDay } = await req.json()

  if (adminKey !== process.env.ADMIN_KEY)
    return new Response('Unauthorized', { status: 401 })

  const score = await prisma.score.create({
    data: { houseId, choleric, melancholic, sanguine, phlegmatic, gameDay },
  })

  return Response.json(score)
}
