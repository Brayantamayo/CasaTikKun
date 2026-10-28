import { BadGatewayException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'crypto';

interface CloudinaryCredentials {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: { message?: string };
}

interface CloudinaryDestroyResponse {
  result?: string;
  error?: { message?: string };
}

// Centraliza la comunicación firmada con Cloudinary; el API secret nunca sale del backend.
@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly config: ConfigService) {}

  async upload(image: string, folder: 'hero' | 'gallery' | 'cabins'): Promise<string> {
    const { cloudName, apiKey, apiSecret } = this.getCredentials();
    const cloudinaryFolder = `casa-tikkun/${folder}`;
    const publicId = `${cloudinaryFolder}/${randomUUID().replace(/-/g, '')}`;
    const body = new FormData();
    body.set('file', image);
    body.set('asset_folder', cloudinaryFolder);
    body.set('public_id', publicId);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
        method: 'POST',
        // El runtime añade el boundary multipart requerido al enviar FormData.
        headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}` },
        body,
        signal: AbortSignal.timeout(30_000),
      });
      const result = await response.json() as CloudinaryUploadResponse;
      if (!response.ok || !result.secure_url) {
        const providerMessage = result.error?.message ?? '';
        this.logger.error(`Cloudinary upload failed (HTTP ${response.status}): ${providerMessage || 'missing secure_url'}`);
        throw new BadGatewayException(this.getUploadErrorMessage(response.status, providerMessage));
      }
      return result.secure_url;
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;
      this.logger.error('Cloudinary upload request failed.', error instanceof Error ? error.stack : String(error));
      throw new BadGatewayException('No se pudo conectar con Cloudinary.');
    }
  }

  async delete(url: string): Promise<boolean> {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    if (!cloudName) return false;
    const publicId = this.getManagedPublicId(url, cloudName);
    // Las URLs externas o de otra cuenta solo se quitan de la lista; no se llama a Cloudinary.
    if (!publicId) return false;

    const { apiKey, apiSecret } = this.getCredentials();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    // Invalidar el CDN para que una foto borrada deje de servirse también desde caché.
    const signature = this.sign(`invalidate=true&public_id=${publicId}&timestamp=${timestamp}`, apiSecret);
    const body = new URLSearchParams({ public_id: publicId, api_key: apiKey, timestamp, invalidate: 'true', signature });

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/destroy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json() as CloudinaryDestroyResponse;
      if (!response.ok || (result.result !== 'ok' && result.result !== 'not found')) {
        this.logger.error(`Cloudinary deletion failed (HTTP ${response.status}): ${result.error?.message ?? result.result ?? 'unknown response'}`);
        throw new BadGatewayException('Cloudinary no pudo eliminar la imagen.');
      }
      return result.result === 'ok';
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;
      this.logger.error('Cloudinary deletion request failed.', error instanceof Error ? error.stack : String(error));
      throw new BadGatewayException('No se pudo conectar con Cloudinary para eliminar la imagen.');
    }
  }

  private getCredentials(): CloudinaryCredentials {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');
    if (!cloudName?.trim() || !apiKey?.trim() || !apiSecret?.trim()) {
      throw new ServiceUnavailableException('Cloudinary no está configurado en el servidor.');
    }
    return { cloudName: cloudName.trim(), apiKey: apiKey.trim(), apiSecret: apiSecret.trim() };
  }

  private sign(parameters: string, apiSecret: string): string {
    return createHash('sha1').update(`${parameters}${apiSecret}`).digest('hex');
  }

  private getUploadErrorMessage(status: number, providerMessage: string): string {
    const message = providerMessage.toLowerCase();
    if (/file size|too large|request entity too large|maximum.*size/.test(message)) {
      return 'Cloudinary rechazó la imagen por su tamaño. Elige una imagen más pequeña o reduce sus dimensiones.';
    }
    if (/missing permissions|request forbidden|actions=\[.*create/.test(message)) {
      return 'La clave de Cloudinary es válida, pero no tiene permiso para crear imágenes. Asigna a la clave un rol con permiso de carga (Upload/Create) y actualiza CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en BackendTikKun/.env.';
    }
    if (/invalid signature|api key|cloud name|unknown api key|unauthorized/.test(message)) {
      return 'Cloudinary rechazó la autenticación. Revisa CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en la configuración del servidor.';
    }
    if (/invalid image|unsupported.*format|must be.*image|not.*image/.test(message)) {
      return 'Cloudinary no reconoce el archivo como imagen. Prueba con un archivo JPG, PNG o WebP válido.';
    }
    if (status === 401 || status === 403 || /authentication|not allowed|not authorized/.test(message)) {
      return 'Cloudinary no autorizó la carga. Verifica que las credenciales pertenezcan a la misma cuenta y que la cuenta esté activa.';
    }
    if (status === 400) {
      return 'Cloudinary rechazó los datos de la carga. Verifica que la imagen sea válida y que el nombre de Cloudinary corresponda a las credenciales configuradas.';
    }
    if (status === 429) return 'Cloudinary está recibiendo demasiadas solicitudes. Espera un minuto e inténtalo de nuevo.';
    if (status >= 500) return 'Cloudinary no está disponible en este momento. Espera un poco e inténtalo de nuevo.';
    return 'Cloudinary rechazó la imagen. Revisa que el archivo sea válido y que la cuenta tenga permisos de carga.';
  }

  private getManagedPublicId(urlValue: string, cloudName: string): string | null {
    try {
      const url = new URL(urlValue);
      const segments = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
      if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com' || segments[0] !== cloudName) return null;
      if (segments[1] !== 'image' || segments[2] !== 'upload') return null;

      const assetSegments = segments.slice(3);
      if (/^v\d+$/.test(assetSegments[0] ?? '')) assetSegments.shift();
      const lastSegment = assetSegments.at(-1);
      if (!lastSegment || !/\.(?:jpe?g|png|webp|gif)$/i.test(lastSegment)) return null;
      assetSegments[assetSegments.length - 1] = lastSegment.replace(/\.(?:jpe?g|png|webp|gif)$/i, '');

      const publicId = assetSegments.join('/');
      const isManagedFolder = ['casa-tikkun/hero/', 'casa-tikkun/gallery/', 'casa-tikkun/cabins/']
        .some((prefix) => publicId.startsWith(prefix));
      return isManagedFolder && !publicId.includes('..') ? publicId : null;
    } catch {
      return null;
    }
  }
}
