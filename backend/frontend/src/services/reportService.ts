import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Vehicle, Certificate, MaintenanceRecord, PredictiveAnalysis } from '../types';

export class ReportService {
    // Generate Vehicle Health Report
    static generateVehicleHealthReport(vehicle: Vehicle, analysis: PredictiveAnalysis) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(0, 51, 102);
        doc.text('VLIP Vehicle Health Report', pageWidth / 2, 20, { align: 'center' });
        
        // Date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: 'center' });
        
        // Vehicle Information
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Vehicle Information', 14, 45);
        
        const vehicleData = [
            ['VIN', vehicle.vin],
            ['Manufacturer', vehicle.manufacturer],
            ['Model', vehicle.model],
            ['Year', vehicle.year.toString()],
            ['Registration Date', new Date(vehicle.createdAt).toLocaleDateString()]
        ];
        
        autoTable(doc, {
            startY: 50,
            head: [['Field', 'Value']],
            body: vehicleData,
            theme: 'striped',
            headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
            margin: { left: 14, right: 14 }
        });
        
        let yPosition = (doc as any).lastAutoTable.finalY + 10;
        
        // Health Score
        doc.setFontSize(14);
        doc.text('Health Assessment', 14, yPosition);
        yPosition += 10;
        
        const healthData = [
            ['Overall Health Score', `${analysis.healthScore}/100`],
            ['Health Status', analysis.healthStatus],
            ['Recommendations', analysis.recommendations.join(', ')]
        ];
        
