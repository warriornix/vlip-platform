import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

const analyticsService = new AnalyticsService();

export const getFleetStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const stats = await analyticsService.getFleetStats(userId);
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Error fetching fleet stats:', error);
        res.status(500).json({ error: 'Failed to fetch fleet stats' });
    }
};

export const getMaintenanceTrends = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const trends = await analyticsService.getMaintenanceTrends(userId);
        res.json({ success: true, trends });
    } catch (error) {
        console.error('Error fetching maintenance trends:', error);
        res.status(500).json({ error: 'Failed to fetch maintenance trends' });
    }
};

export const getComponentHealth = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const health = await analyticsService.getComponentHealth(userId);
        res.json({ success: true, health });
    } catch (error) {
        console.error('Error fetching component health:', error);
        res.status(500).json({ error: 'Failed to fetch component health' });
    }
};

export const getVehicleRankings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const rankings = await analyticsService.getVehicleRankings(userId);
        res.json({ success: true, rankings });
    } catch (error) {
        console.error('Error fetching vehicle rankings:', error);
        res.status(500).json({ error: 'Failed to fetch vehicle rankings' });
    }
};

export const getDashboardAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const analytics = await analyticsService.getDashboardAnalytics(userId);
        res.json({ success: true, analytics });
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
    }
};