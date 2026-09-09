import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  uuidParamSchema,
  createMemberSchema,
  updateMemberSchema,
  createDivisionSchema,
  updateDivisionSchema,
  createProjectSchema,
  updateProjectSchema,
  createEventSchema,
  updateEventSchema,
  updateRegistrationStatusSchema,
  eventRegistrationsQuerySchema,
  createAchievementSchema,
  updateAchievementSchema,
  createAnnouncementSchema,
  updateAnnouncementSchema,
  createPartnerSchema,
  updatePartnerSchema,
  createGallerySchema,
  updateGallerySchema,
  createFacultySchema,
  updateFacultySchema,
  updateApplicationStatusSchema,
  updateContactMessageSchema,
  createAdminUserSchema,
  updateAdminUserSchema,
} from '../schemas/admin.schema.js';
import * as controller from '../controllers/admin.controller.js';

const router = Router();

// ========================================================
// GLOBAL ADMIN AUTHENTICATION
// All routes below require valid HttpOnly access token
// ========================================================
router.use(requireAuth);

// --------------------------------------------------------
// MEMBERS CRUD
// --------------------------------------------------------
router.get(
  '/members',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  controller.listMembers
);
router.get(
  '/members/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(uuidParamSchema),
  controller.getMember
);
router.post(
  '/members',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(createMemberSchema),
  controller.createMember
);
router.put(
  '/members/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(updateMemberSchema),
  controller.updateMember
);
router.delete(
  '/members/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteMember
);

// --------------------------------------------------------
// DIVISIONS CRUD
// --------------------------------------------------------
router.get(
  '/divisions',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  controller.listDivisions
);
router.get(
  '/divisions/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(uuidParamSchema),
  controller.getDivision
);
router.post(
  '/divisions',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(createDivisionSchema),
  controller.createDivision
);
router.put(
  '/divisions/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(updateDivisionSchema),
  controller.updateDivision
);
router.delete(
  '/divisions/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteDivision
);

// --------------------------------------------------------
// PROJECTS CRUD
// --------------------------------------------------------
router.get(
  '/projects',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  controller.listProjects
);
router.get(
  '/projects/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(uuidParamSchema),
  controller.getProject
);
router.post(
  '/projects',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(createProjectSchema),
  controller.createProject
);
router.put(
  '/projects/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(updateProjectSchema),
  controller.updateProject
);
router.delete(
  '/projects/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteProject
);

// --------------------------------------------------------
// EVENTS CRUD
// --------------------------------------------------------
router.get(
  '/events',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  controller.listEvents
);
router.get(
  '/events/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(uuidParamSchema),
  controller.getEvent
);
router.post(
  '/events',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(createEventSchema),
  controller.createEvent
);
router.put(
  '/events/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(updateEventSchema),
  controller.updateEvent
);
router.delete(
  '/events/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteEvent
);

// --------------------------------------------------------
// EVENT REGISTRATIONS
// --------------------------------------------------------
router.get(
  '/events/:eventId/registrations',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(eventRegistrationsQuerySchema),
  controller.listEventRegistrations
);
router.get(
  '/registrations/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(uuidParamSchema),
  controller.getRegistration
);
router.patch(
  '/registrations/:id/status',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(updateRegistrationStatusSchema),
  controller.updateRegistrationStatus
);
router.delete(
  '/registrations/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteRegistration
);

// --------------------------------------------------------
// ACHIEVEMENTS CRUD
// --------------------------------------------------------
router.get(
  '/achievements',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  controller.listAchievements
);
router.get(
  '/achievements/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(uuidParamSchema),
  controller.getAchievement
);
router.post(
  '/achievements',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(createAchievementSchema),
  controller.createAchievement
);
router.put(
  '/achievements/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(updateAchievementSchema),
  controller.updateAchievement
);
router.delete(
  '/achievements/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteAchievement
);