        autoTable(doc, {
            startY: yPosition,
            head: [['Metric', 'Value']],
            body: healthData,
            theme: 'striped',
            headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
        
        // Component Health
        doc.setFontSize(14);
        doc.text('Component Health Analysis', 14, yPosition);
        yPosition += 10;
        
        const componentData = analysis.predictions.map(pred => [
            pred.component,
            `${pred.currentHealth}%`,
            pred.recommendedAction,
            `$${pred.estimatedCost}`
        ]);
        
        autoTable(doc, {
            startY: yPosition,
            head: [['Component', 'Health', 'Recommended Action', 'Est. Cost']],
            body: componentData,
            theme: 'striped',
            headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
        
        // Maintenance Schedule
        if (analysis.maintenanceSchedule && analysis.maintenanceSchedule.length > 0) {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFontSize(14);
            doc.text('Upcoming Maintenance Schedule', 14, yPosition);
            yPosition += 10;
            
            const scheduleData = analysis.maintenanceSchedule.map(item => [
                item.service,
                `${item.nextDueMiles.toLocaleString()} miles`,
                `${item.milesRemaining.toLocaleString()} miles`,
                `$${item.estimatedCost}`,
                item.priority
            ]);
            
            autoTable(doc, {
                startY: yPosition,
                head: [['Service', 'Due at', 'Miles Remaining', 'Cost', 'Priority']],
                body: scheduleData,
                theme: 'striped',
                headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
            });
        }
        
        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `VLIP Platform - Blockchain Verified Certificate | Page ${i} of ${pageCount}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }
        
        // Save PDF
        doc.save(`${vehicle.manufacturer}_${vehicle.model}_Health_Report.pdf`);
    }
    
    // Generate Maintenance History Report
    static generateMaintenanceHistoryReport(vehicle: Vehicle, records: MaintenanceRecord[]) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(0, 51, 102);
        doc.text('Maintenance History Report', pageWidth / 2, 20, { align: 'center' });
        
        // Date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: 'center' });
        
        // Vehicle Information
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Vehicle Information', 14, 45);
        
        const vehicleData = [
            ['VIN', vehicle.vin],
            ['Manufacturer', vehicle.manufacturer],
            ['Model', vehicle.model],
            ['Year', vehicle.year.toString()]
        ];
        
        autoTable(doc, {
            startY: 50,
            head: [['Field', 'Value']],
            body: vehicleData,
            theme: 'striped',
            headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
            margin: { left: 14, right: 14 }
        });
        
        let yPosition = (doc as any).lastAutoTable.finalY + 10;
        
        // Summary Statistics
        const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
        const avgCost = records.length > 0 ? totalCost / records.length : 0;
        
        const summaryData = [
            ['Total Maintenance Records', records.length.toString()],
            ['Total Cost', `$${totalCost.toFixed(2)}`],
            ['Average Cost per Service', `$${avgCost.toFixed(2)}`]
        ];
        
        autoTable(doc, {
            startY: yPosition,
            head: [['Summary', 'Value']],
            body: summaryData,
            theme: 'striped',
            headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
        
        // Maintenance Records
        if (records.length > 0) {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFontSize(14);
            doc.text('Maintenance Records', 14, yPosition);
            yPosition += 10;
            
            const recordsData = records.map(record => [
                new Date(record.performedAt).toLocaleDateString(),
                record.component.charAt(0).toUpperCase() + record.component.slice(1),
                record.serviceType,
                `${record.mileage.toLocaleString()} mi`,
                `$${record.cost.toFixed(2)}`,
                record.severity.toUpperCase()
            ]);
            
            autoTable(doc, {
                startY: yPosition,
                head: [['Date', 'Component', 'Service', 'Mileage', 'Cost', 'Severity']],
                body: recordsData,
                theme: 'striped',
                headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
            });
        }
        
        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `VLIP Platform - Maintenance Report | Page ${i} of ${pageCount}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }
        
        doc.save(`${vehicle.manufacturer}_${vehicle.model}_Maintenance_History.pdf`);
    }
    
    // Generate Certificate Report
    static generateCertificateReport(vehicle: Vehicle, certificate: Certificate) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Certificate Border
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(2);
        doc.rect(10, 10, pageWidth - 20, doc.internal.pageSize.getHeight() - 20);
        
        // Certificate Title
        doc.setFontSize(24);
        doc.setTextColor(0, 51, 102);
        doc.text('DIGITAL BIRTH CERTIFICATE', pageWidth / 2, 40, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('Blockchain Verified Document', pageWidth / 2, 50, { align: 'center' });
        
        // Certificate ID
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Certificate ID: ${certificate.certificateId}`, pageWidth / 2, 65, { align: 'center' });
        
        // Vehicle Information
        doc.setFontSize(14);
        doc.setTextColor(0, 51, 102);
        doc.text('Vehicle Information', 20, 85);
        
        const vehicleData = [
            ['VIN', vehicle.vin],
            ['Manufacturer', vehicle.manufacturer],
            ['Model', vehicle.model],
            ['Year', vehicle.year.toString()]
        ];
        
        autoTable(doc, {
            startY: 90,
            head: [['Field', 'Value']],
            body: vehicleData,
            theme: 'striped',
            headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
            margin: { left: 20, right: 20 }
        });
        
        let yPosition = (doc as any).lastAutoTable.finalY + 10;
        
        // Blockchain Information
        doc.setFontSize(14);
        doc.setTextColor(0, 51, 102);
        doc.text('Blockchain Verification', 20, yPosition);
        yPosition += 10;
        
        const blockchainData = [
            ['Blockchain Hash', certificate.blockchainHash.substring(0, 40) + '...'],
            ['Issued At', new Date(certificate.issuedAt).toLocaleString()],
            ['Status', certificate.status.toUpperCase()],
            ['Verification', 'Verified on Blockchain']
        ];
        
        autoTable(doc, {
            startY: yPosition,
            head: [['Field', 'Value']],
            body: blockchainData,
            theme: 'striped',
            headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
            margin: { left: 20, right: 20 }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 15;
        
        // QR Code placeholder text (since we can't generate actual QR without library)
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Scan to verify on blockchain:', 20, yPosition);
        doc.setDrawColor(0, 0, 0);
        doc.rect(20, yPosition + 5, 50, 50);
        doc.setFontSize(8);
        doc.text('QR Code', 45, yPosition + 30, { align: 'center' });
        doc.text('Verification', 45, yPosition + 35, { align: 'center' });
        
        // Signature
        doc.setFontSize(10);
        doc.text('Authorized by VLIP Blockchain Registry', pageWidth - 60, doc.internal.pageSize.getHeight() - 30);
        doc.setDrawColor(0, 0, 0);
        doc.line(pageWidth - 80, doc.internal.pageSize.getHeight() - 35, pageWidth - 20, doc.internal.pageSize.getHeight() - 35);
        
        doc.save(`Certificate_${certificate.certificateId}.pdf`);
    }
}