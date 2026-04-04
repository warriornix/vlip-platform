import { Server } from 'socket.io';
import http from 'http';

export class WebSocketService {
    private static instance: WebSocketService;
    private io: Server | null = null;
    private vehicleLocations: Map<string, any> = new Map();

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    initialize(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: ['http://localhost:3000', 'http://localhost:3001'],
                credentials: true
            }
        });

        this.io.on('connection', (socket) => {
            console.log('🔌 Client connected:', socket.id);

            socket.on('subscribe-vehicle', (vehicleId: string) => {
                socket.join(`vehicle-${vehicleId}`);
                const currentLocation = this.vehicleLocations.get(vehicleId);
                if (currentLocation) {
                    socket.emit('location-update', { vehicleId, ...currentLocation });
                }
                console.log(`📡 Client subscribed to vehicle ${vehicleId}`);
            });

            socket.on('update-location', (data) => {
                const { vehicleId, lat, lng, speed } = data;
                this.vehicleLocations.set(vehicleId, { 
                    lat, lng, speed, 
                    timestamp: new Date() 
                });
                this.io?.to(`vehicle-${vehicleId}`).emit('location-update', { 
                    vehicleId, lat, lng, speed 
                });
            });

            socket.on('disconnect', () => {
                console.log('🔌 Client disconnected:', socket.id);
            });
        });
    }

    broadcastLocation(vehicleId: string, data: any) {
        this.io?.to(`vehicle-${vehicleId}`).emit('location-update', data);
    }
}