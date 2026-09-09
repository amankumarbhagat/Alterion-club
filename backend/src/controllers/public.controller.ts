import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { EventRegistrationInput, ApplicationSubmissionInput, ContactMessageInput } from '../schemas/public.schema.js';
import { EventStatus, ProjectStatus, AnnouncementCategory, GalleryCategory } from '@prisma/client';

// Helper to extract safe pagination parameters (max 100 per page to avoid unlimited dumps)
const parsePagination = (query: Request['query'], defaultLimit = 50, maxLimit = 100) => {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit as string, 10) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// ========================================================
// DIVISIONS
// ========================================================

export const getDivisions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit, skip } = parsePagination(req.query, 50, 100);

    const divisions = await prisma.division.findMany({
      take: limit,
      skip,
      orderBy: { displayOrder: 'asc' },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            role: true,
            imageUrl: true,
            email: true,
          },
        },
        _count: {
          select: { members: { where: { isActive: true } } },
        },
      },
    });

    sendSuccess(res, divisions, 'Divisions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getDivisionBySlugOrId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const identifier = (req.params.identifier as string) || '';
    if (!identifier) {
      sendError(res, 'Division identifier is required', 400);
      return;
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    const division = await prisma.division.findFirst({
      where: isUuid ? { id: identifier } : { slug: identifier },
      include: {
        lead: true,
        members: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!division) {
      sendError(res, 'Division not found', 404);
      return;
    }

    sendSuccess(res, division, 'Division details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ========================================================
// MEMBERS
// ========================================================

export const getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { divisionId, isLeadership, search } = req.query;
    const { limit, skip } = parsePagination(req.query, 50, 100);

    const whereClause: any = { isActive: true };

    if (divisionId && typeof divisionId === 'string') {
      whereClause.divisionId = divisionId;
    }

    if (isLeadership !== undefined) {
      whereClause.isLeadership = isLeadership === 'true';
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
      ];
    }

    const members = await prisma.member.findMany({
      where: whereClause,
      take: limit,
      skip,
      include: {
        division: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [{ isLeadership: 'desc' }, { displayOrder: 'asc' }],
    });

    sendSuccess(res, members, 'Members retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMemberById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = (req.params.id as string) || '';
    if (!id) {
      sendError(res, 'Member ID is required', 400);
      return;
    }

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        division: true,
        projects: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                imageUrl: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!member || !member.isActive) {
      sendError(res, 'Member not found', 404);
      return;
    }

    sendSuccess(res, member, 'Member profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ========================================================
// PROJECTS
// ========================================================

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, featured, search, tag } = req.query;
    const { limit, skip } = parsePagination(req.query, 50, 100);

    const whereClause: any = {};

    if (status && typeof status === 'string' && Object.values(ProjectStatus).includes(status as ProjectStatus)) {
      whereClause.status = status as ProjectStatus;
    }

    if (featured !== undefined) {
      whereClause.featured = featured === 'true';
    }

    if (tag && typeof tag === 'string') {
      whereClause.tags = { has: tag };
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { problem: { contains: search, mode: 'insensitive' } },
        { solution: { contains: search, mode: 'insensitive' } },
      ];
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      take: limit,
      skip,
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
              select: { id: true, name: true, role: true, imageUrl: true, github: true, linkedin: true },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
    });

    sendSuccess(res, projects, 'Projects retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlugOrId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const identifier = (req.params.identifier as string) || '';
    if (!identifier) {
      sendError(res, 'Project identifier is required', 400);
      return;
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    const project = await prisma.project.findFirst({
      where: isUuid ? { id: identifier } : { slug: identifier },
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

    if (!project) {
      sendError(res, 'Project not found', 404);
      return;
    }

    sendSuccess(res, project, 'Project details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ========================================================
// EVENTS & REGISTRATION
// ========================================================

export const getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    const { limit, skip } = parsePagination(req.query, 50, 100);

    const whereClause: any = {};

    if (status && typeof status === 'string' && Object.values(EventStatus).includes(status as EventStatus)) {
      whereClause.status = status as EventStatus;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      take: limit,
      skip,
      include: {
        coordinator: {
          select: { id: true, name: true, role: true, imageUrl: true, email: true },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { eventDate: 'desc' },
    });

    sendSuccess(res, events, 'Events retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getEventBySlugOrId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const identifier = (req.params.identifier as string) || '';
    if (!identifier) {
      sendError(res, 'Event identifier is required', 400);
      return;
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    const event = await prisma.event.findFirst({
      where: isUuid ? { id: identifier } : { slug: identifier },
      include: {
        coordinator: true,
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      sendError(res, 'Event not found', 404);
      return;
    }

    sendSuccess(res, event, 'Event details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const eventId = (req.params.id as string) || '';
    if (!eventId) {
      sendError(res, 'Event ID is required', 400);
      return;
    }

    const input: EventRegistrationInput = req.body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      sendError(res, 'Event not found', 404);
      return;
    }

    if (!event.registrationEnabled) {
      sendError(res, 'Registrations are currently closed for this event', 400);
      return;
    }

    // Check existing registration
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_email: {
          eventId,
          email: input.email.toLowerCase(),
        },
      },
    });

    if (existing) {
      sendError(res, 'You have already registered for this event with this email address', 409);
      return;
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        college: input.college || 'BMSIT&M',
        usn: input.usn || '',
        branch: input.branch,
        year: input.year,
        teamName: input.teamName || null,
        status: 'PENDING',
      },
    });

    sendSuccess(res, registration, 'Event registration submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

// ========================================================
// ACHIEVEMENTS
// ========================================================

export const getAchievements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { featured } = req.query;
    const { limit, skip } = parsePagination(req.query, 50, 100);

    const whereClause: any = {};
    if (featured !== undefined) {
      whereClause.featured = featured === 'true';
    }

    const achievements = await prisma.achievement.findMany({
      where: whereClause,
      take: limit,
      skip,
      orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
    });

    sendSuccess(res, achievements, 'Achievements retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ========================================================
// ANNOUNCEMENTS
// ========================================================

export const getAnnouncements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.query;
    const { limit, skip } = parsePagination(req.query, 50, 100);

    const whereClause: any = { isActive: true };

    if (category && typeof category === 'string' && Object.values(AnnouncementCategory).includes(category as AnnouncementCategory)) {
      whereClause.category = category as AnnouncementCategory;
    }

    const announcements = await prisma.announcement.findMany({
      where: whereClause,
      take: limit,
      skip,
      orderBy: { datePosted: 'desc' },
    });

    sendSuccess(res, announcements, 'Announcements retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ========================================================
// PARTNERS
// ========================================================

export const getPartners = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit, skip } = parsePagination(req.query, 50, 100);

    const partners = await prisma.partner.findMany({
      take: limit,
      skip,
      orderBy: { displayOrder: 'asc' },
    });

    sendSuccess(res, partners, 'Partners retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ========================================================
// GALLERY
// ========================================================

export const getGallery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, eventId } = req.query;
    const { limit, skip } = parsePagination(req.query, 50, 100);

    const whereClause: any = {};

    if (category && typeof category === 'string' && Object.values(GalleryCategory).includes(category as GalleryCategory)) {
      whereClause.category = category as GalleryCategory;
    }

    if (eventId && typeof eventId === 'string') {
      whereClause.eventId = eventId;
    }

    const items = await prisma.galleryItem.findMany({
      where: whereClause,
      take: limit,
      skip,
      include: {
        event: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    sendSuccess(res, items, 'Gallery items retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ========================================================
// FACULTY & SITE STATS
// ========================================================

export const getFaculty = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const faculty = await prisma.facultyCoordinator.findFirst({
      orderBy: { displayOrder: 'asc' },
    });

    sendSuccess(res, faculty, 'Faculty coordinator details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getSiteStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const config = await prisma.siteMetricsConfig.findFirst();

    if (config && config.overrideComputedStats) {
      sendSuccess(
        res,
        {
          projectsCount: config.manualProjectsCount ?? 0,
          eventsCount: config.manualEventsCount ?? 0,
          membersCount: config.manualMembersCount ?? 0,
          divisionsCount: config.manualDivisionsCount ?? 0,
          partnersCount: config.manualPartnersCount ?? 0,
          isOverridden: true,
        },
        'Site metrics retrieved successfully (Manual Override)'
      );
      return;
    }

    // Compute active counts dynamically
    const [projectsCount, eventsCount, membersCount, divisionsCount, partnersCount] = await Promise.all([
      prisma.project.count({ where: { status: 'ACTIVE' } }),
      prisma.event.count(),
      prisma.member.count({ where: { isActive: true } }),
      prisma.division.count(),
      prisma.partner.count(),
    ]);

    sendSuccess(
      res,
      {
        projectsCount,
        eventsCount,
        membersCount,
        divisionsCount,
        partnersCount,
        isOverridden: false,
      },
      'Site metrics retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// ========================================================
// PUBLIC RECRUITMENT APPLICATIONS & CONTACT MESSAGES
// ========================================================

export const submitApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input: ApplicationSubmissionInput = req.body;

    // Verify division exists
    const division = await prisma.division.findUnique({
      where: { id: input.divisionId },
    });

    if (!division) {
      sendError(res, 'Target division not found', 404);
      return;
    }

    const application = await prisma.application.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        branch: input.branch,
        year: input.year,
        divisionId: input.divisionId,
        skills: input.skills,
        motivation: input.motivation,
        projects: input.projects || '',
        github: input.github || '',
        linkedin: input.linkedin || '',
        portfolio: input.portfolio || '',
        resumeUrl: input.resumeUrl || '',
        resumeName: input.resumeName || '',
        status: 'PENDING',
      },
    });

    sendSuccess(res, application, 'Recruitment application submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const submitContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input: ContactMessageInput = req.body;

    const message = await prisma.contactMessage.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        subject: input.subject,
        message: input.message,
        isRead: false,
      },
    });

    sendSuccess(res, message, 'Contact message sent successfully', 201);
  } catch (error) {
    next(error);
  }
};
