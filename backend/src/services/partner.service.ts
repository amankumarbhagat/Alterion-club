import { prisma } from '../config/prisma.js';

export interface PartnerFilterOptions {
  page: number;
  limit: number;
  search?: string;
}

export const getAllPartners = async (options: PartnerFilterOptions) => {
  const { page, limit, search } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { partnerType: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, partners] = await Promise.all([
    prisma.partner.count({ where }),
    prisma.partner.findMany({
      where,
      skip,
      take: limit,
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return {
    partners,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPartnerById = async (id: string) => {
  return prisma.partner.findUnique({
    where: { id },
  });
};

export const createPartner = async (data: any) => {
  return prisma.partner.create({
    data,
  });
};

export const updatePartner = async (id: string, data: any) => {
  return prisma.partner.update({
    where: { id },
    data,
  });
};

export const deletePartner = async (id: string) => {
  return prisma.partner.delete({
    where: { id },
  });
};
