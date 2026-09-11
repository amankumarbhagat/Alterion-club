import { Router } from 'express';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  eventRegistrationSchema,
  applicationSubmissionSchema,
  contactMessageSchema,
} from '../schemas/public.schema.js';
import {
  getDivisions,
  getDivisionBySlugOrId,
  getMembers,
  getMemberById,
  getProjects,
  getProjectBySlugOrId,
  getEvents,
  getEventBySlugOrId,
  registerForEvent,
  getAchievements,
  getAnnouncements,
  getPartners,
  getGallery,
  getFaculty,
  getSiteStats,
  submitApplication,
  submitContactMessage,
} from '../controllers/public.controller.js';

const router = Router();

// Divisions
router.get('/divisions', getDivisions);
router.get('/divisions/:identifier', getDivisionBySlugOrId);

// Members
router.get('/members', getMembers);
router.get('/members/:id', getMemberById);

// Projects
router.get('/projects', getProjects);
router.get('/projects/:identifier', getProjectBySlugOrId);

// Events
router.get('/events', getEvents);
router.get('/events/:identifier', getEventBySlugOrId);
router.post('/events/:id/register', validateRequest(eventRegistrationSchema), registerForEvent);
router.post('/events/:id/registrations', validateRequest(eventRegistrationSchema), registerForEvent);

// Achievements, Announcements, Partners, Gallery
router.get('/achievements', getAchievements);
router.get('/announcements', getAnnouncements);
router.get('/partners', getPartners);
router.get('/gallery', getGallery);

// Faculty & Stats
router.get('/faculty', getFaculty);
router.get('/stats', getSiteStats);
router.get('/site-metrics', getSiteStats);

// Form Submissions
router.post('/applications', validateRequest(applicationSubmissionSchema), submitApplication);
router.post('/contact', validateRequest(contactMessageSchema), submitContactMessage);

export default router;
