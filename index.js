import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import houseRoutes from './routes/houses.js';
import factionRoutes from './routes/factions.js';
import gameRoutes from './routes/games.js';

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api/houses', houseRoutes);
app.use('/api/factions', factionRoutes);
app.use('/api/games', gameRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
