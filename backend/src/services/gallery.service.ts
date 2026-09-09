import { prisma } from '../config/prisma.js';
import { GalleryCategory } from '@prisma/client';

export interface GalleryFilterOptions {
  page: number;
  limit: number;
  category?: GalleryCategory;
  eventId?: string;
  search?: string;
}

export const getAllGalleryItems = async (options: GalleryFilterOptions) => {
  const { page, limit, category, eventId, search } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (category) where.category = category;
  if (eventId) where.eventId = eventId;
  if (search) {
    where.caption = { contains: search, mode: 'insensitive' };
  }

  const [total, gallery] = await Promise.all([
    prisma.galleryItem.count({ where }),
    prisma.galleryItem.findMany({
      where,
      skip,
      take: limit,
      include: {
        event: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return {
    gallery,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getGalleryItemById = async (id: string) => {
  return prisma.galleryItem.findUnique({
    where: { id },
    include: {
      event: true,
    },
  });
};

export const createGalleryItem = async (data: any) => {
  if (data.eventId) {
    const event = await prisma.event.findUnique({ where: { id: data.eventId } });
    if (!event) throw new Error('REFERENCED_EVENT_NOT_FOUND');
  }

  return prisma.galleryItem.create({
    data,
    include: {
      event: {
        select: { id: true, title: true },
      },
    },
  });
};

export const updateGalleryItem = async (id: string, data: any) => {
  if (data.eventId) {
    const event = await prisma.event.findUnique({ where: { id: data.eventId } });
    if (!event) throw new Error('REFERENCED_EVENT_NOT_FOUND');
  }

  return prisma.galleryItem.update({
    where: { id },
    data,
    include: {
      event: {
        select: { id: true, title: true },
      },
    },
  });
};

export const deleteGalleryItem = async (id: string) => {
  return prisma.galleryItem.delete({
    where: { id },
  });
};
