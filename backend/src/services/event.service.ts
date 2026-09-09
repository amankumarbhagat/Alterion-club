import { prisma } from '../config/prisma.js';
import { EventStatus } from '@prisma/client';

export interface EventFilterOptions {
  page: number;
  limit: number;
  status?: EventStatus;
  search?: string;
}

export const getAllEvents = async (options: EventFilterOptions) => {
  const { page, limit, status, search } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { venue: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, events] = await Promise.all([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      include: {
        coordinator: {
          select: { id: true, name: true, role: true, email: true },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { eventDate: 'desc' },
    }),
  ]);

  return {
    events,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEventById = async (id: string) => {
  return prisma.event.findUnique({
    where: { id },
    include: {
      coordinator: true,
      _count: {
        select: { registrations: true },
      },
    },
  });
};

export const createEvent = async (data: any) => {
  if (data.coordinatorId) {
    const coordinator = await prisma.member.findUnique({ where: { id: data.coordinatorId } });
    if (!coordinator) throw new Error('REFERENCED_COORDINATOR_NOT_FOUND');
  }

  const eventData = {
    ...data,
    eventDate: new Date(data.eventDate),
  };

  return prisma.event.create({
    data: eventData,
    include: {
      coordinator: {
        select: { id: true, name: true, role: true },
      },
    },
  });
};

export const updateEvent = async (id: string, data: any) => {
  if (data.coordinatorId) {
    const coordinator = await prisma.member.findUnique({ where: { id: data.coordinatorId } });
    if (!coordinator) throw new Error('REFERENCED_COORDINATOR_NOT_FOUND');
  }

  const eventData = {
    ...data,
    ...(data.eventDate && { eventDate: new Date(data.eventDate) }),
  };

  return prisma.event.update({
    where: { id },
    data: eventData,
    include: {
      coordinator: {
        select: { id: true, name: true, role: true },
      },
    },
  });
};

export const deleteEvent = async (id: string) => {
  return prisma.event.delete({
    where: { id },
  });
};
