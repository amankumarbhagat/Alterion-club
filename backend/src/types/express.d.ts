export type AdminRole = 'SUPERADMIN' | 'ADMIN' | 'MODERATOR';

export interface AuthUserPayload {
  id: string;
  username: string;
  email: string;
  name: string;
  role: AdminRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}
