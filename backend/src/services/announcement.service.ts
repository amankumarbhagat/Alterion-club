import { prisma } from '../config/prisma.js';
import { AnnouncementCategory } from '@prisma/client';

export interface AnnouncementFilterOptions {
  page: number;
  limit: number;
  category?: AnnouncementCategory;
  isActive?: boolean;
  search?: string;
}

export const getAllAnnouncements = async (options: AnnouncementFilterOptions) => {
  const { page, limit, category, isActive, search } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (category) where.category = category;
  if (isActive !== undefined) where.isActive = isActive;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, announcements] = await Promise.all([
    prisma.announcement.count({ where }),
    prisma.announcement.findMany({
      where,
      skip,
      take: limit,
      orderBy: { datePosted: 'desc' },
    }),
  ]);

  return {
    announcements,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAnnouncementById = async (id: string) => {
  return prisma.announcement.findUnique({
    where: { id },
  });
};

export const createAnnouncement = async (data: any) => {
  const announcementData = {
    ...data,
    ...(data.datePosted && { datePosted: new Date(data.datePosted) }),
  };

  return prisma.announcement.create({
    data: announcementData,
  });
};

export const updateAnnouncement = async (id: string, data: any) => {
  const announcementData = {
    ...data,
    ...(data.datePosted && { datePosted: new Date(data.datePosted) }),
  };

  return prisma.announcement.update({
    where: { id },
    data: announcementData,
  });
};

export const deleteAnnouncement = async (id: string) => {
  return prisma.announcement.delete({
    where: { id },
  });
};
