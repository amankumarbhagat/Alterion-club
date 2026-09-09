import { z } from 'zod';
import {
  AdminRole,
  EventStatus,
  RegistrationStatus,
  ProjectStatus,
  AnnouncementCategory,
  GalleryCategory,
  ApplicationStatus,
} from '@prisma/client';

// ---------------------------------------------------------------------------
// Common Param & Query Schemas
// ---------------------------------------------------------------------------

export const uuidParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format.'),
  }),
});

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    search: z.string().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Member Schemas
// ---------------------------------------------------------------------------

export const createMemberSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    role: z.string().min(2, 'Role must be at least 2 characters').max(100),
    divisionId: z.string().uuid('Invalid division ID'),
    email: z.string().email('Invalid email address'),
    github: z.string().max(255).optional().default(''),
    linkedin: z.string().max(255).optional().default(''),
    imageUrl: z.string().optional().default(''),
    bio: z.string().optional().default(''),
    skills: z.array(z.string()).optional().default([]),
    isLeadership: z.boolean().optional().default(false),
    displayOrder: z.number().int().optional().default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
  body: createMemberSchema.shape.body.partial(),
});

// ---------------------------------------------------------------------------
// Division Schemas
// ---------------------------------------------------------------------------

export const createDivisionSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    slug: z
      .string()
      .min(2, 'Slug must be at least 2 characters')
      .max(100)
      .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and dashes'),
    description: z.string().min(5, 'Description is required'),
    leadId: z.string().uuid('Invalid lead member ID').nullable().optional(),
    responsibilities: z.array(z.string()).optional().default([]),
    skills: z.array(z.string()).optional().default([]),
    tools: z.array(z.string()).optional().default([]),
    ongoingWork: z.string().optional().default(''),
    iconName: z.string().max(50).optional().default('Code'),
    displayOrder: z.number().int().optional().default(0),
  }),
});

export const updateDivisionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
  body: createDivisionSchema.shape.body.partial(),
});

// ---------------------------------------------------------------------------
// Project Schemas
// ---------------------------------------------------------------------------

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200),
    slug: z
      .string()
      .min(2)
      .max(200)
      .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and dashes'),
    problem: z.string().min(5, 'Problem statement is required'),
    solution: z.string().min(5, 'Solution description is required'),
    description: z.string().min(5, 'Detailed description is required'),
    imageUrl: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    mentorFacultyId: z.string().uuid().nullable().optional(),
    mentorMemberId: z.string().uuid().nullable().optional(),
    externalMentorName: z.string().max(100).nullable().optional(),
    progress: z.number().int().min(0).max(100).optional().default(0),
    githubUrl: z.string().max(255).optional().default(''),
    demoUrl: z.string().max(255).optional().default(''),
    status: z.nativeEnum(ProjectStatus).optional().default(ProjectStatus.ACTIVE),
    featured: z.boolean().optional().default(false),
    displayOrder: z.number().int().optional().default(0),
    teamMembers: z
      .array(
        z.object({
          memberId: z.string().uuid('Invalid member ID'),
          roleInProject: z.string().max(100).optional().default('Contributor'),
          displayOrder: z.number().int().optional().default(0),
        })
      )
      .optional()
      .default([]),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
  body: createProjectSchema.shape.body.partial(),
});

// ---------------------------------------------------------------------------
// Event Schemas
// ---------------------------------------------------------------------------

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200),
    slug: z
      .string()
      .min(2)
      .max(200)
      .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and dashes'),
    description: z.string().min(5, 'Description is required'),
    eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format (must be ISO or parseable date)',
    }),
    eventTime: z.string().min(1, 'Time is required').max(50),
    venue: z.string().min(2, 'Venue is required').max(150),
    coordinatorId: z.string().uuid().nullable().optional(),
    externalCoordinatorName: z.string().max(100).nullable().optional(),
    imageUrl: z.string().optional().default(''),
    status: z.nativeEnum(EventStatus).optional().default(EventStatus.UPCOMING),
    registrationLink: z.string().max(255).optional().default(''),
    registrationEnabled: z.boolean().optional().default(true),
    winners: z.array(z.string()).optional().default([]),
    galleryUrls: z.array(z.string()).optional().default([]),
  }),
});

