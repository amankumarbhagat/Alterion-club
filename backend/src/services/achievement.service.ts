import { prisma } from '../config/prisma.js';

export interface AchievementFilterOptions {
  page: number;
  limit: number;
  featured?: boolean;
  search?: string;
}

export const getAllAchievements = async (options: AchievementFilterOptions) => {
  const { page, limit, featured, search } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (featured !== undefined) where.featured = featured;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { badge: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, achievements] = await Promise.all([
    prisma.achievement.count({ where }),
    prisma.achievement.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
    }),
  ]);

  return {
    achievements,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAchievementById = async (id: string) => {
  return prisma.achievement.findUnique({
    where: { id },
  });
};

export const createAchievement = async (data: any) => {
  return prisma.achievement.create({
    data,
  });
};

export const updateAchievement = async (id: string, data: any) => {
  return prisma.achievement.update({
    where: { id },
    data,
  });
};

export const deleteAchievement = async (id: string) => {
  return prisma.achievement.delete({
    where: { id },
  });
};
