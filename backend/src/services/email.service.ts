import nodemailer from 'nodemailer';

// Simple email transporter
let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: '',
        pass: ''
    }
});

export class EmailService {
    // Send maintenance reminder
    static async sendMaintenanceReminder(userEmail: string, userName: string, vehicle: any, schedule: any[]) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1976d2;">🔧 Maintenance Reminder</h2>
                <p>Hello ${userName},</p>
                <p>Your vehicle <strong>${vehicle.manufacturer} ${vehicle.model}</strong> (${vehicle.year}) needs attention:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background-color: #f0f0f0;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Service</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Due Miles</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Est. Cost</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Priority</th>
                    </tr>
                    ${schedule.map((item: any) => `
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.service}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.dueMiles.toLocaleString()}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">$${item.estimatedCost}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">
                                <span style="background: ${item.priority === 'High' ? '#f44336' : item.priority === 'Medium' ? '#ff9800' : '#4caf50'}; color: white; padding: 3px 8px; border-radius: 4px;">
                                    ${item.priority}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </table>
                
                <p>Visit your VLIP dashboard to view full details and schedule service.</p>
                <hr />
                <p style="color: #666; font-size: 12px;">This is an automated reminder from VLIP Platform.</p>
            </div>
        `;

        try {
            const info = await transporter.sendMail({
                from: '"VLIP Platform" <noreply@vlip.com>',
                to: userEmail,
                subject: `🔧 Maintenance Reminder: ${vehicle.manufacturer} ${vehicle.model}`,
                html
            });
            console.log('Email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Failed to send email:', error);
            return null;
        }
    }

    // Send health alert
    static async sendHealthAlert(userEmail: string, userName: string, vehicle: any, healthScore: number) {
        const color = healthScore >= 80 ? '#4caf50' : healthScore >= 60 ? '#ff9800' : '#f44336';
        const status = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Critical';
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: ${color};">⚠️ Vehicle Health Alert</h2>
                <p>Hello ${userName},</p>
                <p>Your vehicle <strong>${vehicle.manufacturer} ${vehicle.model}</strong> health status has changed:</p>
                
                <div style="background: ${color}; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <h1 style="margin: 0;">${healthScore}/100</h1>
                    <p style="margin: 5px 0 0;">Health Score - ${status}</p>
                </div>
                
                <p><strong>Recommendations:</strong></p>
                <ul>
                    ${healthScore < 60 ? '<li>🚨 Schedule immediate service appointment</li>' : ''}
                    ${healthScore < 80 ? '<li>📅 Regular maintenance recommended</li>' : '<li>✅ Vehicle in excellent condition</li>'}
                    ${healthScore < 70 ? '<li>🔧 Check engine and transmission</li>' : ''}
                </ul>
                
                <p>Visit your VLIP dashboard for detailed component analysis.</p>
                <hr />
                <p style="color: #666; font-size: 12px;">This is an automated alert from VLIP Platform.</p>
            </div>
        `;

        try {
            const info = await transporter.sendMail({
                from: '"VLIP Platform" <noreply@vlip.com>',
                to: userEmail,
                subject: `⚠️ Health Alert: ${vehicle.manufacturer} ${vehicle.model} - ${status}`,
                html
            });
            console.log('Health alert sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Failed to send health alert:', error);
            return null;
        }
    }

    // Set up test account (for development)
    static async setupTestAccount() {
        const testAccount = await nodemailer.createTestAccount();
        console.log('\n📧 Test Email Account Created:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Email: ${testAccount.user}`);
        console.log(`Password: ${testAccount.pass}`);
        console.log(`Preview: https://ethereal.email/login`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Update transporter with test credentials
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        
        return testAccount;
    }
}