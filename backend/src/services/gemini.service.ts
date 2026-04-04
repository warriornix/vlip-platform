import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
    private model: any;
    
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }
    
    // Analyze vehicle health and provide recommendations
    async analyzeVehicleHealth(vehicleData: any, maintenanceHistory: any[]) {
        const prompt = `
            Analyze this vehicle's health data:
            Vehicle: ${vehicleData.manufacturer} ${vehicleData.model} (${vehicleData.year})
            Health Score: ${vehicleData.healthScore}/100
            Maintenance History: ${maintenanceHistory.length} records
            
            Provide:
            1. Short health assessment
            2. Top 3 maintenance priorities
            3. Estimated costs
            4. Urgency level
        `;
        
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
    
    // Generate maintenance recommendations
    async generateMaintenanceRecommendations(vehicle: any, predictions: any) {
        const prompt = `
            For a ${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}:
            Component Health:
            ${predictions.map((p: any) => `- ${p.component}: ${p.currentHealth}%`).join('\n')}
            
            Generate:
            1. Immediate action items
            2. Scheduled maintenance plan for next 6 months
            3. Estimated total cost
            4. Tips to extend vehicle life
        `;
        
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
    
    // Answer user questions about their vehicle
    async answerVehicleQuestion(question: string, vehicleContext: any) {
        const prompt = `
            Vehicle Context:
            - ${vehicleContext.manufacturer} ${vehicleContext.model} (${vehicleContext.year})
            - Current health: ${vehicleContext.healthScore}/100
            - Last service: ${vehicleContext.lastService}
            
            User Question: "${question}"
            
            Provide a helpful, concise answer.
        `;
        
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
    
    // Predict future maintenance needs
    async predictFutureMaintenance(vehicle: any, mileage: number, usagePattern: string) {
        const prompt = `
            Vehicle: ${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}
            Current Mileage: ${mileage.toLocaleString()} miles
            Usage Pattern: ${usagePattern}
            
            Predict:
            1. Next 3 maintenance items due
            2. When they will be due (mileage or time)
            3. Estimated costs
            4. Critical issues to watch for
        `;
        
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
    
    // Generate human-readable health report
    async generateHealthReport(vehicle: any, analysis: any) {
        const prompt = `
            Create a user-friendly health report for:
            Vehicle: ${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}
            Health Score: ${analysis.healthScore}/100
            Status: ${analysis.healthStatus}
            
            Components:
            ${analysis.predictions.map((p: any) => `- ${p.component}: ${p.currentHealth}%`).join('\n')}
            
            Format as a professional report with sections:
            - Executive Summary
            - Component Health Details
            - Recommended Actions
            - Estimated Costs
        `;
        
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
}