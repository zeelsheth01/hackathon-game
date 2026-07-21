import express from 'express';
import Leaderboard from '../models/Leaderboard';

const router = express.Router();

router.get('/recent', async (req, res) => {
  try {
    const leaderboards = await Leaderboard.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name hackerId'); // like include: { user: ... }
      
    res.json(leaderboards);
  } catch (error) {
    console.error('Failed to fetch recent runs:', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

router.get('/top', async (req, res) => {
  try {
    const scores = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(50)
      .populate('userId', 'name hackerId');
      
    res.json(scores);
  } catch (error) {
    console.error('Failed to fetch top scores:', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

export default router;
