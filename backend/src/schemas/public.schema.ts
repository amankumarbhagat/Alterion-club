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
    skills: z.string().min(5, 'Please describe your skills').max(2000, 'Skills must be at most 2000 characters'),
    motivation: z.string().min(10, 'Please provide your motivation for joining').max(5000, 'Motivation must be at most 5000 characters'),
    projects: z.string().max(5000, 'Projects description must be at most 5000 characters').optional().default(''),
    github: z.string().max(255).optional().default(''),
    linkedin: z.string().max(255).optional().default(''),
    portfolio: z.string().max(255).optional().default(''),
    resumeUrl: z.string().max(1000, 'Resume URL must be at most 1000 characters').optional().default(''),
    resumeName: z.string().max(255).optional().default(''),
  }),
});

export const contactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(2, 'Subject is required').max(200),
    message: z.string().min(5, 'Message must be at least 5 characters').max(5000, 'Message must be at most 5000 characters'),
  }),
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>['body'];
export type ApplicationSubmissionInput = z.infer<typeof applicationSubmissionSchema>['body'];
export type ContactMessageInput = z.infer<typeof contactMessageSchema>['body'];