export const updateEventSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
  body: createEventSchema.shape.body.partial(),
});

// ---------------------------------------------------------------------------
// Event Registration Schemas
// ---------------------------------------------------------------------------

export const updateRegistrationStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid registration ID'),
  }),
  body: z.object({
    status: z.nativeEnum(RegistrationStatus, {
      errorMap: () => ({ message: 'Invalid registration status (PENDING, CONFIRMED, ATTENDED, CANCELLED)' }),
    }),
  }),
});

export const eventRegistrationsQuerySchema = z.object({
  params: z.object({
    eventId: z.string().uuid('Invalid event ID'),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    status: z.nativeEnum(RegistrationStatus).optional(),
    search: z.string().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Achievement Schemas
// ---------------------------------------------------------------------------

export const createAchievementSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200),
    dateAchieved: z.string().min(2).max(50),
    description: z.string().min(5, 'Description is required'),
    imageUrl: z.string().optional().default(''),
    badge: z.string().min(2).max(100),
    featured: z.boolean().optional().default(false),
    displayOrder: z.number().int().optional().default(0),
  }),
});

export const updateAchievementSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
  body: createAchievementSchema.shape.body.partial(),
});

// ---------------------------------------------------------------------------
// Announcement Schemas
// ---------------------------------------------------------------------------

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200),
    content: z.string().min(5, 'Content is required'),
    category: z.nativeEnum(AnnouncementCategory).optional().default(AnnouncementCategory.GENERAL),
    isActive: z.boolean().optional().default(true),
    datePosted: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      }),
  }),
});

export const updateAnnouncementSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
  body: createAnnouncementSchema.shape.body.partial(),
});

// ---------------------------------------------------------------------------
// Partner Schemas
// ---------------------------------------------------------------------------

export const createPartnerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(150),
    logoUrl: z.string().optional().default(''),
    partnerType: z.string().min(2).max(100),
    description: z.string().min(5, 'Description is required'),
    website: z.string().max(255).optional().default(''),
    displayOrder: z.number().int().optional().default(0),
  }),
});

export const updatePartnerSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
  body: createPartnerSchema.shape.body.partial(),
});

// ---------------------------------------------------------------------------
// Gallery Schemas
// ---------------------------------------------------------------------------

export const createGallerySchema = z.object({
  body: z.object({
    imageUrl: z.string().min(5, 'Image URL is required'),
    caption: z.string().min(2, 'Caption is required'),
    category: z.nativeEnum(GalleryCategory).optional().default(GalleryCategory.EVENTS),
    eventId: z.string().uuid().nullable().optional(),
    displayOrder: z.number().int().optional().default(0),
  }),
});

export const updateGallerySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
  body: createGallerySchema.shape.body.partial(),
});

// ---------------------------------------------------------------------------
// Faculty Coordinator Schemas
// ---------------------------------------------------------------------------

export const createFacultySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    designation: z.string().min(2).max(150),
    department: z.string().min(2).max(150),
    imageUrl: z.string().optional().default(''),
    bio: z.string().min(5, 'Bio is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7).max(50),
    office: z.string().min(2).max(150),
    displayOrder: z.number().int().optional().default(0),
  }),
});

export const updateFacultySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
  body: createFacultySchema.shape.body.partial(),
});

// ---------------------------------------------------------------------------
// Application Schemas
// ---------------------------------------------------------------------------

export const updateApplicationStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid application ID'),
  }),
  body: z.object({
    status: z.nativeEnum(ApplicationStatus).optional(),
    adminNotes: z.string().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Contact Message Schemas
// ---------------------------------------------------------------------------

export const updateContactMessageSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid contact message ID'),
  }),
  body: z.object({
    isRead: z.boolean().optional(),
    adminReply: z.string().optional(),
  }),
});

// ---------------------------------------------------------------------------
// Admin User Management Schemas
// ---------------------------------------------------------------------------

export const createAdminUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50)
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username must only contain letters, numbers, underscores, or dashes'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(200),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    role: z.nativeEnum(AdminRole).default(AdminRole.ADMIN),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateAdminUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    role: z.nativeEnum(AdminRole).optional(),
    isActive: z.boolean().optional(),
    password: z.string().min(8).max(200).optional(),
  }),
});
