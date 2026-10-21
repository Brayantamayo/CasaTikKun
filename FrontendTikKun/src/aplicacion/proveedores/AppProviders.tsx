// Agrupa los contextos globales que comparten estado en la aplicación.
import type { ReactNode } from 'react';
import { AuthProvider } from '@/modulos/autenticacion/contexto/AuthContext';
import { AdminProvider } from '@/modulos/administracion/contexto/AdminContext';
import { ReviewsProvider } from '@/modulos/resenas/contexto/ReviewsContext';

/** Declara en un solo lugar el estado compartido por las páginas y módulos del sitio. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <ReviewsProvider>{children}</ReviewsProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
