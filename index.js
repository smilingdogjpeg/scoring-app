import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './lib/db.js';
import housesRouter from './routes/houses.js';
import membersRouter from './routes/members.js';
import scoresRouter from './routes/scores.js';
import factionsRouter from './routes/factions.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/houses', housesRouter);
app.use('/api/members', membersRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/factions', factionsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
