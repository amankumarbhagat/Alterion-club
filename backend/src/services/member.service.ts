import { prisma } from '../config/prisma.js';

export interface MemberFilterOptions {
  page: number;
  limit: number;
  divisionId?: string;
  isLeadership?: boolean;
  isActive?: boolean;
  search?: string;
}

export const getAllMembers = async (options: MemberFilterOptions) => {
  const { page, limit, divisionId, isLeadership, isActive, search } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (divisionId) where.divisionId = divisionId;
  if (isLeadership !== undefined) where.isLeadership = isLeadership;
  if (isActive !== undefined) where.isActive = isActive;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { role: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, members] = await Promise.all([
    prisma.member.count({ where }),
    prisma.member.findMany({
      where,
      skip,
      take: limit,
      include: {
        division: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [{ isLeadership: 'desc' }, { displayOrder: 'asc' }],
    }),
  ]);

  return {
    members,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getMemberById = async (id: string) => {
  return prisma.member.findUnique({
    where: { id },
    include: {
      division: true,
      leadOf: {
        select: { id: true, name: true, slug: true },
      },
      projects: {
        include: {
          project: {
            select: { id: true, title: true, slug: true, status: true },
          },
        },
      },
    },
  });
};

export const createMember = async (data: any) => {
  // Ensure target division exists
  const division = await prisma.division.findUnique({ where: { id: data.divisionId } });
  if (!division) {
    throw new Error('REFERENCED_DIVISION_NOT_FOUND');
  }

  return prisma.member.create({
    data,
    include: {
      division: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
};

export const updateMember = async (id: string, data: any) => {
  if (data.divisionId) {
    const division = await prisma.division.findUnique({ where: { id: data.divisionId } });
    if (!division) {
      throw new Error('REFERENCED_DIVISION_NOT_FOUND');
    }
  }

  return prisma.member.update({
    where: { id },
    data,
    include: {
      division: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
};

export const deleteMember = async (id: string) => {
  // Check if member is a lead of a division
  const divisionLed = await prisma.division.findFirst({ where: { leadId: id } });
  if (divisionLed) {
    // Unassign as lead before deleting
    await prisma.division.update({
      where: { id: divisionLed.id },
      data: { leadId: null },
    });
  }

  return prisma.member.delete({
    where: { id },
  });
};
