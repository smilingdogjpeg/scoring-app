import { Router } from 'express';
import prisma from '../lib/db.js';

const router = Router();

// Get all factions with their houses
router.get('/', async (req, res) => {
  try {
    const factions = await prisma.faction.findMany({
      include: {
        members: {
          include: { house: true },
        },
      },
    });
    res.json(factions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch factions' });
  }
});

// Create a new faction (ADMIN ONLY)
router.post('/', async (req, res) => {
  try {
    const { adminPassword } = req.headers;
    if (adminPassword !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { name } = req.body;
    const faction = await prisma.faction.create({ data: { name } });
    res.status(201).json(faction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create faction' });
  }
});

// Add a house to a faction (ADMIN ONLY)
router.post('/join', async (req, res) => {
  try {
    const { adminPassword } = req.headers;
    if (adminPassword !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { factionId, houseId } = req.body;

    const factionMember = await prisma.factionMember.create({
      data: { factionId, houseId },
    });

    res.status(201).json(factionMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to join faction' });
  }
});

// Remove a house from a faction (ADMIN ONLY)
router.post('/leave', async (req, res) => {
  try {
    const { adminPassword } = req.headers;
    if (adminPassword !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { factionId, houseId } = req.body;

    await prisma.factionMember.delete({
      where: { factionId_houseId: { factionId, houseId } },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to leave faction' });
  }
});

// Create faction *and* add houses at same time (ADMIN ONLY)
router.post('/create-with-houses', async (req, res) => {
  const { name, houseIds } = req.body;
  const adminPassword = req.headers.adminpassword;

  if (adminPassword !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: 'Unauthorized' });

  const faction = await prisma.faction.create({
    data: {
      name,
      members: {
        create: houseIds.map(houseId => ({ houseId })),
      },
    },
    include: { members: true },
  });

  res.json(faction);
});

export default router;