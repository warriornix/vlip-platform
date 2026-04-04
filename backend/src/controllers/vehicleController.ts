import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createVehicle = async (req: Request, res: Response) => {
    try {
        const { vin, manufacturer, model, year } = req.body;
        const userId = (req as any).user.id;
        
        if (!vin || !manufacturer || !model || !year) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const existing = await prisma.vehicle.findUnique({
            where: { vin }
        });
        
        if (existing) {
            return res.status(400).json({ error: 'Vehicle with this VIN already exists' });
        }
        
        const vehicle = await prisma.vehicle.create({
            data: {
                vin,
                manufacturer,
                model,
                year,
                ownerId: userId
            }
        });
        
        res.status(201).json({ success: true, vehicle });
    } catch (error) {
        console.error('Create vehicle error:', error);
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
};

export const listVehicles = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const vehicles = await prisma.vehicle.findMany({
            where: { ownerId: userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, vehicles });
    } catch (error) {
        console.error('List vehicles error:', error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};

export const getVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        const vehicle = await prisma.vehicle.findFirst({
            where: { id, ownerId: userId }
        });
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        res.json({ success: true, vehicle });
    } catch (error) {
        console.error('Get vehicle error:', error);
        res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
};

export const updateVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { manufacturer, model, year } = req.body;
        const userId = (req as any).user.id;
        
        const existing = await prisma.vehicle.findFirst({
            where: { id, ownerId: userId }
        });
        if (!existing) return res.status(404).json({ error: 'Vehicle not found' });
        
        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: { manufacturer, model, year }
        });
        res.json({ success: true, vehicle });
    } catch (error) {
        console.error('Update vehicle error:', error);
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
};

export const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        
        const existing = await prisma.vehicle.findFirst({
            where: { id, ownerId: userId }
        });
        if (!existing) return res.status(404).json({ error: 'Vehicle not found' });
        
        await prisma.vehicle.delete({ where: { id } });
        res.json({ success: true, message: 'Vehicle deleted' });
    } catch (error) {
        console.error('Delete vehicle error:', error);
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
};