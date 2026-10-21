// Mantiene la sesión y las acciones de autenticación del administrador.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService, type AdminSession } from '@/modulos/autenticacion/servicios/authService';

interface AuthContextValue {
  admin: AdminSession | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // La cookie HttpOnly es la única fuente de verdad de la sesión administrativa.
  useEffect(() => {
    let isMounted = true;
    void authService.getCurrentAdmin()
      .then((currentAdmin) => { if (isMounted) setAdmin(currentAdmin); })
      .catch(() => { if (isMounted) setAdmin(null); })
      .finally(() => { if (isMounted) setIsCheckingSession(false); });
    return () => { isMounted = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    admin,
    isAuthenticated: admin !== null,
    isCheckingSession,
    isLoginModalOpen,
    openLoginModal: () => setLoginModalOpen(true),
    closeLoginModal: () => setLoginModalOpen(false),
    async login(email, password) {
      const authenticatedAdmin = await authService.login(email, password);
      setAdmin(authenticatedAdmin);
      setLoginModalOpen(false);
    },
    async logout() {
      try {
        await authService.logout();
      } finally {
        setAdmin(null);
      }
    },
  }), [admin, isCheckingSession, isLoginModalOpen]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}
