import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

// Valida y transforma precios por noche antes de enviar cualquier dato al servicio o a Prisma.
export class TarifasCabanaDto {
  @Type(() => Number) @IsInt() @Min(1) @Max(100_000_000)
  diaSemana!: number;

  @Type(() => Number) @IsInt() @Min(1) @Max(100_000_000)
  viernes!: number;

  @Type(() => Number) @IsInt() @Min(1) @Max(100_000_000)
  finDeSemanaFestivo!: number;
}

// Limita cada comodidad a los dos campos que utiliza el catálogo.
export class ComodidadCabanaDto {
  @IsString() @Matches(/^[A-Za-z][A-Za-z0-9]{0,39}$/)
  nombreIcono!: string;

  @IsString() @MinLength(1) @MaxLength(100)
  etiqueta!: string;
}

// Valida las reglas de estadía sin aceptar propiedades ajenas al contrato.
export class ReglaCabanaDto {
  @IsString() @Matches(/^[a-z0-9-]{1,80}$/)
  id!: string;

  @IsString() @MinLength(2) @MaxLength(120)
  titulo!: string;

  @IsString() @MinLength(2) @MaxLength(1200)
  descripcion!: string;

  @IsString() @Matches(/^[A-Za-z][A-Za-z0-9]{0,39}$/)
  nombreIcono!: string;

  @IsOptional() @IsBoolean()
  destacado?: boolean;

  @IsOptional() @IsIn(['whatsapp_transport', 'none'])
  tipoAccion?: 'whatsapp_transport' | 'none';
}

// Valida los elementos de cortesía que se muestran en el detalle de una cabaña.
export class CortesiaCabanaDto {
  @IsString() @Matches(/^[a-z0-9-]{1,80}$/)
  id!: string;

  @IsString() @MinLength(1) @MaxLength(100)
  nombre!: string;

  @IsString() @MaxLength(500)
  descripcion!: string;

  @IsString() @Matches(/^[A-Za-z][A-Za-z0-9]{0,39}$/)
  nombreIcono!: string;
}

// Define valores acotados para llegada y acceso; el frontend no puede guardar objetos arbitrarios.
export class EspecificacionesCabanaDto {
  @IsString() @MaxLength(250)
  ubicacion!: string;

  @IsString() @MaxLength(120)
  distancia!: string;

  @IsString() @Matches(/^([01]?\d|2[0-3]):[0-5]\d\s?(AM|PM|M)?$/i)
  horaEntrada!: string;

  @IsString() @Matches(/^([01]?\d|2[0-3]):[0-5]\d\s?(AM|PM|M)?$/i)
  horaSalida!: string;

  @IsString() @MaxLength(250)
  autoIngreso!: string;

  @IsString() @MaxLength(1000)
  informacionAcceso!: string;
}

// Contrato estricto de creación/edición. El ValidationPipe global rechaza campos no declarados.
export class CabinDto {
  @IsOptional() @IsString() @Matches(/^[A-Za-z0-9][A-Za-z0-9_-]{1,119}$/)
  id?: string;

  @Type(() => Number) @IsInt() @Min(1) @Max(999)
  numeroCabana!: number;

  @IsString() @MinLength(1) @MaxLength(50)
  etiquetaNumeroCabana!: string;

  @IsString() @MinLength(2) @MaxLength(150)
  nombre!: string;

  @IsIn(['chalet', 'cabana', 'suite', 'villa'])
  tipo!: 'chalet' | 'cabana' | 'suite' | 'villa';

  @IsString() @MaxLength(300)
  subtitulo!: string;

  @IsString() @MinLength(10) @MaxLength(4000)
  descripcion!: string;

  @Type(() => Number) @IsInt() @Min(1) @Max(50)
  capacidad!: number;

  @IsString() @MinLength(2) @MaxLength(250)
  camas!: string;

  @Type(() => Number) @IsInt() @Min(1) @Max(10)
  banos!: number;

  @Type(() => Number) @IsInt() @Min(1) @Max(100_000_000)
  precioCOP!: number;

  @Type(() => Number) @IsInt() @Min(0) @Max(100_000)
  precioUSD!: number;

  @ValidateNested() @Type(() => TarifasCabanaDto)
  tarifas!: TarifasCabanaDto;

  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(5)
  calificacion!: number;

  @Type(() => Number) @IsInt() @Min(0) @Max(1_000_000)
  cantidadResenas!: number;

  @IsString() @MaxLength(2048) @Matches(/^(https:\/\/[^\s]+|\/[A-Za-z0-9._~!$&'()*+,;=:@%/-]+)$/)
  imagenPrincipal!: string;

  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(10) @IsString({ each: true }) @MaxLength(2048, { each: true })
  @Matches(/^(https:\/\/[^\s]+|\/[A-Za-z0-9._~!$&'()*+,;=:@%/-]+)$/, { each: true })
  imagenesGaleria!: string[];

  @IsArray() @ArrayMaxSize(30) @IsString({ each: true }) @MaxLength(200, { each: true })
  caracteristicas!: string[];

  @IsArray() @ArrayMaxSize(30) @ValidateNested({ each: true }) @Type(() => ComodidadCabanaDto)
  comodidades!: ComodidadCabanaDto[];

  @IsOptional() @IsString() @MaxLength(150)
  insigniaPopular?: string;

  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(1000)
  tamanoM2!: number;

  @IsOptional() @IsArray() @ArrayMaxSize(50) @ValidateNested({ each: true }) @Type(() => ReglaCabanaDto)
  reglas?: ReglaCabanaDto[];

  @IsOptional() @IsArray() @ArrayMaxSize(50) @ValidateNested({ each: true }) @Type(() => CortesiaCabanaDto)
  cortesias?: CortesiaCabanaDto[];

  @IsOptional() @ValidateNested() @Type(() => EspecificacionesCabanaDto)
  especificaciones?: EspecificacionesCabanaDto;
}

