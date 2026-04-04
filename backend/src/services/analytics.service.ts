import { prisma } from '../lib/prisma';

export class AnalyticsService {
    async getFleetStats(userId: string) {
        const vehicles = await prisma.vehicle.findMany({
            where: { ownerId: userId },
            include: { maintenance: true }
        });

        const totalVehicles = vehicles.length;
        let totalMaintenanceCost = 0;
        let totalMileage = 0;

        vehicles.forEach(v => {
            v.maintenance.forEach(m => {
                totalMaintenanceCost += m.cost;
            });
            // Get latest mileage from maintenance records
            const latestMaint = v.maintenance.sort((a, b) => b.mileage - a.mileage)[0];
            if (latestMaint) totalMileage += latestMaint.mileage;
        });

        // Calculate average health score
        let totalHealthScore = 0;
        for (const vehicle of vehicles) {
            const maintenanceService = new (require('./maintenance.service').MaintenanceService)();
            const analysis = await maintenanceService.getPredictiveAnalysis(vehicle.id, userId);
            totalHealthScore += analysis.healthScore;
        }
        
        const averageHealthScore = totalVehicles ? totalHealthScore / totalVehicles : 0;

        return {
            totalVehicles,
            totalMaintenanceCost,
            averageMaintenanceCost: totalVehicles ? totalMaintenanceCost / totalVehicles : 0,
            totalMileage,
            averageMileage: totalVehicles ? totalMileage / totalVehicles : 0,
            averageHealthScore: Math.round(averageHealthScore)
        };
    }

    async getMaintenanceTrends(userId: string) {
        const records = await prisma.maintenanceRecord.findMany({
            where: {
                vehicle: { ownerId: userId }
            },
            orderBy: { performedAt: 'asc' }
        });

        // Group by month
        const monthlyData: { [key: string]: { cost: number; count: number } } = {};
        
        records.forEach(record => {
            const month = record.performedAt.toISOString().slice(0, 7);
            if (!monthlyData[month]) {
                monthlyData[month] = { cost: 0, count: 0 };
            }
            monthlyData[month].cost += record.cost;
            monthlyData[month].count++;
        });

        const trends = Object.entries(monthlyData).map(([month, data]) => ({
            month,
            totalCost: data.cost,
            recordCount: data.count,
            averageCost: data.cost / data.count
        }));

        return trends.sort((a, b) => a.month.localeCompare(b.month));
    }

    async getComponentHealth(userId: string) {
        const vehicles = await prisma.vehicle.findMany({
            where: { ownerId: userId },
            include: { maintenance: true }
        });

        const componentHealth: { [key: string]: number } = {
            engine: 100,
            transmission: 100,
            brakes: 100,
            tires: 100,
            battery: 100
        };

        vehicles.forEach(vehicle => {
            const age = new Date().getFullYear() - vehicle.year;
            
            // Age impact
            componentHealth.engine -= age * 2;
            componentHealth.transmission -= age * 1.5;
            componentHealth.brakes -= age * 1;
            componentHealth.tires -= age * 0.5;
            componentHealth.battery -= age * 3;

            // Maintenance impact
            vehicle.maintenance.forEach(m => {
                const component = m.component as keyof typeof componentHealth;
                if (componentHealth[component]) {
                    if (m.severity === 'high') {
                        componentHealth[component] -= 15;
                    } else if (m.severity === 'medium') {
                        componentHealth[component] -= 5;
                    }
                }
            });
        });

        // Ensure values are between 0 and 100
        Object.keys(componentHealth).forEach(key => {
            componentHealth[key] = Math.max(0, Math.min(100, Math.round(componentHealth[key])));
        });

        return componentHealth;
    }

    async getVehicleRankings(userId: string) {
        const vehicles = await prisma.vehicle.findMany({
            where: { ownerId: userId },
            include: { maintenance: true }
        });

        const rankings = [];
        
        for (const vehicle of vehicles) {
            const maintenanceService = new (require('./maintenance.service').MaintenanceService)();
            const analysis = await maintenanceService.getPredictiveAnalysis(vehicle.id, userId);
            
            const totalCost = vehicle.maintenance.reduce((sum, m) => sum + m.cost, 0);
            
            rankings.push({
                id: vehicle.id,
                name: `${vehicle.manufacturer} ${vehicle.model}`,
                year: vehicle.year,
                healthScore: Math.round(analysis.healthScore),
                maintenanceCount: vehicle.maintenance.length,
                totalMaintenanceCost: totalCost,
                averageCostPerService: vehicle.maintenance.length ? totalCost / vehicle.maintenance.length : 0
            });
        }

        return rankings.sort((a, b) => b.healthScore - a.healthScore);
    }

    async getDashboardAnalytics(userId: string) {
        const [stats, trends, health, rankings] = await Promise.all([
            this.getFleetStats(userId),
            this.getMaintenanceTrends(userId),
            this.getComponentHealth(userId),
            this.getVehicleRankings(userId)
        ]);
        
        return {
            fleetStats: stats,
            maintenanceTrends: trends,
            componentHealth: health,
            vehicleRankings: rankings,
            lastUpdated: new Date().toISOString()
        };
    }
}