// routes/members.js
import { Router } from 'express';
import prisma from '../lib/db.js';

const router = Router();

// Create (join) a member to a house
router.post('/join', async (req, res) => {
  try {
    const { name, clientId, joinCode } = req.body;

    // find the house via joinCode
    const house = await prisma.house.findUnique({
      where: { joinCode },
    });

    if (!house) return res.status(404).json({ error: 'House not found' });

    // add member
    const member = await prisma.member.create({
      data: {
        name,
        clientId,
        houseId: house.id,
      },
    });

    res.status(201).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to join house' });
  }
});

// Get members of a specific house
router.get('/:houseId', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      where: { houseId: req.params.houseId },
    });
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get members' });
  }
});

export default router;
