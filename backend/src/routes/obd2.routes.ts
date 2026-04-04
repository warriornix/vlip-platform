import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { OBD2Simulator } from '../services/obd2-simulator.service';

const router = Router();
const obd2Simulator = OBD2Simulator.getInstance();

router.post('/simulate/:vehicleId', authenticateToken, (req, res) => {
    const { vehicleId } = req.params;
    obd2Simulator.startSimulating(vehicleId);
    res.json({ success: true, message: `OBD2 simulation started for vehicle ${vehicleId}` });
});

router.delete('/simulate/:vehicleId', authenticateToken, (req, res) => {
    const { vehicleId } = req.params;
    obd2Simulator.stopSimulating(vehicleId);
    res.json({ success: true, message: `OBD2 simulation stopped for vehicle ${vehicleId}` });
});

export default router;