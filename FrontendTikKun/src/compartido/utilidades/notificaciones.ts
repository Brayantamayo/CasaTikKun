// Reúne los mensajes breves del sitio en un único formato visual.
import toast from 'react-hot-toast';

export const notificar = {
  exito: (mensaje: string) => toast.success(mensaje),
  error: (mensaje: string) => toast.error(mensaje),
  info: (mensaje: string) => toast(mensaje),
};
