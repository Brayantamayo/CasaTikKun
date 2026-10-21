// Utilidades del navegador para preparar y manejar imágenes.
import { APP_LIMITS } from '@/compartido/constantes/storageKeys';

/**
 * Compresses and resizes a browser File image using an offscreen HTML5 Canvas.
 * Prevents localStorage QuotaExceededError and optimizes payloads for Backend uploads.
 */
export function compressImageFile(
  file: File,
  maxWidth: number = APP_LIMITS.MAX_IMAGE_WIDTH_PX,
  quality: number = APP_LIMITS.IMAGE_QUALITY
): Promise<string> {
  const maxInputSize = 20 * 1024 * 1024;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return Promise.reject(new Error(`“${file.name}” no es JPEG, PNG o WebP. Convierte el archivo a uno de esos formatos.`));
  }
  if (file.size > maxInputSize) {
    return Promise.reject(new Error(`“${file.name}” pesa ${formatFileSize(file.size)}. El máximo permitido es 20 MB.`));
  }
  if (file.size === 0) {
    return Promise.reject(new Error(`“${file.name}” está vacío.`));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'));
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Archivo de imagen vacío.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error(`No se pudo interpretar “${file.name}”. Usa una imagen JPEG, PNG o WebP válida.`));
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width * height > 50_000_000) {
            reject(new Error(`“${file.name}” tiene demasiados píxeles para procesarse de forma segura. Reduce sus dimensiones e inténtalo de nuevo.`));
            return;
          }
          // Limita tanto el ancho como el alto; fotos verticales grandes también deben reducirse.
          const scale = Math.min(1, maxWidth / width, maxWidth / height);
          width = Math.max(1, Math.round(width * scale));
          height = Math.max(1, Math.round(height * scale));

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error(`El navegador no pudo optimizar “${file.name}”. Prueba con otra imagen.`));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          if (compressedDataUrl.length > 14_000_000) {
            reject(new Error(`“${file.name}” sigue siendo demasiado pesada después de optimizarse. Reduce sus dimensiones o usa otra imagen.`));
            return;
          }
          resolve(compressedDataUrl);
        } catch {
          reject(new Error(`No se pudo optimizar “${file.name}”. Prueba guardarla como JPG o WebP e inténtalo de nuevo.`));
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses multiple image files sequentially to avoid decoding many large images at once.
 */
export async function compressMultipleImageFiles(files: File[]): Promise<string[]> {
  const compressed: string[] = [];
  for (const file of files) compressed.push(await compressImageFile(file));
  return compressed;
}

export function formatFileSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
