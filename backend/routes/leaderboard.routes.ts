import express from 'express';
import { getRecentRuns, getTopScores } from '../controllers/leaderboard.controller';

const router = express.Router();

router.get('/recent', getRecentRuns);
router.get('/top', getTopScores);

export default router;
