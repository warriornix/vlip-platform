import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
    getFleetStats,
    getMaintenanceTrends,
    getComponentHealth,
    getVehicleRankings,
    getDashboardAnalytics
} from '../controllers/analytics.controller';

const router = Router();

router.use(authenticateToken);
router.get('/fleet-stats', getFleetStats);
router.get('/maintenance-trends', getMaintenanceTrends);
router.get('/component-health', getComponentHealth);
router.get('/vehicle-rankings', getVehicleRankings);
router.get('/dashboard', getDashboardAnalytics);

export default router;