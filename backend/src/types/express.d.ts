export interface AuthUserPayload {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'MODERATOR';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}
