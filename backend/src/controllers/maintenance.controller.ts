import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getMaintenance = async (req: Request, res: Response) => {
  const maint = await prisma.maintenance.findMany({ include: { vehicle: true } });
  res.json(maint);
};

export const addMaintenance = async (req: Request, res: Response) => {
  const { vehicleId, details } = req.body;
  const maint = await prisma.maintenance.create({
    data: { vehicleId, details }
  });
  res.json(maint);
};
