import { WebSocketService } from './websocket.service';

export class OBD2Simulator {
    private static instance: OBD2Simulator;
    private intervals: Map<string, NodeJS.Timeout> = new Map();

    static getInstance() {
        if (!OBD2Simulator.instance) {
            OBD2Simulator.instance = new OBD2Simulator();
        }
        return OBD2Simulator.instance;
    }

    startSimulating(vehicleId: string) {
        if (this.intervals.has(vehicleId)) return;

        const interval = setInterval(() => {
            const data = {
                vehicleId,
                speed: Math.floor(Math.random() * 120),
                rpm: 800 + Math.floor(Math.random() * 4000),
                engineTemp: 80 + Math.random() * 30,
                fuelLevel: Math.random() * 100,
                batteryVoltage: 12 + Math.random() * 3,
                timestamp: new Date()
            };

            const wsService = WebSocketService.getInstance();
            wsService.broadcastLocation(vehicleId, data);
            console.log(`📡 OBD2 Data for vehicle ${vehicleId}: ${data.speed} km/h`);
        }, 5000);

        this.intervals.set(vehicleId, interval);
    }

    stopSimulating(vehicleId: string) {
        const interval = this.intervals.get(vehicleId);
        if (interval) {
            clearInterval(interval);
            this.intervals.delete(vehicleId);
        }
    }
}