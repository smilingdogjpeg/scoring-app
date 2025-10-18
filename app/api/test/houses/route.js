import prisma from '@/lib/db'

export async function GET() {
  const houses = await prisma.house.findMany({
    include: { scores: true },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(houses)
}

export async function POST(req) {
  const body = await req.json()
  const { name, crestUrl } = body

  // Generate join code 
  const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  const house = await prisma.house.create({
    data: { name, crestUrl, joinCode },
  })

  return Response.json(house)
}
