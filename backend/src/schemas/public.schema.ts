import { z } from 'zod';

export const eventRegistrationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Phone number is too short').max(20),
    college: z.string().max(150).optional().default('BMSIT&M'),
    usn: z.string().max(30).optional().default(''),
    branch: z.string().min(1, 'Branch is required'),
    year: z.string().min(1, 'Year is required'),
    teamName: z.string().max(100).optional(),
  }),
});

export const applicationSubmissionSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Phone number is too short').max(20),
    branch: z.string().min(1, 'Branch is required'),
    year: z.string().min(1, 'Year is required'),
    divisionId: z.string().uuid('Invalid division ID'),
    skills: z.string().min(5, 'Please describe your skills'),
    motivation: z.string().min(10, 'Please provide your motivation for joining'),
    projects: z.string().optional().default(''),
    github: z.string().max(255).optional().default(''),
    linkedin: z.string().max(255).optional().default(''),
    portfolio: z.string().max(255).optional().default(''),
    resumeUrl: z.string().optional().default(''),
    resumeName: z.string().optional().default(''),
  }),
});

export const contactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(2, 'Subject is required').max(200),
    message: z.string().min(5, 'Message must be at least 5 characters'),
  }),
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>['body'];
export type ApplicationSubmissionInput = z.infer<typeof applicationSubmissionSchema>['body'];
export type ContactMessageInput = z.infer<typeof contactMessageSchema>['body'];
