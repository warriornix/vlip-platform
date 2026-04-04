export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'FLEET_MANAGER' | 'DRIVER';
    createdAt: string;
    updatedAt?: string;
}

export interface Vehicle {
    id: number;
    vin: string;
    manufacturer: string;
    model: string;
    year: number;
    ownerId: number;
    createdAt: string;
    updatedAt: string;
    certificates?: Certificate[];
}

export interface Certificate {
    id: number;
    certificateId: string;
    vehicleId: number;
    issuedTo: number;
    issuedAt: string;
    status: string;
    hash: string;
    blockchainHash: string;
    vehicleInfo?: {
        vin: string;
        manufacturer: string;
        model: string;
        year: number;
    };
}

export interface MaintenanceRecord {
    id: number;
    vehicleId: number;
    component: string;
    serviceType: string;
    mileage: number;
    cost: number;
    description: string;
    severity: string;
    performedAt: string;
}

export interface PredictiveAnalysis {
    healthScore: number;
    healthStatus: string;
    predictions: Prediction[];
    maintenanceSchedule: ScheduleItem[];
    recommendations: string[];
    vehicle: {
        id: number;
        vin: string;
        manufacturer: string;
        model: string;
        year: number;
    };
}

export interface Prediction {
    component: string;
    currentHealth: number;
    predictedIssues: string[];
    recommendedAction: string;
    urgency: string;
    estimatedCost: number;
}

export interface ScheduleItem {
    service: string;
    intervalMiles: number;
    nextDueMiles: number;
    milesRemaining: number;
    estimatedCost: number;
    priority: string;
}