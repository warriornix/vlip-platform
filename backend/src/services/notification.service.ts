import { prisma } from '../lib/prisma';
import { EmailService } from './email.service';
import { MaintenanceService } from './maintenance.service';

export class NotificationService {
    private static instance: NotificationService;
    private checkInterval: NodeJS.Timeout | null = null;

    static getInstance() {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    start() {
        if (this.checkInterval) return;
        
        this.checkInterval = setInterval(async () => {
            await this.checkMaintenanceReminders();
            await this.checkHealthAlerts();
        }, 60 * 60 * 1000);
        
        console.log('✅ Notification scheduler started (checking every hour)');
    }

    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            console.log('⏹️ Notification scheduler stopped');
        }
    }

    async checkMaintenanceReminders() {
        try {
            const vehicles = await prisma.vehicle.findMany({
                include: {
                    owner: true,
                    maintenance: true
                }
            });

            let remindersSent = 0;

            for (const vehicle of vehicles) {
                const maintenanceService = new MaintenanceService();
                const analysis = await maintenanceService.getPredictiveAnalysis(vehicle.id, vehicle.ownerId);
                
                const dueServices = analysis.maintenanceSchedule.filter((s: any) => s.dueMiles <= 50000);
                
                if (dueServices.length > 0) {
                    await EmailService.sendMaintenanceReminder(
                        vehicle.owner.email,
                        vehicle.owner.name,
                        vehicle,
                        dueServices
                    );
                    remindersSent++;
                    console.log(`📧 Maintenance reminder sent for ${vehicle.manufacturer} ${vehicle.model}`);
                }
            }
            
            if (remindersSent > 0) {
                console.log(`📧 Sent ${remindersSent} maintenance reminders`);
            }
        } catch (error) {
            console.error('Error checking maintenance reminders:', error);
        }
    }

    async checkHealthAlerts() {
        try {
            const vehicles = await prisma.vehicle.findMany({
                include: {
                    owner: true
                }
            });

            let alertsSent = 0;

            for (const vehicle of vehicles) {
                const maintenanceService = new MaintenanceService();
                const analysis = await maintenanceService.getPredictiveAnalysis(vehicle.id, vehicle.ownerId);
                
                if (analysis.healthScore < 70) {
                    await EmailService.sendHealthAlert(
                        vehicle.owner.email,
                        vehicle.owner.name,
                        vehicle,
                        analysis.healthScore
                    );
                    alertsSent++;
                    console.log(`⚠️ Health alert sent for ${vehicle.manufacturer} ${vehicle.model} (Score: ${analysis.healthScore})`);
                }
            }
            
            if (alertsSent > 0) {
                console.log(`⚠️ Sent ${alertsSent} health alerts`);
            }
        } catch (error) {
            console.error('Error checking health alerts:', error);
        }
    }

    async triggerCheck() {
        console.log('🔔 Manually triggering notification check...');
        await this.checkMaintenanceReminders();
        await this.checkHealthAlerts();
        console.log('✅ Notification check completed');
    }
}