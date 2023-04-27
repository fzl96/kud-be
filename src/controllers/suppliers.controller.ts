import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { active: true },
    });
    res.status(200).json(suppliers);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const getSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: id as string },
    });
    if (!supplier) {
      res.status(404).json({ error: "Supplier tidak ditemukan" });
      return;
    }
    res.status(200).json(supplier);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  const { name, address, phone } = req.body;
  if (!name) {
    res.status(400).json({ error: "Nama supplier harus diisi" });
    return;
  }

  if (typeof name !== "string") {
    res.status(400).json({ error: "Nama supplier harus string" });
    return;
  }

  try {
    const exist = await prisma.supplier.findUnique({
      where: { name: name },
    });

    if (exist) {
      res.status(400).json({ error: "Nama supplier sudah terdaftar" });
      return;
    }

    const updateData: Prisma.SupplierUpdateInput = {
      active: true,
    };

    if (address) {
      updateData.address = address;
    }

    if (phone) {
      updateData.phone = phone;
    }

    const supplier = await prisma.supplier.upsert({
      where: { name: name },
      update: updateData,
      create: { name, address, phone },
    })
    res.status(201).json(supplier);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).json({ error: "Nama supplier sudah terdaftar" });
        return;
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, phone } = req.body;

  if (!name && !address && !phone) {
    res.status(200).json({ message: "Tidak ada data yang diperbarui" });
    return;
  }

  if (!name) {
    res.status(400).json({ error: "Nama supplier harus diisi" });
    return;
  }

  const updateData: Prisma.SupplierUpdateInput = {};

  if (name) updateData.name = name;
  if (address) updateData.address = address;
  if (phone) updateData.phone = phone;
 
  try {
    const supplier = await prisma.supplier.update({
      where: { id: id as string },
      data: updateData,
    });
    res.status(200).json({ message: "Supplier updated" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "Supplier tidak ditemukan" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: id as string },
      include: { purchases: true },
    })

    if (!supplier) {
      res.status(404).json({ error: "Supplier tidak ditemukan" });
      return;
    }

    if (supplier.purchases.length > 0) {
      await prisma.supplier.update({
        where: { id: id as string },
        data: {
          active: false,
        }
      })
      res.status(200).json({ message: "Supplier dinonaktifkan" });
      return;
    }

    await prisma.supplier.delete({
      where: { id: id as string },
    });

    res.status(200).json({ message: "Supplier dihapus" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "Supplier tidak ditemukan" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};
