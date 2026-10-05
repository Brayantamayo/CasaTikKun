// Solicita y valida las credenciales para acceder al panel administrativo.
import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle, ArrowRight, Eye, EyeOff, Home } from 'lucide-react';
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
  const [username, setUsername] = useState('admin@casatikkun.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = login(username, password);
      setIsLoading(false);
      if (ok) {
        onSuccess();
      } else {
        setError('Credenciales incorrectas. Verifica tu usuario o contraseña de administrador.');
      }
    }, 300);
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
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Usuario o Correo
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@casatikkun.com"
              className="w-full bg-tikkun-brand-cream border border-[#CCD8B8] focus:border-tikkun-brand-deep rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-hidden transition-colors"
            />
          </div>

          <div>
            <label className=" text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>Contraseña</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
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

          {/* Información de acceso. */}
          <div className="p-3 bg-[#EFF4E6] rounded-xl border border-[#CCD8B8] text-[11px] text-[#2C4623] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <KeyRound className="w-3.5 h-3.5 text-[#556F48]" />
              <span>Credenciales por defecto:</span>
            </div>
            <div className="text-[10.5px] text-stone-600 font-mono">
              Usuario: <strong className="text-tikkun-brand-deep">admin@casatikkun.com</strong> (o <strong>admin</strong>)<br />
              Clave: <strong className="text-tikkun-brand-deep">Tikkun2026*</strong>
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
