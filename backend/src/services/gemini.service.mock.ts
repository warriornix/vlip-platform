// Mock AI Service - Use this while waiting for API key
export class GeminiService {
    async analyzeVehicleHealth(vehicleData: any, maintenanceHistory: any[]) {
        // Intelligent mock responses based on vehicle data
        const healthScore = vehicleData.healthScore || 85;
        
        if (healthScore >= 80) {
            return `✅ Your ${vehicleData.manufacturer} ${vehicleData.model} is in excellent condition!
            
Health Assessment: Excellent (${healthScore}/100)
- All systems operating within normal parameters
- No immediate maintenance required

Recommendations:
1. Continue regular oil changes every 5,000 miles
2. Schedule tire rotation at next service
3. Monitor brake pads during routine checks

Estimated Costs: $50-100 for routine maintenance`;
        } else if (healthScore >= 60) {
            return `⚠️ Your ${vehicleData.manufacturer} ${vehicleData.model} needs attention soon.

Health Assessment: Fair (${healthScore}/100)
- Some components showing wear
- Scheduled maintenance approaching

Recommendations:
1. Schedule oil change within next 1,000 miles
2. Have brakes inspected
3. Check tire pressure and tread depth

Estimated Costs: $150-300 for upcoming services`;
        } else {
            return `🔴 Your ${vehicleData.manufacturer} ${vehicleData.model} requires immediate attention!

Health Assessment: Poor (${healthScore}/100)
- Critical components need inspection
- Delayed maintenance detected

Urgent Actions:
1. Schedule service appointment immediately
2. Check engine light may appear soon
3. Review ${maintenanceHistory.length} past service records

Estimated Costs: $500-1,200 for repairs`;
        }
    }
    
    async generateMaintenanceSchedule(vehicle: any, currentMileage: number) {
        return `📅 12-Month Maintenance Schedule for ${vehicle.year} ${vehicle.manufacturer} ${vehicle.model}

Current Mileage: ${currentMileage.toLocaleString()} miles

Next 6 Months:
• Month 1-2: Oil Change ($75) - Due at ${(currentMileage + 5000).toLocaleString()} miles
• Month 3-4: Tire Rotation ($40) - Due at ${(currentMileage + 6000).toLocaleString()} miles
• Month 5-6: Brake Inspection ($80) - Due at ${(currentMileage + 10000).toLocaleString()} miles

Months 7-12:
• Month 7-8: Engine Air Filter ($35)
• Month 9-10: Coolant Flush ($120)
• Month 11-12: Major Service ($500)

Total Estimated Annual Cost: $850-1,000`;
    }
    
    async answerVehicleQuestion(question: string, vehicleContext: any) {
        const q = question.toLowerCase();
        
        if (q.includes('oil change')) {
            return `For your ${vehicleContext.year} ${vehicleContext.manufacturer} ${vehicleContext.model}, oil changes are recommended every 5,000-7,500 miles. Based on average driving conditions, you should change the oil every 6 months or 5,000 miles, whichever comes first. Estimated cost: $50-80.`;
        }
        else if (q.includes('brake')) {
            return `Brake pads typically last 30,000-50,000 miles. Signs you need brake service include squeaking noises, vibration when braking, or a soft brake pedal. For your vehicle, we recommend inspection every 10,000 miles. Estimated cost for brake service: $150-300 per axle.`;
        }
        else if (q.includes('tire')) {
            return `Tire rotation should be done every 6,000-8,000 miles to ensure even wear. Check tire pressure monthly. Your ${vehicleContext.model} uses ${vehicleContext.year === 2023 ? '225/50R17' : '215/55R16'} tires. Rotation cost: $30-50. New tires: $600-800 per set.`;
        }
        else if (q.includes('battery')) {
            return `Car batteries typically last 3-5 years. Signs of battery issues: slow cranking, dim lights, corrosion on terminals. For your vehicle, a new battery costs $150-250 including installation.`;
        }
        else if (q.includes('health') || q.includes('condition')) {
            const score = vehicleContext.healthScore || 85;
            return `Your vehicle's overall health score is ${score}/100. This is ${score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'fair'} condition. ${score >= 80 ? 'Continue regular maintenance to keep it this way.' : 'Schedule service soon to improve health score.'}`;
        }
        else {
            return `I'm your AI vehicle assistant! I can help you with:
• Maintenance schedules (oil changes, brakes, tires)
• Vehicle health assessment
• Cost estimates for services
• Common issues and solutions

Try asking: "When should I change the oil?" or "How are my brakes?"`;
        }
    }
}