// Composición principal: conecta proveedores globales con la página del sitio.
import { AppProviders } from '@/aplicacion/proveedores/AppProviders';
import SitePage from '@/aplicacion/paginas/SitePage';
import { Toaster } from 'react-hot-toast';

/** Punto de composición de la aplicación. */
export default function App() {
  return (
    <AppProviders>
      <SitePage />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3800,
          style: {
            background: '#FBF9F4',
            color: '#1E311A',
            border: '1px solid #D5DFCA',
            borderRadius: '14px',
            boxShadow: '0 12px 32px rgba(30, 49, 26, 0.14)',
            fontFamily: 'inherit',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#3D5A35', secondary: '#FBF9F4' } },
          error: { iconTheme: { primary: '#B42318', secondary: '#FBF9F4' } },
        }}
      />
    </AppProviders>
  );
}
