import { prisma } from '../config/prisma.js';
import { ProjectStatus } from '@prisma/client';

export interface ProjectFilterOptions {
  page: number;
  limit: number;
  status?: ProjectStatus;
  featured?: boolean;
  search?: string;
  tag?: string;
}

export const getAllProjects = async (options: ProjectFilterOptions) => {
  const { page, limit, status, featured, search, tag } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (featured !== undefined) where.featured = featured;
  if (tag) where.tags = { has: tag };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { problem: { contains: search, mode: 'insensitive' } },
      { solution: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      include: {
        mentorFaculty: {
          select: { id: true, name: true, designation: true },
        },
        mentorMember: {
          select: { id: true, name: true, role: true, imageUrl: true },
        },
        teamMembers: {
          include: {
            member: {
              select: { id: true, name: true, role: true, imageUrl: true },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
    }),
  ]);

  return {
    projects,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProjectById = async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
    include: {
      mentorFaculty: true,
      mentorMember: true,
      teamMembers: {
        include: {
          member: true,
        },
        orderBy: { displayOrder: 'asc' },
      },
    },
  });
};

export const createProject = async (data: any) => {
  const { teamMembers, ...projectData } = data;

  // Validate mentors if provided
  if (projectData.mentorFacultyId) {
    const faculty = await prisma.facultyCoordinator.findUnique({ where: { id: projectData.mentorFacultyId } });
    if (!faculty) throw new Error('REFERENCED_FACULTY_NOT_FOUND');
  }

  if (projectData.mentorMemberId) {
    const member = await prisma.member.findUnique({ where: { id: projectData.mentorMemberId } });
    if (!member) throw new Error('REFERENCED_MEMBER_NOT_FOUND');
  }

  // Validate team members
  if (teamMembers && teamMembers.length > 0) {
    const memberIds = teamMembers.map((tm: any) => tm.memberId);
    const existingMembers = await prisma.member.findMany({
      where: { id: { in: memberIds } },
      select: { id: true },
    });
    if (existingMembers.length !== memberIds.length) {
      throw new Error('ONE_OR_MORE_TEAM_MEMBERS_NOT_FOUND');
    }
  }

  // Use transaction to create Project and ProjectMember rows atomically
  return prisma.$transaction(async (tx) => {
    const createdProject = await tx.project.create({
      data: projectData,
    });

    if (teamMembers && teamMembers.length > 0) {
      await tx.projectMember.createMany({
        data: teamMembers.map((tm: any) => ({
          projectId: createdProject.id,
          memberId: tm.memberId,
          roleInProject: tm.roleInProject || 'Contributor',
          displayOrder: tm.displayOrder ?? 0,
        })),
      });
    }

    return tx.project.findUnique({
      where: { id: createdProject.id },
      include: {
        teamMembers: {
          include: { member: true },
        },
        mentorFaculty: true,
        mentorMember: true,
      },
    });
  });
};

export const updateProject = async (id: string, data: any) => {
  const { teamMembers, ...projectData } = data;

  // Validate mentors if updated
  if (projectData.mentorFacultyId) {
    const faculty = await prisma.facultyCoordinator.findUnique({ where: { id: projectData.mentorFacultyId } });
    if (!faculty) throw new Error('REFERENCED_FACULTY_NOT_FOUND');
  }

  if (projectData.mentorMemberId) {
    const member = await prisma.member.findUnique({ where: { id: projectData.mentorMemberId } });
    if (!member) throw new Error('REFERENCED_MEMBER_NOT_FOUND');
  }

  return prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: { id },
      data: projectData,
    });

    if (teamMembers !== undefined) {
      // Validate members
      if (teamMembers.length > 0) {
        const memberIds = teamMembers.map((tm: any) => tm.memberId);
        const existingMembers = await tx.member.findMany({
          where: { id: { in: memberIds } },
          select: { id: true },
        });
        if (existingMembers.length !== memberIds.length) {
          throw new Error('ONE_OR_MORE_TEAM_MEMBERS_NOT_FOUND');
        }
      }

      // Reconcile team members: clear old, insert updated
      await tx.projectMember.deleteMany({
        where: { projectId: id },
      });

      if (teamMembers.length > 0) {
        await tx.projectMember.createMany({
          data: teamMembers.map((tm: any) => ({
            projectId: id,
            memberId: tm.memberId,
            roleInProject: tm.roleInProject || 'Contributor',
            displayOrder: tm.displayOrder ?? 0,
          })),
        });
      }
    }

    return tx.project.findUnique({
      where: { id },
      include: {
        teamMembers: {
          include: { member: true },
        },
        mentorFaculty: true,
        mentorMember: true,
      },
    });
  });
};

export const deleteProject = async (id: string) => {
  return prisma.project.delete({
    where: { id },
  });
};
