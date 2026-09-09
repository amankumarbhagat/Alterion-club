import { prisma } from '../config/prisma.js';

export const getAllDivisions = async () => {
  return prisma.division.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      lead: {
        select: { id: true, name: true, role: true, email: true, imageUrl: true },
      },
      _count: {
        select: {
          members: true,
          applications: true,
        },
      },
    },
  });
};

export const getDivisionById = async (id: string) => {
  return prisma.division.findUnique({
    where: { id },
    include: {
      lead: true,
      members: {
        orderBy: { displayOrder: 'asc' },
      },
      _count: {
        select: {
          members: true,
          applications: true,
        },
      },
    },
  });
};

export const createDivision = async (data: any) => {
  if (data.leadId) {
    const lead = await prisma.member.findUnique({ where: { id: data.leadId } });
    if (!lead) {
      throw new Error('REFERENCED_LEAD_NOT_FOUND');
    }
  }

  return prisma.division.create({
    data,
    include: {
      lead: {
        select: { id: true, name: true, role: true },
      },
    },
  });
};

export const updateDivision = async (id: string, data: any) => {
  if (data.leadId) {
    const lead = await prisma.member.findUnique({ where: { id: data.leadId } });
    if (!lead) {
      throw new Error('REFERENCED_LEAD_NOT_FOUND');
    }
  }

  return prisma.division.update({
    where: { id },
    data,
    include: {
      lead: {
        select: { id: true, name: true, role: true },
      },
    },
  });
};

export const deleteDivision = async (id: string) => {
  const division = await prisma.division.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          members: true,
          applications: true,
        },
      },
    },
  });

  if (!division) {
    throw new Error('NOT_FOUND');
  }

  if (division._count.members > 0) {
    throw new Error('CANNOT_DELETE_DIVISION_WITH_MEMBERS');
  }

  if (division._count.applications > 0) {
    throw new Error('CANNOT_DELETE_DIVISION_WITH_APPLICATIONS');
  }

  return prisma.division.delete({
    where: { id },
  });
};
