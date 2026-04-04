import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getSubscription = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const subscription = await prisma.subscription.findFirst({ where: { userId } });
  res.json(subscription || { type: "free", status: "active" });
};
