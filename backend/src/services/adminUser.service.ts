import { prisma } from '../config/prisma.js';
import { hashPassword } from '../utils/password.js';
import { AdminRole } from '@prisma/client';

export interface AdminUserFilterOptions {
  page: number;
  limit: number;
  role?: AdminRole;
  isActive?: boolean;
  search?: string;
}

const safeUserSelect = {
  id: true,
  username: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllAdminUsers = async (options: AdminUserFilterOptions) => {
  const { page, limit, role, isActive, search } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive;
  if (search) {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, users] = await Promise.all([
    prisma.adminUser.count({ where }),
    prisma.adminUser.findMany({
      where,
      skip,
      take: limit,
      select: safeUserSelect,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAdminUserById = async (id: string) => {
  return prisma.adminUser.findUnique({
    where: { id },
    select: safeUserSelect,
  });
};

export const createAdminUser = async (
  data: {
    username: string;
    email: string;
    password: string;
    name: string;
    role: AdminRole;
    isActive?: boolean;
  },
  operatorRole: AdminRole
) => {
  // Only SUPERADMIN can create users with SUPERADMIN role
  if (data.role === AdminRole.SUPERADMIN && operatorRole !== AdminRole.SUPERADMIN) {
    throw new Error('UNAUTHORIZED_ROLE_ASSIGNMENT');
  }

  const passwordHash = await hashPassword(data.password);

  return prisma.adminUser.create({
    data: {
      username: data.username,
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: data.role,
      isActive: data.isActive ?? true,
    },
    select: safeUserSelect,
  });
};

export const updateAdminUser = async (
  id: string,
  data: {
    name?: string;
    role?: AdminRole;
    isActive?: boolean;
    password?: string;
  },
  _operatorId: string,
  operatorRole: AdminRole
) => {
  const targetUser = await prisma.adminUser.findUnique({ where: { id } });
  if (!targetUser) {
    throw new Error('USER_NOT_FOUND');
  }

  // Non-superadmin cannot modify a SUPERADMIN
  if (targetUser.role === AdminRole.SUPERADMIN && operatorRole !== AdminRole.SUPERADMIN) {
    throw new Error('FORBIDDEN_CANNOT_MODIFY_SUPERADMIN');
  }

  // Non-superadmin cannot promote anyone to SUPERADMIN
  if (data.role === AdminRole.SUPERADMIN && operatorRole !== AdminRole.SUPERADMIN) {
    throw new Error('FORBIDDEN_CANNOT_PROMOTE_TO_SUPERADMIN');
  }

  // If modifying self role from SUPERADMIN, prevent leaving 0 superadmins
  if (targetUser.role === AdminRole.SUPERADMIN && data.role && data.role !== AdminRole.SUPERADMIN) {
    const superadminCount = await prisma.adminUser.count({
      where: { role: AdminRole.SUPERADMIN, isActive: true },
    });
    if (superadminCount <= 1) {
      throw new Error('CANNOT_DEMOTE_LAST_SUPERADMIN');
    }
  }

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.isActive !== undefined) {
    if (targetUser.role === AdminRole.SUPERADMIN && data.isActive === false) {
      const activeSuperadmins = await prisma.adminUser.count({
        where: { role: AdminRole.SUPERADMIN, isActive: true },
      });
      if (activeSuperadmins <= 1) {
        throw new Error('CANNOT_DEACTIVATE_LAST_SUPERADMIN');
      }
    }
    updateData.isActive = data.isActive;
  }
  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  return prisma.adminUser.update({
    where: { id },
    data: updateData,
    select: safeUserSelect,
  });
};

export const deleteAdminUser = async (id: string, operatorId: string) => {
  if (id === operatorId) {
    throw new Error('CANNOT_DELETE_SELF');
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) {
    throw new Error('USER_NOT_FOUND');
  }

  if (target.role === AdminRole.SUPERADMIN) {
    const superadmins = await prisma.adminUser.count({
      where: { role: AdminRole.SUPERADMIN },
    });
    if (superadmins <= 1) {
      throw new Error('CANNOT_DELETE_LAST_SUPERADMIN');
    }
  }

  return prisma.adminUser.delete({
    where: { id },
    select: safeUserSelect,
  });
};
