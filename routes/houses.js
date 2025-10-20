import { Router } from 'express';
import prisma from '../lib/db.js';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const houses = await prisma.house.findMany();
    res.json(houses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch houses' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, crestUrl } = req.body;
    const newHouse = await prisma.house.create({
      data: {
        name,
        crestUrl,
        joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      },
    });
    res.status(201).json(newHouse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create house' });
  }
});

export default router;
