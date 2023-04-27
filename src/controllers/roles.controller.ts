import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({
  errorFormat: "pretty",
});

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany();
    res.status(200).json(roles);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const getRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const role = await prisma.role.findUnique({
      where: { id: id as string },
    });
    if (!role) {
      res.status(404).json({ error: "Role tidak ditemukan" });
      return;
    }
    res.status(200).json(role);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { name, permissions } = req.body;

  if (!name || permissions.length === 0) {
    res.status(400).json({ error: "Nama dan Hak akses diperlukan" });
    return;
  }

  if (typeof name !== "string") {
    res.status(400).json({ error: "Nama Role harus string" });
    return;
  }
  
  try {
    const role = await prisma.role.create({
      data: { name, permissions },
    });
    res.status(201).json(role);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).json({ error: "Role sudah ada" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  if (!name && permissions.length === 0) {
    res.status(400).json({ error: "Nama Role dan Hak akses diperlukan" });
    return;
  }

  if (typeof name !== "string") {
    res.status(400).json({ error: "Nama Role harus string" });
    return;
  }

  try {
    const updateData: Prisma.RoleUpdateInput = {};

    if (name) updateData.name = name;
    if (permissions) updateData.permissions = permissions;

    const role = await prisma.role.update({
      where: { id: id as string },
      data: updateData
    });

    res.status(200).json(role);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "Role tidak ditemukan" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const role = await prisma.role.delete({
      where: { id: id as string },
    });
    res.status(200).json(role);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        res.status(400).json({ error: "Role digunakan oleh user, hapus atau ganti role user terlebih dahulu" });
      } else if (err.code === "P2025") {
        res.status(400).json({ error: "Role tidak ditemukan" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};

export const deleteRoles = async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    const role = await prisma.role.deleteMany({
      where: { id: { in: ids } },
    });
    res.status(200).json(role);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        res.status(400).json({ error: "Role digunakan oleh user, hapus atau ganti role user terlebih dahulu" });
      } else if (err.code === "P2025") {
        res.status(400).json({ error: "Role tidak ditemukan" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
}
