import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const productSchema = z.object({
  id: z.string().optional(),
  quantity: z.number().min(0).optional(),
});

export const getCashier = async (req: Request, res: Response) => {
  try {
    const getProducts = prisma.product.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const getCustomers = prisma.customer.findMany({
      where: { active: true },
    });
    // prisma transaction
    const [products, customers] = await prisma.$transaction([
      getProducts,
      getCustomers,
    ]);

    res.status(200).json({products, customers});
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
}

export const postCashier = async (req: Request, res: Response) => {
  try {
    const { customerId, products, cash, change, cashierId } = req.body;
    // check if customer and products exist in the request body
    if (!products || !cash || change < 0 || !cashierId) {
      res.status(400).json({ error: "Data kurang lengkap" });
      return;
    }

    const isProductValid = products.every(
      (product: any) => productSchema.safeParse(product).success
    );

    // check if the products are valid
    if (!isProductValid) {
      res.status(400).json({ error: isProductValid.error.issues });
      return;
    }

    // get the price of the products
    const productPrices = await prisma.product.findMany({
      where: {
        id: {
          in: products.map((product: any) => product.id),
        },
      },
      select: {
        id: true,
        price: true,
        stock: true,
      },
    });

    // check if the product is in stock
    const isProductInStock = products.every(
      (product: any) =>
        productPrices.find((p) => p.id === product.id)?.stock! >=
        product.quantity
    );

    if (!isProductInStock) {
      res.status(400).json({ error: "Stok tidak cukup" });
      return;
    }

    const total = products.reduce(
      (acc: number, product: any) =>
        acc +
        productPrices.find((p) => p.id === product.id)?.price! *
          product.quantity,
      0
    );

    if (total > cash) {
      res.status(400).json({ error: "Uang tidak cukup" });
      return;
    }

    const createData: Prisma.SaleCreateInput = {
      cash,
      change,
      total: total,
      user: { connect: { id: cashierId } },
      products: {
        create: products.map((product: any) => ({
          quantity: product.quantity,
          productId: product.id,
          // multiply the price of the product by the quantity
          total:
            productPrices.find((p) => p.id === product.id)?.price! *
            product.quantity,
        })),
      },
    };
    
    if (customerId) createData.customer = { connect: { id: customerId } };

    // create the sale
    const sale = prisma.sale.create({
      data: createData,
    });

    const result = await prisma.$transaction([
      sale,
      ...products.map((product: any) => {
        return prisma.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: product.quantity,
            },
          },
        });
      }
      )
    ]);

    res.status(201).json("Penjualan berhasil ditambahkan");
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "Customer tidak ditemukan" });
        return;
      } else {
        if (err instanceof Error) {
          res.status(500).json({ error: err.message });
        }
      }
    }
  }
};