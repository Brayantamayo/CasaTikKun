// DTO (Data Transfer Object): define y valida la forma del cuerpo recibido por /auth/login.
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  // Asegura un correo con formato válido y limita su longitud antes de consultar la base de datos.
  @IsEmail()
  @MaxLength(254)
  email!: string;

  // Acepta una contraseña no vacía con límite de tamaño para evitar entradas excesivas.
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}
