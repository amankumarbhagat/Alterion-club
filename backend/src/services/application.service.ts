import { prisma } from '../config/prisma.js';
import { ApplicationStatus } from '@prisma/client';

export interface ApplicationFilterOptions {
  page: number;
  limit: number;
  status?: ApplicationStatus;
  divisionId?: string;
  search?: string;
}

export const getAllApplications = async (options: ApplicationFilterOptions) => {
  const { page, limit, status, divisionId, search } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (divisionId) where.divisionId = divisionId;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { branch: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      include: {
        division: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { submittedAt: 'desc' },
    }),
  ]);

  return {
    applications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getApplicationById = async (id: string) => {
  return prisma.application.findUnique({
    where: { id },
    include: {
      division: true,
    },
  });
};

export const updateApplicationStatus = async (
  id: string,
  data: { status?: ApplicationStatus; adminNotes?: string }
) => {
  return prisma.application.update({
    where: { id },
    data,
    include: {
      division: {
        select: { id: true, name: true },
      },
    },
  });
};

export const deleteApplication = async (id: string) => {
  return prisma.application.delete({
    where: { id },
  });
};
