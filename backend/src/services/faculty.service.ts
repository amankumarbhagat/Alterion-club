import { prisma } from '../config/prisma.js';

export const getAllFaculty = async () => {
  return prisma.facultyCoordinator.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: { mentoredProjects: true },
      },
    },
  });
};

export const getFacultyById = async (id: string) => {
  return prisma.facultyCoordinator.findUnique({
    where: { id },
    include: {
      mentoredProjects: {
        select: { id: true, title: true, slug: true, status: true },
      },
    },
  });
};

export const createFaculty = async (data: any) => {
  return prisma.facultyCoordinator.create({
    data,
  });
};

export const updateFaculty = async (id: string, data: any) => {
  return prisma.facultyCoordinator.update({
    where: { id },
    data,
  });
};

export const deleteFaculty = async (id: string) => {
  return prisma.facultyCoordinator.delete({
    where: { id },
  });
};
