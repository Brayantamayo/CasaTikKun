// Une la presentación del login con el flujo de acceso administrativo.
import { AdminLoginModal } from '@/modulos/autenticacion/componentes/AdminLoginModal';

interface AdminAccessPageProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Une el flujo de acceso con su presentación; la página principal solo decide cuándo abrirlo. */
export function AdminAccessPage(props: AdminAccessPageProps) {
  return <AdminLoginModal {...props} />;
}
