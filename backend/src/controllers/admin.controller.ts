import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import * as memberService from '../services/member.service.js';
import * as divisionService from '../services/division.service.js';
import * as projectService from '../services/project.service.js';
import * as eventService from '../services/event.service.js';
import * as registrationService from '../services/registration.service.js';
import * as achievementService from '../services/achievement.service.js';
import * as announcementService from '../services/announcement.service.js';
import * as partnerService from '../services/partner.service.js';
import * as galleryService from '../services/gallery.service.js';
import * as facultyService from '../services/faculty.service.js';
import * as applicationService from '../services/application.service.js';
import * as contactService from '../services/contact.service.js';
import * as adminUserService from '../services/adminUser.service.js';

// Helper to extract pagination
const getPagination = (query: Request['query']) => ({
  page: Math.max(1, parseInt(query.page as string, 10) || 1),
  limit: Math.min(100, Math.max(1, parseInt(query.limit as string, 10) || 50)),
  search: typeof query.search === 'string' ? query.search : undefined,
});

// ========================================================
// MEMBERS CRUD
// ========================================================

export const listMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const { divisionId, isLeadership, isActive } = req.query;

    const result = await memberService.getAllMembers({
      page,
      limit,
      search,
      divisionId: typeof divisionId === 'string' ? divisionId : undefined,
      isLeadership: isLeadership !== undefined ? isLeadership === 'true' : undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });

    sendSuccess(res, result, 'Members retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const member = await memberService.getMemberById(req.params.id as string);
    if (!member) {
      sendError(res, 'Member not found', 404);
      return;
    }
    sendSuccess(res, member, 'Member retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const member = await memberService.createMember(req.body);
    sendSuccess(res, member, 'Member created successfully', 201);
  } catch (err: any) {
    if (err.message === 'REFERENCED_DIVISION_NOT_FOUND') {
      sendError(res, 'Referenced division does not exist', 400);
      return;
    }
    next(err);
  }
};

export const updateMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const member = await memberService.updateMember(req.params.id as string, req.body);
    sendSuccess(res, member, 'Member updated successfully');
  } catch (err: any) {
    if (err.message === 'REFERENCED_DIVISION_NOT_FOUND') {
      sendError(res, 'Referenced division does not exist', 400);
      return;
    }
    next(err);
  }
};

export const deleteMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await memberService.deleteMember(req.params.id as string);
    sendSuccess(res, undefined, 'Member deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// DIVISIONS CRUD
// ========================================================

export const listDivisions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const divisions = await divisionService.getAllDivisions();
    sendSuccess(res, divisions, 'Divisions retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getDivision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const division = await divisionService.getDivisionById(req.params.id as string);
    if (!division) {
      sendError(res, 'Division not found', 404);
      return;
    }
    sendSuccess(res, division, 'Division retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createDivision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const division = await divisionService.createDivision(req.body);
    sendSuccess(res, division, 'Division created successfully', 201);
  } catch (err: any) {
    if (err.message === 'REFERENCED_LEAD_NOT_FOUND') {
      sendError(res, 'Referenced lead member does not exist', 400);
      return;
    }
    next(err);
  }
};

export const updateDivision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const division = await divisionService.updateDivision(req.params.id as string, req.body);
    sendSuccess(res, division, 'Division updated successfully');
  } catch (err: any) {
    if (err.message === 'REFERENCED_LEAD_NOT_FOUND') {
      sendError(res, 'Referenced lead member does not exist', 400);
      return;
    }
    next(err);
  }
};

export const deleteDivision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await divisionService.deleteDivision(req.params.id as string);
    sendSuccess(res, undefined, 'Division deleted successfully');
  } catch (err: any) {
    if (err.message === 'CANNOT_DELETE_DIVISION_WITH_MEMBERS') {
      sendError(res, 'Cannot delete division with active members. Please reassign or remove members first.', 400);
      return;
    }
    if (err.message === 'CANNOT_DELETE_DIVISION_WITH_APPLICATIONS') {
      sendError(res, 'Cannot delete division with active recruitment applications.', 400);
      return;
    }
    next(err);
  }
};

// ========================================================
// PROJECTS CRUD
// ========================================================

