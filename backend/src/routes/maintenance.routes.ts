import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

const router = Router();

// Add maintenance record
router.post('/records', authenticateToken, async (req, res) => {
    try {
        const { vehicleId, component, serviceType, mileage, cost, description, severity } = req.body;
        const userId = (req as any).user.id;
        
        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, ownerId: userId }
        });
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        const record = await prisma.maintenanceRecord.create({
            data: {
                vehicleId,
                component,
                serviceType,
                mileage,
                cost,
                description,
                severity: severity || 'medium',
                performedAt: new Date()
            }
        });
        
        res.status(201).json({ success: true, record });
    } catch (error) {
        console.error('Add maintenance error:', error);
        res.status(500).json({ error: 'Failed to add maintenance record' });
    }
});

// Get maintenance history
router.get('/history/:vehicleId', authenticateToken, async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const userId = (req as any).user.id;
        
        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, ownerId: userId }
        });
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        const records = await prisma.maintenanceRecord.findMany({
            where: { vehicleId },
            orderBy: { performedAt: 'desc' }
        });
        
        res.json({ success: true, records });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Get predictive analysis
router.get('/predictive/:vehicleId', authenticateToken, async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const userId = (req as any).user.id;
        
        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, ownerId: userId },
            include: { maintenance: true }
        });
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        const age = new Date().getFullYear() - vehicle.year;
        let healthScore = 100 - (age * 2);
        
        const highSeverityIssues = vehicle.maintenance.filter(r => r.severity === 'high');
        healthScore -= highSeverityIssues.length * 10;
        
        healthScore = Math.max(0, Math.min(100, healthScore));
        
        const predictions = {
            engine: Math.max(50, 100 - (age * 5)),
            transmission: Math.max(60, 100 - (age * 4)),
            brakes: Math.max(65, 100 - (age * 3)),
            tires: Math.max(70, 100 - (age * 2)),
            battery: Math.max(60, 100 - (age * 8))
        };
        
        const recommendations = [];
        if (healthScore < 50) {
            recommendations.push('Immediate service required');
        } else if (healthScore < 70) {
            recommendations.push('Schedule maintenance soon');
        } else {
            recommendations.push('Vehicle in good condition');
        }
        
        const schedule = [
            { service: 'Oil Change', dueMiles: 5000, estimatedCost: 75, priority: 'Medium' },
            { service: 'Tire Rotation', dueMiles: 6000, estimatedCost: 40, priority: 'Low' },
            { service: 'Brake Inspection', dueMiles: 10000, estimatedCost: 80, priority: 'Medium' }
        ];
        
        res.json({
            success: true,
            analysis: {
                healthScore,
                healthStatus: healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Fair',
                predictions,
                recommendations,
                maintenanceSchedule: schedule
            }
        });
    } catch (error) {
        console.error('Predictive analysis error:', error);
        res.status(500).json({ error: 'Failed to generate analysis' });
    }
});

export default router;