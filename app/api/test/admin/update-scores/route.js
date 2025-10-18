import prisma from '@/lib/db';

export async function POST(req) {
  const { adminKey, houseId, scores } = await req.json();

  if (adminKey !== process.env.ADMIN_PASSWORD) {
    return new Response('Unauthorized', { status: 401 });
  }

  const updated = await prisma.score.create({
    data: { houseId, ...scores },
  });

  return Response.json(updated);
}
