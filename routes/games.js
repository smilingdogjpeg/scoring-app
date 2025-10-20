import express from "express";
import prisma from "../lib/db.js";

const router = express.Router();

// CREATE a new game
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Game name is required" });
    }

    const game = await prisma.game.create({
      data: { name },
    });

    res.status(201).json(game);
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all games
router.get("/", async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      include: {
        scores: true, // includes related scores if any
      },
    });

    res.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a single game by ID
router.get("/:id", async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        scores: {
          include: { house: true }, // shows which house got what score
        },
      },
    });

    if (!game) return res.status(404).json({ error: "Game not found" });

    res.json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a game
router.delete("/:id", async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);

    await prisma.game.delete({
      where: { id: gameId },
    });

    res.json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
