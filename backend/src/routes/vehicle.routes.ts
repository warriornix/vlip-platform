import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { createVehicle, listVehicles, getVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicle.controller';

const router = Router();

// TEST ROUTE - Remove this later
router.get('/ping', (req, res) => {
    res.json({ message: 'Vehicle routes are working!', timestamp: new Date().toISOString() });
});

router.use(authenticateToken);
router.post('/', createVehicle);
router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;