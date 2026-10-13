// Solicita y valida las credenciales para acceder al panel administrativo.
import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, ArrowRight, Eye, EyeOff, Home } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    // La autenticación real ocurre en el backend; aquí solo mostramos el resultado para la interfaz.
    const ok = await login(username, password);
    setIsLoading(false);
    if (ok) onSuccess();
    else setError('No se pudo iniciar sesi?n. Revisa tus datos e int?ntalo de nuevo.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div
        className="relative w-full max-w-md bg-white text-tikkun-brand-deep rounded-3xl shadow-2xl border border-[#D5DFCA] overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cerrar la ventana. */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icono y título. */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-tikkun-brand-deep text-tikkun-brand-sage flex items-center justify-center mx-auto mb-3 shadow-md">
            <Home className="w-6 h-6 stroke-2" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#556F48] bg-[#EFF4E6] px-3 py-1 rounded-full border border-[#CCD8B8] inline-block">
            Portal de Administración
          </span>
          <h3 className="text-2xl font-serif font-bold text-tikkun-brand-deep mt-2.5">
            Casa Tikkun Admin
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Gestión de cabañas, tarifas, fotografías y reservas
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* El navegador ofrece autocompletado para credenciales sin almacenarlas en el frontend. */}
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Usuario o Correo
            </label>
            <input
              type="email"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="casatiktuk@gmail.com"
              className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-hidden transition-colors"
            />
          </div>

          <div>
            <label className=" text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>Contraseña</span>
            </label>
            <div className="relative">
              {/* El estado showPassword solo alterna la visibilidad del campo en pantalla. */}
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-stone-900 focus:outline-hidden transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-tikkun-brand-deep hover:bg-[#2C4623] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <span>Verificando...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-tikkun-brand-sage" />
                <span>Ingresar al Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
