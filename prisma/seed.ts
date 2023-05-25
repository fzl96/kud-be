import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
  const resources = [
    "dashboard",
    "categories",
    "products",
    "suppliers",
    "sales",
    "customers",
    "purchases",
    "users",
  ];
  // for (const resource of resources) {
  //   await prisma.permission.create({
  //     data: {
  //       name: `create_${resource}`,
  //     }
  //   });
  //   await prisma.permission.create({
  //     data: {
  //       name: `read_${resource}`,
  //     }
  //   });
  //   await prisma.permission.create({
  //     data: {
  //       name: `update_${resource}`,
  //     }
  //   });
  //   await prisma.permission.create({
  //     data: {
  //       name: `delete_${resource}`,
  //     }
  //   });
  // }

  // const permissions = await prisma.permission.findMany();

  // const adminRole = await prisma.role.create({
  //   data: {
  //     name: 'Admin',
  //     permissions: {
  //       connect: permissions.map((permission) => ({ id: permission.id }))
  //     }
  //   }
  // });

  // // create cashier role where they can only read and create sales
  // const cashierRole = await prisma.role.create({
  //   data: {
  //     name: 'Kasir',
  //     permissions: {
  //       connect: [
  //         {
  //           name: 'read_sales'
  //         },
  //         {
  //           name: 'create_sales'
  //         },
  //         {
  //           name: 'delete_sales'
  //         },
  //         {
  //           name: 'read_customers',
  //         },
  //         {
  //           name: 'create_customers',
  //         },
  //         {
  //           name: 'update_customers',
  //         },
  //         {
  //           name: 'delete_customers',
  //         },
  //         {
  //           name: 'read_products',
  //         }
  //       ]
  //     }
  //   }
  // });

  // const ketuaRole = await prisma.role.create({
  //   data: {
  //     name: 'Ketua',
  //     permissions: {
  //       connect: [
  //         {
  //           name: 'read_dashboard'
  //         },
  //       ]
  //     }
  //   }
  // });

  // const bendaharaRole = await prisma.role.create({
  //   data: {
  //     name: 'Bendahara',
  //     permissions: {
  //       connect: [
  //         {
  //           name: 'read_dashboard'
  //         },
  //         {
  //           name: 'read_purchases'
  //         },
  //         {
  //           name: 'create_purchases'
  //         },
  //         {
  //           name: 'update_purchases'
  //         },
  //         {
  //           name: 'delete_purchases'
  //         },
  // {
  //   name: 'read_products',
  // }
  // {
  //   name: 'read_suppliers',
  // }

  //         {
  //           name: 'read_sales'
  //         },
  //         {
  //           name: 'delete_sales'
  //         },
  //       ]
  //     }
  //   }
  // });

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash('1234', salt);

  // const admin = await prisma.user.create({
  //   data: {
  //     name: 'Pozyomka',
  //     username: 'pozy',
  //     password: hashedPassword,
  //     role: {
  //       connect: { id: adminRole.id }
  //     }
  //   }
  // });
};

main();
