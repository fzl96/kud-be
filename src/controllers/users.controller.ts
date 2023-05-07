import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string().optional(),
  username: z.string().min(4).optional(),
  password: z.string().min(4).optional(),
  roleId: z.string().optional(),
});

export const getUsers = async (req: Request, res: Response) => {
  const includeRoles = req.query.include_roles === "true";
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (includeRoles) {
      const roles = await prisma.role.findMany();
      res.status(200).json({ users, roles });
      return;
    }
    res.status(200).json(users);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: id as string },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, username, password, confirmPassword, roleId } = req.body;
  
  if (!name || !username || !password || !confirmPassword ||!roleId) {
    res.status(400).json({
      error: "Nama, Username, Password, dan Role tidak boleh kosong",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: "Password tidak sama" });
    return;
  }

  const isValid = userSchema.safeParse(req.body);
  if (!isValid.success) {
    res.status(400).json({ error: "Data tidak valid" });
    return;
  }

  try {
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create user
    await prisma.user.create({
      data: { name, username, password: hashedPassword, roleId },
    });

    res.status(201).json({ message: "User dibuat" });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).json({ error: "Username sudah ada" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, username, newPassword, currentPassword, roleId } = req.body;

  if (!name && !username && !newPassword && !roleId) {
    res.status(200).json({
      error: "Tidak ada data yang diperbarui",
    });
    return;
  }

  try {
    const updateData: Prisma.UserUpdateInput = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (newPassword) {
      // compare currentPassword with password in database
      const user = await prisma.user.findUnique({
        where: { id: id as string },
        select: { password: true },
      });
      if (!user) {
        res.status(400).json({ error: "User tidak ditemukan" });
        return;
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(400).json({ error: "Password lama salah" });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateData.password = hashedPassword;
    }
    if (roleId) updateData.role = { connect: { id: roleId } };

    await prisma.user.update({
      where: { id: id as string },
      data: updateData,
    });

    res.status(200).json({ message: "User diperbarui" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(400).json({ error: "User tidak ditemukan" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: { id: id as string },
    });
    res.status(200).json({ message: "User dihapus" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(400).json({ error: "User tidak ditemukan" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};

export const deleteUsers = async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    await prisma.user.deleteMany({
      where: { id: { in: ids } },
    });
    res.status(200).json({ message: "User dihapus" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(400).json({ error: "User tidak ditemukan" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
}