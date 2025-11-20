import express from 'express';
import prisma from '../lib/db.js';

const router = express.Router();

// helper to map to frontend shape: { id, name, motto, houseIds }
function toIFaction(faction) {
  return {
    id: faction.id,
    name: faction.name,
    motto: faction.motto,
    houseIds: faction.houses.map(h => h.id),
  };
}

// GET /api/factions → Array<IFaction & {id}>
router.get('/', async (req, res) => {
  try {
    const factions = await prisma.faction.findMany({
      include: { houses: true },
      orderBy: { id: 'asc' },
    });

    res.json(factions.map(toIFaction));
  } catch (err) {
    console.error('Error fetching factions', err);
    res.status(500).json({ error: 'Failed to fetch factions' });
  }
});

// POST /api/factions → IFaction ({ name, motto, houseIds })
router.post('/', async (req, res) => {
  try {
    const { name, motto, houseIds } = req.body;

    if (!name || !motto || !Array.isArray(houseIds) || houseIds.length === 0) {
      return res.status(400).json({ error: 'name, motto and houseIds are required' });
    }

    const faction = await prisma.faction.create({
      data: {
        name,
        motto,
      },
    });

    // attach houses to this faction
    await prisma.house.updateMany({
      where: { id: { in: houseIds } },
      data: { factionId: faction.id },
    });

    const withHouses = await prisma.faction.findUnique({
      where: { id: faction.id },
      include: { houses: true },
    });

    res.status(201).json(toIFaction(withHouses));
  } catch (err) {
    console.error('Error creating faction', err);
    res.status(500).json({ error: 'Failed to create faction' });
  }
});

// DELETE /api/factions/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    // detach houses
    await prisma.house.updateMany({
      where: { factionId: id },
      data: { factionId: null },
    });

    await prisma.faction.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting faction', err);
    res.status(500).json({ error: 'Failed to delete faction' });
  }
});

export default router;
