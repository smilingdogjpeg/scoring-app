import { Router } from 'express';
import prisma from '../lib/db.js';

const router = Router();

// Get all scores (for leaderboard)
router.get('/', async (req, res) => {
  try {
    const scores = await prisma.score.findMany({
      include: { house: true },
    });
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// Update or add score for a house (ADMIN ONLY)
router.post('/update', async (req, res) => {
  try {
    const { adminPassword } = req.headers;
    if (adminPassword !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { houseId, gameDay, choleric, melancholic, sanguine, phlegmatic } =
      req.body;

    const newScore = await prisma.score.create({
      data: {
        houseId,
        gameDay,
        choleric,
        melancholic,
        sanguine,
        phlegmatic,
      },
    });

    res.status(201).json(newScore);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

export default router;