// --------------------------------------------------------
// ANNOUNCEMENTS CRUD
// --------------------------------------------------------
router.get(
  '/announcements',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  controller.listAnnouncements
);
router.get(
  '/announcements/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(uuidParamSchema),
  controller.getAnnouncement
);
router.post(
  '/announcements',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(createAnnouncementSchema),
  controller.createAnnouncement
);
router.put(
  '/announcements/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(updateAnnouncementSchema),
  controller.updateAnnouncement
);
router.delete(
  '/announcements/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteAnnouncement
);

// --------------------------------------------------------
// PARTNERS CRUD
// --------------------------------------------------------
router.get(
  '/partners',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  controller.listPartners
);
router.get(
  '/partners/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(uuidParamSchema),
  controller.getPartner
);
router.post(
  '/partners',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(createPartnerSchema),
  controller.createPartner
);
router.put(
  '/partners/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(updatePartnerSchema),
  controller.updatePartner
);
router.delete(
  '/partners/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deletePartner
);

// --------------------------------------------------------
// GALLERY CRUD
// --------------------------------------------------------
router.get(
  '/gallery',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  controller.listGallery
);
router.get(
  '/gallery/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(uuidParamSchema),
  controller.getGalleryItem
);
router.post(
  '/gallery',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(createGallerySchema),
  controller.createGalleryItem
);
router.put(
  '/gallery/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(updateGallerySchema),
  controller.updateGalleryItem
);
router.delete(
  '/gallery/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteGalleryItem
);

// --------------------------------------------------------
// FACULTY CRUD
// --------------------------------------------------------
router.get(
  '/faculty',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  controller.listFaculty
);
router.get(
  '/faculty/:id',
  requireRole('SUPERADMIN', 'ADMIN', 'MODERATOR'),
  validateRequest(uuidParamSchema),
  controller.getFaculty
);
router.post(
  '/faculty',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(createFacultySchema),
  controller.createFaculty
);
router.put(
  '/faculty/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(updateFacultySchema),
  controller.updateFaculty
);
router.delete(
  '/faculty/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteFaculty
);

// --------------------------------------------------------
// APPLICATIONS MANAGEMENT
// --------------------------------------------------------
router.get(
  '/applications',
  requireRole('SUPERADMIN', 'ADMIN'),
  controller.listApplications
);
router.get(
  '/applications/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.getApplication
);
router.patch(
  '/applications/:id/status',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(updateApplicationStatusSchema),
  controller.updateApplicationStatus
);
router.delete(
  '/applications/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteApplication
);

// --------------------------------------------------------
// CONTACT MESSAGES MANAGEMENT
// --------------------------------------------------------
router.get(
  '/contact-messages',
  requireRole('SUPERADMIN', 'ADMIN'),
  controller.listContactMessages
);
router.get(
  '/contact-messages/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.getContactMessage
);
router.patch(
  '/contact-messages/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(updateContactMessageSchema),
  controller.updateContactMessage
);
router.delete(
  '/contact-messages/:id',
  requireRole('SUPERADMIN', 'ADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteContactMessage
);

// --------------------------------------------------------
// ADMIN USERS MANAGEMENT (SUPERADMIN ONLY)
// --------------------------------------------------------
router.get(
  '/users',
  requireRole('SUPERADMIN'),
  controller.listAdminUsers
);
router.get(
  '/users/:id',
  requireRole('SUPERADMIN'),
  validateRequest(uuidParamSchema),
  controller.getAdminUser
);
router.post(
  '/users',
  requireRole('SUPERADMIN'),
  validateRequest(createAdminUserSchema),
  controller.createAdminUser
);
router.patch(
  '/users/:id',
  requireRole('SUPERADMIN'),
  validateRequest(updateAdminUserSchema),
  controller.updateAdminUser
);
router.delete(
  '/users/:id',
  requireRole('SUPERADMIN'),
  validateRequest(uuidParamSchema),
  controller.deleteAdminUser
);

export default router;
