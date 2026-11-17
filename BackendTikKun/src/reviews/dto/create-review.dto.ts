import { Transform, Type } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

// Solo los campos permitidos por el público llegan al servicio; id, fecha y verificación los decide el servidor.
export class CreateReviewDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
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
  @Matches(/^[\p{L}\p{M}0-9 .,'’()\-]{0,120}$/u)
  guestCity?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @Matches(/^[A-Za-z0-9][A-Za-z0-9_-]{1,119}$/)
  @IsNotEmpty()
  @MaxLength(100)
  cabinId!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @Matches(/\S/)
  comment!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @IsIn(['En Pareja', 'En Familia', 'Con Amigos', 'Retiro Solitario'])
  @MaxLength(50)
  travelType!: string;
}
