import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
  const role = await prisma.role.create({
    data: {
      name: "admin",
      permissions: {
        set: ["dashboard", "cashier", "categories", "products", "customers", "purchases", "sales", "suppliers", "users", "roles"],
      },
    },
  });

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("1234", salt);
  const user = await prisma.user.create({
    data: {
      name: "Pozyomka",
      username: "pozy",
      password: password,
      role: {
        connect: { id: role.id },
      },
    },
  });

  console.log({ role, user });
};

main()