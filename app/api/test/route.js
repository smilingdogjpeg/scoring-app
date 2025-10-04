import prisma from '@/lib/db'

export async function GET() {
  const house = await prisma.house.create({
    data: {
      name: 'Test House',
      joinCode: 'TEST1234'
    },
  })
  return Response.json(house)
}
