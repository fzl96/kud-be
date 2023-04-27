import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

const customerSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
});

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { active: true },
    });
    res.status(200).json(customers);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: id as string },
    });
    if (!customer) {
      res.status(404).json({ error: "Customer tidak ditemukan" });
      return;
    }
    res.status(200).json(customer);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  const { name, phone } = req.body;
  
  if (!name) {
    res.status(400).json({ error: "Nama tidak boleh kosong" });
    return; 
  }

  const isValid = customerSchema.safeParse(req.body);
  
  if (!isValid.success) {
    res.status(400).json({ error: "Nama dan nomor telepon harus string" });
    return;
  }
  
  try {
    const customer = await prisma.customer.create({
      data: { name, phone },
    });

    res.status(201).json(customer);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phone } = req.body;

  if (!name && !phone) {
    res.status(400).json({ error: "Nama dan nomor telepon tidak boleh kosong" });
    return;
  }

  const isValid = customerSchema.safeParse(req.body);
  if (!isValid.success) {
    res.status(400).json({ error: "Nama dan nomor telepon harus string" });
    return;
  }
  
  try {
    const updateData: Prisma.CustomerUpdateInput = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    
    const customer = await prisma.customer.update({
      where: { id: id as string },
      data: updateData,
    });
    res.status(200).json(customer);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(400).json({ error: "Customer tidak ditemukan" });
      } else {
        res.status(500).json({ error: err.message });
      }
    };
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: id as string },
      include: { sales: true },
    });

    if (!customer) {
      res.status(404).json({ error: "Customer tidak ditemukan" });
      return;
    }

    if (customer.sales.length) {
      await prisma.customer.update({
        where: { id: id as string },
        data: {
          active: false,
        }
      });
      res.status(200).json({ message: "Customer dinonatikfkan" });
      return;
    }

    await prisma.customer.delete({
      where: { id: id as string },
    });

    res.status(200).json({ message: "Customer dihapus" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(400).json({ error: "Customer tidak ditemukan" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};