export const listProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const { status, featured, tag } = req.query;

    const result = await projectService.getAllProjects({
      page,
      limit,
      search,
      status: status as any,
      featured: featured !== undefined ? featured === 'true' : undefined,
      tag: typeof tag === 'string' ? tag : undefined,
    });

    sendSuccess(res, result, 'Projects retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await projectService.getProjectById(req.params.id as string);
    if (!project) {
      sendError(res, 'Project not found', 404);
      return;
    }
    sendSuccess(res, project, 'Project retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await projectService.createProject(req.body);
    sendSuccess(res, project, 'Project created successfully', 201);
  } catch (err: any) {
    if (err.message === 'REFERENCED_FACULTY_NOT_FOUND') {
      sendError(res, 'Referenced mentor faculty does not exist', 400);
      return;
    }
    if (err.message === 'REFERENCED_MEMBER_NOT_FOUND') {
      sendError(res, 'Referenced mentor member does not exist', 400);
      return;
    }
    if (err.message === 'ONE_OR_MORE_TEAM_MEMBERS_NOT_FOUND') {
      sendError(res, 'One or more assigned team members do not exist', 400);
      return;
    }
    next(err);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await projectService.updateProject(req.params.id as string, req.body);
    sendSuccess(res, project, 'Project updated successfully');
  } catch (err: any) {
    if (err.message === 'REFERENCED_FACULTY_NOT_FOUND') {
      sendError(res, 'Referenced mentor faculty does not exist', 400);
      return;
    }
    if (err.message === 'REFERENCED_MEMBER_NOT_FOUND') {
      sendError(res, 'Referenced mentor member does not exist', 400);
      return;
    }
    if (err.message === 'ONE_OR_MORE_TEAM_MEMBERS_NOT_FOUND') {
      sendError(res, 'One or more assigned team members do not exist', 400);
      return;
    }
    next(err);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await projectService.deleteProject(req.params.id as string);
    sendSuccess(res, undefined, 'Project deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// EVENTS CRUD
// ========================================================

export const listEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const { status } = req.query;

    const result = await eventService.getAllEvents({
      page,
      limit,
      search,
      status: status as any,
    });

    sendSuccess(res, result, 'Events retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await eventService.getEventById(req.params.id as string);
    if (!event) {
      sendError(res, 'Event not found', 404);
      return;
    }
    sendSuccess(res, event, 'Event retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await eventService.createEvent(req.body);
    sendSuccess(res, event, 'Event created successfully', 201);
  } catch (err: any) {
    if (err.message === 'REFERENCED_COORDINATOR_NOT_FOUND') {
      sendError(res, 'Referenced coordinator member does not exist', 400);
      return;
    }
    next(err);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await eventService.updateEvent(req.params.id as string, req.body);
    sendSuccess(res, event, 'Event updated successfully');
  } catch (err: any) {
    if (err.message === 'REFERENCED_COORDINATOR_NOT_FOUND') {
      sendError(res, 'Referenced coordinator member does not exist', 400);
      return;
    }
    next(err);
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await eventService.deleteEvent(req.params.id as string);
    sendSuccess(res, undefined, 'Event deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// EVENT REGISTRATIONS
// ========================================================

export const listEventRegistrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const { status } = req.query;

    const result = await registrationService.getEventRegistrations({
      eventId: req.params.eventId as string,
      page,
      limit,
      status: status as any,
      search,
    });

    sendSuccess(res, result, 'Registrations retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reg = await registrationService.getRegistrationById(req.params.id as string);
    if (!reg) {
      sendError(res, 'Registration not found', 404);
      return;
    }
    sendSuccess(res, reg, 'Registration retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateRegistrationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reg = await registrationService.updateRegistrationStatus(req.params.id as string, req.body.status);
    sendSuccess(res, reg, 'Registration status updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await registrationService.deleteRegistration(req.params.id as string);
    sendSuccess(res, undefined, 'Registration deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// ACHIEVEMENTS CRUD
// ========================================================

export const listAchievements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const { featured } = req.query;

    const result = await achievementService.getAllAchievements({
      page,
      limit,
      search,
      featured: featured !== undefined ? featured === 'true' : undefined,
    });

    sendSuccess(res, result, 'Achievements retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getAchievement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await achievementService.getAchievementById(req.params.id as string);
    if (!item) {
      sendError(res, 'Achievement not found', 404);
      return;
    }
    sendSuccess(res, item, 'Achievement retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createAchievement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await achievementService.createAchievement(req.body);
    sendSuccess(res, item, 'Achievement created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateAchievement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await achievementService.updateAchievement(req.params.id as string, req.body);
    sendSuccess(res, item, 'Achievement updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteAchievement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await achievementService.deleteAchievement(req.params.id as string);
    sendSuccess(res, undefined, 'Achievement deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// ANNOUNCEMENTS CRUD
// ========================================================

export const listAnnouncements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const { category, isActive } = req.query;

    const result = await announcementService.getAllAnnouncements({
      page,
      limit,
      search,
      category: category as any,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });

    sendSuccess(res, result, 'Announcements retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await announcementService.getAnnouncementById(req.params.id as string);
    if (!item) {
      sendError(res, 'Announcement not found', 404);
      return;
    }
    sendSuccess(res, item, 'Announcement retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await announcementService.createAnnouncement(req.body);
    sendSuccess(res, item, 'Announcement created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await announcementService.updateAnnouncement(req.params.id as string, req.body);
    sendSuccess(res, item, 'Announcement updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteAnnouncement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await announcementService.deleteAnnouncement(req.params.id as string);
    sendSuccess(res, undefined, 'Announcement deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// PARTNERS CRUD
// ========================================================

export const listPartners = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const result = await partnerService.getAllPartners({ page, limit, search });
    sendSuccess(res, result, 'Partners retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getPartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const partner = await partnerService.getPartnerById(req.params.id as string);
    if (!partner) {
      sendError(res, 'Partner not found', 404);
      return;
    }
    sendSuccess(res, partner, 'Partner retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createPartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const partner = await partnerService.createPartner(req.body);
    sendSuccess(res, partner, 'Partner created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updatePartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const partner = await partnerService.updatePartner(req.params.id as string, req.body);
    sendSuccess(res, partner, 'Partner updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deletePartner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await partnerService.deletePartner(req.params.id as string);
    sendSuccess(res, undefined, 'Partner deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// GALLERY CRUD
// ========================================================

export const listGallery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const { category, eventId } = req.query;

    const result = await galleryService.getAllGalleryItems({
      page,
      limit,
      search,
      category: category as any,
      eventId: typeof eventId === 'string' ? eventId : undefined,
    });

    sendSuccess(res, result, 'Gallery items retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getGalleryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await galleryService.getGalleryItemById(req.params.id as string);
    if (!item) {
      sendError(res, 'Gallery item not found', 404);
      return;
    }
    sendSuccess(res, item, 'Gallery item retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createGalleryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await galleryService.createGalleryItem(req.body);
    sendSuccess(res, item, 'Gallery item created successfully', 201);
  } catch (err: any) {
    if (err.message === 'REFERENCED_EVENT_NOT_FOUND') {
      sendError(res, 'Referenced event does not exist', 400);
      return;
    }
    next(err);
  }
};

export const updateGalleryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await galleryService.updateGalleryItem(req.params.id as string, req.body);
    sendSuccess(res, item, 'Gallery item updated successfully');
  } catch (err: any) {
    if (err.message === 'REFERENCED_EVENT_NOT_FOUND') {
      sendError(res, 'Referenced event does not exist', 400);
      return;
    }
    next(err);
  }
};

export const deleteGalleryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await galleryService.deleteGalleryItem(req.params.id as string);
    sendSuccess(res, undefined, 'Gallery item deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// FACULTY CRUD
// ========================================================

export const listFaculty = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const faculty = await facultyService.getAllFaculty();
    sendSuccess(res, faculty, 'Faculty list retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getFaculty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const faculty = await facultyService.getFacultyById(req.params.id as string);
    if (!faculty) {
      sendError(res, 'Faculty coordinator not found', 404);
      return;
    }
    sendSuccess(res, faculty, 'Faculty coordinator retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createFaculty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const faculty = await facultyService.createFaculty(req.body);
    sendSuccess(res, faculty, 'Faculty coordinator created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateFaculty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const faculty = await facultyService.updateFaculty(req.params.id as string, req.body);
    sendSuccess(res, faculty, 'Faculty coordinator updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteFaculty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await facultyService.deleteFaculty(req.params.id as string);
    sendSuccess(res, undefined, 'Faculty coordinator deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// APPLICATIONS MANAGEMENT
// ========================================================

export const listApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const { status, divisionId } = req.query;

    const result = await applicationService.getAllApplications({
      page,
      limit,
      search,
      status: status as any,
      divisionId: typeof divisionId === 'string' ? divisionId : undefined,
    });

    sendSuccess(res, result, 'Applications retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const app = await applicationService.getApplicationById(req.params.id as string);
    if (!app) {
      sendError(res, 'Application not found', 404);
      return;
    }
    sendSuccess(res, app, 'Application retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const app = await applicationService.updateApplicationStatus(req.params.id as string, req.body);
    sendSuccess(res, app, 'Application status updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await applicationService.deleteApplication(req.params.id as string);
    sendSuccess(res, undefined, 'Application deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// CONTACT MESSAGES MANAGEMENT
// ========================================================

export const listContactMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const { isRead } = req.query;

    const result = await contactService.getAllContactMessages({
      page,
      limit,
      search,
      isRead: isRead !== undefined ? isRead === 'true' : undefined,
    });

    sendSuccess(res, result, 'Contact messages retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const msg = await contactService.getContactMessageById(req.params.id as string);
    if (!msg) {
      sendError(res, 'Contact message not found', 404);
      return;
    }
    sendSuccess(res, msg, 'Contact message retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const msg = await contactService.updateContactMessage(req.params.id as string, req.body);
    sendSuccess(res, msg, 'Contact message updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await contactService.deleteContactMessage(req.params.id as string);
    sendSuccess(res, undefined, 'Contact message deleted successfully');
  } catch (err) {
    next(err);
  }
};

// ========================================================
// ADMIN USER MANAGEMENT (SUPERADMIN ONLY)
// ========================================================

export const listAdminUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search } = getPagination(req.query);
    const { role, isActive } = req.query;

    const result = await adminUserService.getAllAdminUsers({
      page,
      limit,
      search,
      role: role as any,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });

    sendSuccess(res, result, 'Admin users retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getAdminUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await adminUserService.getAdminUserById(req.params.id as string);
    if (!user) {
      sendError(res, 'Admin user not found', 404);
      return;
    }
    sendSuccess(res, user, 'Admin user retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createAdminUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const operatorRole = req.user!.role;
    const user = await adminUserService.createAdminUser(req.body, operatorRole);
    sendSuccess(res, user, 'Admin user created successfully', 201);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED_ROLE_ASSIGNMENT') {
      sendError(res, 'Only a SUPERADMIN can assign the SUPERADMIN role', 403);
      return;
    }
    next(err);
  }
};

export const updateAdminUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const operatorId = req.user!.id;
    const operatorRole = req.user!.role;
    const user = await adminUserService.updateAdminUser(
      req.params.id as string,
      req.body,
      operatorId,
      operatorRole
    );
    sendSuccess(res, user, 'Admin user updated successfully');
  } catch (err: any) {
    if (err.message === 'USER_NOT_FOUND') {
      sendError(res, 'User not found', 404);
      return;
    }
    if (err.message === 'FORBIDDEN_CANNOT_MODIFY_SUPERADMIN') {
      sendError(res, 'Cannot modify a SUPERADMIN account without SUPERADMIN privileges', 403);
      return;
    }
    if (err.message === 'FORBIDDEN_CANNOT_PROMOTE_TO_SUPERADMIN') {
      sendError(res, 'Cannot promote an account to SUPERADMIN without SUPERADMIN privileges', 403);
      return;
    }
    if (err.message === 'CANNOT_DEMOTE_LAST_SUPERADMIN') {
      sendError(res, 'Cannot demote the last active SUPERADMIN', 400);
      return;
    }
    if (err.message === 'CANNOT_DEACTIVATE_LAST_SUPERADMIN') {
      sendError(res, 'Cannot deactivate the last active SUPERADMIN', 400);
      return;
    }
    next(err);
  }
};

export const deleteAdminUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const operatorId = req.user!.id;
    await adminUserService.deleteAdminUser(req.params.id as string, operatorId);
    sendSuccess(res, undefined, 'Admin user deleted successfully');
  } catch (err: any) {
    if (err.message === 'CANNOT_DELETE_SELF') {
      sendError(res, 'You cannot delete your own admin account', 400);
      return;
    }
    if (err.message === 'USER_NOT_FOUND') {
      sendError(res, 'Admin user not found', 404);
      return;
    }
    if (err.message === 'CANNOT_DELETE_LAST_SUPERADMIN') {
      sendError(res, 'Cannot delete the last remaining SUPERADMIN', 400);
      return;
    }
    next(err);
  }
};
