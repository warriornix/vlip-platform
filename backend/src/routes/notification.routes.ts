import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/status', authenticateToken, (req, res) => {
    res.json({ status: 'active', schedulerRunning: true });
});

export default router;