import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

// Solo los campos permitidos por el público llegan al servicio; id, fecha y verificación los decide el servidor.
export class CreateReviewDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  guestName!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsOptional()
  @IsString()
  @MaxLength(120)
  guestCity?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cabinId!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  comment!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @IsIn(['En Pareja', 'Familia', 'Amigos', 'Escapada Solitaria'])
  @MaxLength(50)
  travelType!: string;
}
