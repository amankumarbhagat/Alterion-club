import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type AuthUser, loginApi, logoutApi, getMeApi } from '../services/authApi';
import { ApiError } from '../services/apiClient';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { username?: string; email?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkSession = async () => {
    setIsLoading(true);
    try {
      const authUser = await getMeApi();
      setUser(authUser);
      setError(null);
    } catch (err: any) {
      setUser(null);
      // Not logged in (401) is normal on initial load if no cookie set
      if (err instanceof ApiError && err.status !== 401) {
        console.warn('Session check failed:', err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (credentials: { username?: string; email?: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const authUser = await loginApi(credentials);
      setUser(authUser);
    } catch (err: any) {
      setUser(null);
      const msg = err?.message || 'Login failed. Please check credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } catch (err: any) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        checkSession,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
