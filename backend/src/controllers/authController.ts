import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user.id, role: user.role }, "secret", { expiresIn: "1h" });
  res.json({ token, role: user.role, email: user.email });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashed, role }
    });
    res.json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ error: "Registration failed", details: err });
  }
};
