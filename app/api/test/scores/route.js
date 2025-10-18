import prisma from '@/lib/db'

export async function POST(req) {
  const { joinCode, name, clientId } = await req.json()

  const house = await prisma.house.findUnique({ where: { joinCode } })
  if (!house) return new Response('House not found', { status: 404 })

  const member = await prisma.member.create({
    data: {
      name,
      clientId,
      houseId: house.id,
    },
  })

  return Response.json(member)
}
