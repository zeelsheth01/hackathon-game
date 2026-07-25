import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local if present, else .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

import { connectToDatabase } from './config/mongodb';

connectToDatabase();

// API Routes (to be mounted)
import gameRoutes from './routes/game.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
// import githubRoutes from './routes/github.routes';

app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/github', githubRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
