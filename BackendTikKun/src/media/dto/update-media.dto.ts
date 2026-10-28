import { ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

// Permite actualizar una o ambas listas, conservando el límite de elementos y tamaño por URL.
export class UpdateMediaDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  imagenesHero?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  imagenesGaleria?: string[];
}
