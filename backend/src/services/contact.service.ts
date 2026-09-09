import { prisma } from '../config/prisma.js';

export interface ContactMessageFilterOptions {
  page: number;
  limit: number;
  isRead?: boolean;
  search?: string;
}

export const getAllContactMessages = async (options: ContactMessageFilterOptions) => {
  const { page, limit, isRead, search } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (isRead !== undefined) where.isRead = isRead;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, messages] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { submittedAt: 'desc' },
    }),
  ]);

  return {
    messages,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getContactMessageById = async (id: string) => {
  return prisma.contactMessage.findUnique({
    where: { id },
  });
};

export const updateContactMessage = async (
  id: string,
  data: { isRead?: boolean; adminReply?: string }
) => {
  return prisma.contactMessage.update({
    where: { id },
    data,
  });
};

export const deleteContactMessage = async (id: string) => {
  return prisma.contactMessage.delete({
    where: { id },
  });
};
