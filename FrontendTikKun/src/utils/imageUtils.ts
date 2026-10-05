import { APP_LIMITS } from '../constants/storageKeys';

/**
 * Compresses and resizes a browser File image using an offscreen HTML5 Canvas.
 * Prevents localStorage QuotaExceededError and optimizes payloads for Backend uploads.
 */
export function compressImageFile(
  file: File,
  maxWidth: number = APP_LIMITS.MAX_IMAGE_WIDTH_PX,
  quality: number = APP_LIMITS.IMAGE_QUALITY
): Promise<string> {
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
      img.onerror = () => resolve(dataUrl); // Fallback to raw dataUrl if image decoding fails
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses multiple image files in parallel while preserving order.
 */
export async function compressMultipleImageFiles(files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => compressImageFile(file)));
}
