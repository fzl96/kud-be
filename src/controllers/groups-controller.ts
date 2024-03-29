import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { db } from "../lib/db.js";
import { createPagination } from "../utils/pagination.js";

export const getGroups = async (req: Request, res: Response) => {
  const { page, pageSize = 10, search } = req.query;
  let skip, take

  if (page) {
    skip = (Number(page) - 1) * Number(pageSize);
    take = Number(pageSize);
  }

  const where = { } as Prisma.GroupWhereInput;
  if (search) {
    where.OR = [
      { name: { contains: search as string } },
    ]
  }
  
  try {
    const groups = db.group.findMany({
      where,
      include: {
        members: {
          where: {
            active: true,
          },
          select: {
            id: true,
            name: true,
            phone: true,
            memberRole: true,
          },
        },
      },
      skip,
      take,
    });

    const count = db.group.count({
      where,
    });

    const [groupsData, groupsCount] = await Promise.all([
      groups,
      count,
    ]);

    const pagination = createPagination({
      page: Number(page),
      pageSize: Number(pageSize),
      total: groupsCount,
      url: `${process.env.API_URL}/groups`,
    })

    const groupWithLeader = groupsData.map((group) => {
      const leader = group.members.find(
        (member) => member.memberRole === "KETUA"
      );
      return {
        id: group.id,
        name: group.name,
        numberOfMembers: group.members.length,
        leader: {
          id: leader?.id,
          name: leader?.name,
        },
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      };
    });

    res.status(200).json({
      pagination,
      data: groupWithLeader,
    });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const getGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const includeSales = req.query.include_sales === "true";
  const year = req.query.year as string;
  const month = req.query.month as string;

  if (includeSales && (!year || !month)) {
    res.status(400).json({ error: "Tahun dan bulan diperlukan" });
    return;
  }

  try {
    if (!includeSales) {
      const group = await db.group.findUnique({
        where: { id: id },
        include: {
          members: {
            where: {
              active: true,
            },
            select: {
              id: true,
              name: true,
              memberRole: true,
              phone: true,
            },
          },
        },
      });

      if (!group) {
        res.status(200).json(group);
      }
      const leader = group?.members.find(
        (member) => member.memberRole === "KETUA"
      );

      res.status(200).json({
        id: group?.id,
        name: group?.name,
        numberOfMembers: group?.members.length,
        createdAt: group?.createdAt,
        updatedAt: group?.updatedAt,
        members: group?.members.map((member) => ({
          id: member.id,
          name: member.name,
          status: member.memberRole,
          phone: member.phone,
        })),
        leader: {
          id: leader?.id,
          name: leader?.name,
        },
      });
    } else {
      const group = await db.group.findUnique({
        where: { id: id },
        include: {
          members: {
            where: {
              active: true,
            },
            select: {
              id: true,
              name: true,
              memberRole: true,
              phone: true,
              sales: {
                select: {
                  id: true,
                  total: true,
                  status: true,
                  createdAt: true,
                },
                where: {
                  createdAt: {
                    gte: new Date(`${year}-${month}-01`),
                    lt: new Date(`${year}-${month}-31`),
                  },
                },
              },
            },
          },
        },
      });

      if (!group) {
        res.status(200).json(group);
      }
      const leader = group?.members.find(
        (member) => member.memberRole === "KETUA"
      );

      res.status(200).json({
        id: group?.id,
        name: group?.name,
        numberOfMembers: group?.members.length,
        leader: {
          id: leader?.id,
          name: leader?.name,
        },
        members: group?.members.map((member) => ({
          id: member.id,
          name: member.name,
          status: member.memberRole,
          totalTransactions: member.sales.reduce(
            (acc, sale) => acc + sale.total,
            0
          ),
        })),
        createdAt: group?.createdAt,
        updatedAt: group?.updatedAt,
      });
    }
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  const { name, members, leaderId } = req.body;

  if (!name) {
    res.status(400).json({ error: "Nama tidak boleh kosong" });
    return;
  }

  try {
    const group = await db.group.create({
      data: { name },
    });

    if (members) {
      // members is an array of customer id, update
      await db.member.updateMany({
        where: {
          id: {
            in: members,
          },
        },
        data: {
          groupId: group.id,
        },
      });
    }

    if (leaderId) {
      // Set the leader for the group
      await db.member.update({
        where: {
          id: leaderId,
        },
        data: {
          groupId: group.id,
          memberRole: "KETUA",
        },
      });
    }

    res.status(201).json(group);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).json({ error: "Kelompok sudah ada" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, members, leaderId } = req.body;

  if (!name) {
    res.status(400).json({ error: "Nama tidak boleh kosong" });
    return;
  }

  try {
    const group = await db.group.update({
      where: { id: id },
      data: { name },
      include: {
        members: true,
      },
    });

    if (members) {
      // members is an array of customer id, update
      await db.member.updateMany({
        where: {
          id: {
            in: members,
          },
        },
        data: {
          groupId: group.id,
        },
      });
    }

    if (leaderId) {
      // set the previous leader to member first before setting the new leader
      const currentLeader = group.members.find(
        (member) => member.memberRole === "KETUA"
      );

      if (currentLeader) {
        await db.member.update({
          where: {
            id: currentLeader.id,
          },
          data: {
            memberRole: "ANGGOTA",
          },
        });
      }

      // Set the leader for the group
      await db.member.update({
        where: {
          id: leaderId,
        },
        data: {
          groupId: group.id,
          memberRole: "KETUA",
        },
      });
    }

    res.status(200).json(group);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "Kelompok tidak ditemukan" });
      } else if (err.code === "P2002") {
        res.status(400).json({ error: "Kelompok sudah ada" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const group = await db.group.delete({
      where: { id: id },
    });

    res.status(200).json(group);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "Kelompok tidak ditemukan" });
      } else if (err.code == "P2003") {
        res.status(400).json({ error: "Kelompok mempunyai anggota" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};

export const deleteGroups = async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    const groups = await db.group.deleteMany({
      where: { id: { in: ids } },
    });

    res.status(200).json(groups);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        res.status(404).json({ error: "Kelompok tidak ditemukan" });
      } else if (err.code == "P2003") {
        res.status(400).json({ error: "Kelompok mempunyai anggota" });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
};
