import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getSubscription = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // set from JWT middleware
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  res.json(subscription);
};

export const upgradeToPremium = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const subscription = await prisma.subscription.upsert({
    where: { userId },
    update: { type: "premium", startDate: new Date() },
    create: { userId, type: "premium" }
  });
  res.json(subscription);
};
