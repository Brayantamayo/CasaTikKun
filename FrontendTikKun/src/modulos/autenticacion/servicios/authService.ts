// Encapsula las peticiones de login, sesión y cierre de sesión.
import { api, ApiError } from '@/compartido/api/api';

export interface AdminSession {
  id: string;
  email: string;
}

export const authService = {
  async getCurrentAdmin(): Promise<AdminSession | null> {
    try {
      return await api.get<AdminSession>('/auth/me');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  },

  login(email: string, password: string): Promise<AdminSession> {
    return api.post<AdminSession>('/auth/login', { email, password });
  },

  async logout(): Promise<void> {
    await api.post<void>('/auth/logout');
  },
};
