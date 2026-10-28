import { IsIn, IsString, Matches, MaxLength } from 'class-validator';

// Solo se permite enviar imágenes codificadas y guardarlas en las tres secciones del sitio.
export class UploadImageDto {
  @IsString()
  @MaxLength(15_000_000)
  @Matches(/^data:image\/(?:jpeg|png|webp|gif);base64,[\da-z+/]+=*$/i)
  image!: string;

  @IsIn(['hero', 'gallery', 'cabins'])
  folder!: 'hero' | 'gallery' | 'cabins';
}
