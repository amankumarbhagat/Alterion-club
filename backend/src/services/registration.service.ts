import { prisma } from '../config/prisma.js';
import { RegistrationStatus } from '@prisma/client';

export interface RegistrationFilterOptions {
  eventId: string;
  page: number;
  limit: number;
  status?: RegistrationStatus;
  search?: string;
}

export const getEventRegistrations = async (options: RegistrationFilterOptions) => {
  const { eventId, page, limit, status, search } = options;
  const skip = (page - 1) * limit;

  const where: any = { eventId };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { usn: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { teamName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, registrations] = await Promise.all([
    prisma.eventRegistration.count({ where }),
    prisma.eventRegistration.findMany({
      where,
      skip,
      take: limit,
      orderBy: { submittedAt: 'desc' },
    }),
  ]);

  return {
    registrations,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRegistrationById = async (id: string) => {
  return prisma.eventRegistration.findUnique({
    where: { id },
    include: {
      event: {
        select: { id: true, title: true, slug: true, eventDate: true, venue: true },
      },
    },
  });
};

export const updateRegistrationStatus = async (id: string, status: RegistrationStatus) => {
  return prisma.eventRegistration.update({
    where: { id },
    data: { status },
  });
};

export const deleteRegistration = async (id: string) => {
  return prisma.eventRegistration.delete({
    where: { id },
  });
};
