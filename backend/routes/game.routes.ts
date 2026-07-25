import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { linkRepo, scoreGame } from '../controllers/game.controller';

const router = express.Router();

router.post('/link-repo', authMiddleware, linkRepo);
router.post('/score', authMiddleware, scoreGame);

export default router;
