import prisma from "../../../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name } = req.body;
  const joinCode = Math.random().toString(36).substring(2, 8);

  try {
    const house = await prisma.house.create({
      data: { name, joinCode },
    });
    res.status(200).json(house);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create house" });
  }
}
