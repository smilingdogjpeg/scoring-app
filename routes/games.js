import express from 'express';
import prisma from '../lib/db.js';

const router = express.Router();

// helper: map to IGame
function toIGame(game, houseMap) {
  return {
    id: game.id,
    name: game.name,
    description: game.description || undefined,
    scores: game.scores.map(s => ({
      houseId: s.houseId,
      houseName: houseMap.get(s.houseId),
      score: {
        choleric: s.choleric,
        phlegmatic: s.phlegmatic,
        melancholic: s.melancholic,
        sanguine: s.sanguine,
      },
    })),
  };
}

// GET /api/games → Array<IGame>
router.get('/', async (req, res) => {
  try {
    const [games, houses] = await Promise.all([
      prisma.game.findMany({
        include: { scores: true },
        orderBy: { id: 'asc' },
      }),
      prisma.house.findMany(),
    ]);

    const houseMap = new Map(houses.map(h => [h.id, h.name]));

    const result = games.map(game => toIGame(game, houseMap));
    res.json(result);
  } catch (err) {
    console.error('Error fetching games', err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// POST /api/games → IPostGame (name, scores[], description?)
router.post('/', async (req, res) => {
  try {
    const { name, description, scores } = req.body;

    if (!name || !Array.isArray(scores) || scores.length === 0) {
      return res.status(400).json({ error: 'name and scores[] are required' });
    }

    const game = await prisma.game.create({
      data: {
        name,
        description: description || null,
      },
    });

    // create score rows
    const scoreCreates = scores.map((s) => ({
      houseId: s.houseId,
      gameId: game.id,
      choleric: s.score.choleric,
      phlegmatic: s.score.phlegmatic,
      melancholic: s.score.melancholic,
      sanguine: s.score.sanguine,
    }));

    await prisma.score.createMany({ data: scoreCreates });

    // reload with scores for response
    const [savedGame, houses] = await Promise.all([
      prisma.game.findUnique({
        where: { id: game.id },
        include: { scores: true },
      }),
      prisma.house.findMany(),
    ]);

    const houseMap = new Map(houses.map(h => [h.id, h.name]));

    res.status(201).json(toIGame(savedGame, houseMap));
  } catch (err) {
    console.error('Error creating game', err);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// DELETE /api/games/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    await prisma.score.deleteMany({ where: { gameId: id } });
    await prisma.game.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting game', err);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

export default router;
