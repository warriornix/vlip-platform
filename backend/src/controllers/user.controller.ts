import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get all users (admin only)
export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

// Update user role
export const updateRole = async (req: Request, res: Response) => {
  const { id, role } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { role }
  });
  res.json(user);
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.json({ message: "User deleted" });
};
