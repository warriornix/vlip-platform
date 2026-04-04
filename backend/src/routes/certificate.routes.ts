import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

const router = Router();

function generateBlockchainHash(data: any): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(32).toString('hex');
    const dataString = JSON.stringify(data) + timestamp + randomString;
    return crypto.createHash('sha256').update(dataString).digest('hex');
}

// Issue certificate
router.post('/vehicle/:vehicleId/issue', authenticateToken, async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const userId = (req as any).user.id;
        
        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, ownerId: userId }
        });
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        const certificateData = {
            vehicleId,
            vin: vehicle.vin,
            manufacturer: vehicle.manufacturer,
            model: vehicle.model,
            year: vehicle.year,
            issuedAt: new Date().toISOString()
        };
        
        const hash = generateBlockchainHash(certificateData);
        
        const certificate = await prisma.certificate.create({
            data: {
                certificateId: `CERT-${Date.now()}-${vehicleId}`,
                vehicleId,
                data: JSON.stringify(certificateData),
                blockchainHash: hash,
                createdAt: new Date()
            }
        });
        
        res.status(201).json({ success: true, certificate });
    } catch (error) {
        console.error('Issue certificate error:', error);
        res.status(500).json({ error: 'Failed to issue certificate' });
    }
});

// Get vehicle certificates
router.get('/vehicle/:vehicleId/certificates', authenticateToken, async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const userId = (req as any).user.id;
        
        const vehicle = await prisma.vehicle.findFirst({
            where: { id: vehicleId, ownerId: userId }
        });
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        
        const certificates = await prisma.certificate.findMany({
            where: { vehicleId },
            orderBy: { createdAt: 'desc' }
        });
        
        res.json({ success: true, certificates });
    } catch (error) {
        console.error('Get certificates error:', error);
        res.status(500).json({ error: 'Failed to fetch certificates' });
    }
});

// Verify certificate
router.get('/verify/:certificateId', async (req, res) => {
    try {
        const { certificateId } = req.params;
        
        const certificate = await prisma.certificate.findUnique({
            where: { certificateId },
            include: { vehicle: true }
        });
        
        if (!certificate) {
            return res.json({ isValid: false, message: 'Certificate not found' });
        }
        
        const expectedData = {
            vehicleId: certificate.vehicleId,
            vin: certificate.vehicle.vin,
            manufacturer: certificate.vehicle.manufacturer,
            model: certificate.vehicle.model,
            year: certificate.vehicle.year,
            issuedAt: certificate.createdAt.toISOString()
        };
        
        const expectedHash = generateBlockchainHash(expectedData);
        const isValid = certificate.blockchainHash === expectedHash;
        
        res.json({
            success: true,
            isValid,
            certificate: {
                id: certificate.certificateId,
                issuedAt: certificate.createdAt,
                vehicleInfo: {
                    vin: certificate.vehicle.vin,
                    manufacturer: certificate.vehicle.manufacturer,
                    model: certificate.vehicle.model,
                    year: certificate.vehicle.year
                },
                blockchainHash: certificate.blockchainHash,
                verificationStatus: isValid ? 'Verified' : 'Tampered'
            }
        });
    } catch (error) {
        console.error('Verify certificate error:', error);
        res.status(500).json({ error: 'Failed to verify certificate' });
    }
});

export default router;