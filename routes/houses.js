import express from 'express';
import prisma from '../lib/db.js';

const router = express.Router();

// helper to map Prisma House (+scores) to IHouse
function toIHouse(house) {
  const base = {
    id: house.id,
    name: house.name,
    motto: house.motto,
    crestUrl: house.crestUrl || undefined,
    strength: house.strength,
    weakness: house.weakness,
    password: house.password,
  };

  if (!house.scores || house.scores.length === 0) {
    return base;
  }

  const score = house.scores.reduce(
    (acc, s) => {
      acc.choleric    += s.choleric;
      acc.phlegmatic  += s.phlegmatic;
      acc.melancholic += s.melancholic;
      acc.sanguine    += s.sanguine;
      return acc;
    },
    { choleric: 0, phlegmatic: 0, melancholic: 0, sanguine: 0 }
  );

  return { ...base, score };
}

// GET /api/houses → Array<IHouse>
router.get('/', async (req, res) => {
  try {
    const houses = await prisma.house.findMany({
      include: { scores: true, faction: true },
      orderBy: { id: 'asc' },
    });

    const result = houses.map(toIHouse);
    res.json(result);
  } catch (err) {
    console.error('Error fetching houses', err);
    res.status(500).json({ error: 'Failed to fetch houses' });
  }
});

// GET /api/houses/:id → IHouse
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const house = await prisma.house.findUnique({
      where: { id },
      include: { scores: true, faction: true },
    });

    if (!house) return res.status(404).json({ error: 'House not found' });

    res.json(toIHouse(house));
  } catch (err) {
    console.error('Error fetching house', err);
    res.status(500).json({ error: 'Failed to fetch house' });
  }
});

// POST /api/houses → create new house (IPostHouse)
router.post('/', async (req, res) => {
  try {
    const { name, motto, crestUrl, strength, weakness, password } = req.body;

    if (!name || !motto || !strength || !weakness || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (strength === weakness) {
      return res.status(400).json({ error: 'Strength and weakness cannot be the same' });
    }

    const house = await prisma.house.create({
      data: {
        name,
        motto,
        crestUrl: crestUrl || null,
        strength,
        weakness,
        password,
      },
    });

    // no scores yet → same as mock: score is omitted
    res.status(201).json(toIHouse({ ...house, scores: [] }));
  } catch (err) {
    console.error('Error creating house', err);
    res.status(500).json({ error: 'Failed to create house' });
  }
});

// PATCH /api/houses/:id → edit house (IPostHouse-like)
// For now, simple protection:
// - if header x-admin-password === ADMIN_PASSWORD → no house password check
// - else require correct house password in body.currentPassword
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const {
    name,
    motto,
    crestUrl,
    strength,
    weakness,
    password,        // new password?
    currentPassword, // for verification (non-admin)
  } = req.body;

  try {
    const house = await prisma.house.findUnique({ where: { id } });
    if (!house) return res.status(404).json({ error: 'House not found' });

    const isAdmin = req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;

    if (!isAdmin) {
      if (!currentPassword || currentPassword !== house.password) {
        return res.status(403).json({ error: 'Incorrect house password' });
      }
    }

    if (strength && weakness && strength === weakness) {
      return res.status(400).json({ error: 'Strength and weakness cannot be the same' });
    }

    const updated = await prisma.house.update({
      where: { id },
      data: {
        name: name ?? house.name,
        motto: motto ?? house.motto,
        crestUrl: crestUrl ?? house.crestUrl,
        strength: strength ?? house.strength,
        weakness: weakness ?? house.weakness,
        password: password ?? house.password,
      },
      include: { scores: true },
    });

    res.json(toIHouse(updated));
  } catch (err) {
    console.error('Error updating house', err);
    res.status(500).json({ error: 'Failed to update house' });
  }
});

// DELETE /api/houses/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    // optional: admin-only delete
    const isAdmin = req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;
    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin password required' });
    }

    // remove scores first to satisfy foreign key constraints
    await prisma.score.deleteMany({ where: { houseId: id } });
    await prisma.house.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting house', err);
    res.status(500).json({ error: 'Failed to delete house' });
  }
});

export default router;
