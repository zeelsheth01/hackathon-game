import Leaderboard from '../models/Leaderboard';

export const getRecentRuns = async (req: any, res: any) => {
  try {
    const leaderboards = await Leaderboard.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name hackerId');
      
    res.json(leaderboards);
  } catch (error) {
    console.error('Failed to fetch recent runs:', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
};

export const getTopScores = async (req: any, res: any) => {
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
};
