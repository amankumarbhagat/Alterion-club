import { z } from 'zod';

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  body: z.object({
    login: z
      .string({ required_error: 'Username or email is required.' })
      .min(1, 'Username or email is required.')
      .max(255),
    password: z
      .string({ required_error: 'Password is required.' })
      .min(1, 'Password is required.')
      .max(200),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
