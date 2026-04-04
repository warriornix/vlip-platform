import { WebSocketService } from './websocket.service';

interface OBD2Data {
    vehicleId: string;
    speed: number;
    rpm: number;
    engineTemp: number;
    fuelLevel: number;
    batteryVoltage: number;
    errorCodes: string[];
}

export class OBD2Service {
    private static instance: OBD2Service;
    private vehicleData: Map<string, OBD2Data> = new Map();
    private wsService: WebSocketService;

    static getInstance() {
        if (!OBD2Service.instance) {
            OBD2Service.instance = new OBD2Service();
        }
        return OBD2Service.instance;
    }

    constructor() {
        this.wsService = WebSocketService.getInstance();
        // Simulate OBD2 data updates every 5 seconds
        setInterval(() => this.simulateOBD2Data(), 5000);
    }

    private simulateOBD2Data() {
        // Generate random OBD2 data for vehicles (in production, this would come from actual OBD2 devices)
        const vehicles = ['1', '2', '3']; // Add actual vehicle IDs
        vehicles.forEach(vehicleId => {
            const data: OBD2Data = {
                vehicleId,
                speed: Math.random() * 120,
                rpm: 800 + Math.random() * 4000,
                engineTemp: 80 + Math.random() * 30,
                fuelLevel: Math.random() * 100,
                batteryVoltage: 12 + Math.random() * 3,
                errorCodes: Math.random() > 0.9 ? ['P0300', 'P0420'] : []
            };
            this.vehicleData.set(vehicleId, data);
            
            // Send via WebSocket
            this.wsService['io']?.to(`vehicle-${vehicleId}`).emit('obd2-data', data);
            
            // Check for anomalies
            if (data.engineTemp > 110) {
                this.wsService['io']?.to(`vehicle-${vehicleId}`).emit('alert', {
                    type: 'overheating',
                    message: `Engine temperature is ${data.engineTemp}°C`,
                    severity: 'high'
                });
            }
        });
    }

    getVehicleData(vehicleId: string): OBD2Data | undefined {
        return this.vehicleData.get(vehicleId);
    }
}