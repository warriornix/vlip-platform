import { prisma } from '../lib/prisma';

export class MaintenanceService {
    async addRecord(data: {
        vehicleId: string;
        component: string;
        serviceType: string;
        mileage: number;
        cost: number;
        description?: string;
        severity?: string;
    }) {
        return prisma.maintenanceRecord.create({
            data: {
                ...data,
                severity: data.severity || 'medium',
                performedAt: new Date()
            }
        });
    }
    
    async getHistory(vehicleId: string, ownerId: string) {
        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, ownerId }
        });
        if (!vehicle) throw new Error('Vehicle not found');
        
        return prisma.maintenanceRecord.findMany({
            where: { vehicleId },
            orderBy: { performedAt: 'desc' }
        });
    }
    
    async getPredictiveAnalysis(vehicleId: string, ownerId: string) {
        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, ownerId },
            include: { maintenance: true }
        });
        if (!vehicle) throw new Error('Vehicle not found');
        
        // Calculate health score
        const age = new Date().getFullYear() - vehicle.year;
        let healthScore = 100 - (age * 2);
        
        // Adjust based on maintenance history
        const highSeverityIssues = vehicle.maintenance.filter(r => r.severity === 'high');
        healthScore -= highSeverityIssues.length * 10;
        
        const mediumSeverityIssues = vehicle.maintenance.filter(r => r.severity === 'medium');
        healthScore -= mediumSeverityIssues.length * 5;
        
        healthScore = Math.max(0, Math.min(100, healthScore));
        
        // Component health predictions
        const predictions = {
            engine: Math.max(50, 100 - (age * 5) - (highSeverityIssues.filter(r => r.component === 'engine').length * 15)),
            transmission: Math.max(60, 100 - (age * 4) - (highSeverityIssues.filter(r => r.component === 'transmission').length * 15)),
            brakes: Math.max(65, 100 - (age * 3) - (highSeverityIssues.filter(r => r.component === 'brakes').length * 10)),
            tires: Math.max(70, 100 - (age * 2) - (vehicle.maintenance.filter(r => r.component === 'tires').length * 5)),
            battery: Math.max(60, 100 - (age * 8))
        };
        
        // Generate recommendations
        const recommendations = [];
        if (healthScore < 50) {
            recommendations.push('Immediate service required - vehicle health critical');
        } else if (healthScore < 70) {
            recommendations.push('Schedule maintenance soon');
        } else {
            recommendations.push('Vehicle in good condition - continue regular maintenance');
        }
        
        if (predictions.engine < 70) recommendations.push('Engine inspection recommended');
        if (predictions.brakes < 70) recommendations.push('Brake system check needed');
        if (predictions.tires < 70) recommendations.push('Tire rotation or replacement soon');
        if (predictions.battery < 70) recommendations.push('Battery test recommended');
        
        // Generate maintenance schedule
        const lastMileage = vehicle.maintenance.length > 0 
            ? Math.max(...vehicle.maintenance.map(r => r.mileage))
            : 0;
        
        const schedule = [
            { service: 'Oil Change', dueMiles: lastMileage + 5000, estimatedCost: 75, priority: 'Medium' },
            { service: 'Tire Rotation', dueMiles: lastMileage + 6000, estimatedCost: 40, priority: 'Low' },
            { service: 'Brake Inspection', dueMiles: lastMileage + 10000, estimatedCost: 80, priority: 'Medium' },
            { service: 'Major Service', dueMiles: lastMileage + 30000, estimatedCost: 500, priority: 'High' }
        ];
        
        return {
            vehicle: {
                id: vehicle.id,
                vin: vehicle.vin,
                manufacturer: vehicle.manufacturer,
                model: vehicle.model,
                year: vehicle.year
            },
            healthScore,
            healthStatus: healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Critical',
            predictions,
            recommendations,
            maintenanceSchedule: schedule,
            maintenanceHistory: vehicle.maintenance
        };
    }
}