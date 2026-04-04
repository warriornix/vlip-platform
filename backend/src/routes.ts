import { Router } from 'express';
import { createVehicle, listVehicles, getVehicle, updateVehicle, deleteVehicle } from './controllers/vehicle.controller';
import { authenticateToken } from './middleware/auth.middleware';

const router = Router();

// Auth routes (to be imported from auth.routes)
// Vehicle routes
router.post('/vehicles', authenticateToken, createVehicle);
router.get('/vehicles', authenticateToken, listVehicles);
router.get('/vehicles/:id', authenticateToken, getVehicle);
router.put('/vehicles/:id', authenticateToken, updateVehicle);
router.delete('/vehicles/:id', authenticateToken, deleteVehicle);

export default router;