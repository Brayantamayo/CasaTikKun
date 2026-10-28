import { IsUrl, MaxLength } from 'class-validator';

// El servidor recibe la URL mostrada en el sitio y valida que sea una URL antes de procesarla.
export class DeleteImageDto {
  @IsUrl({ protocols: ['https'], require_protocol: true })
  @MaxLength(2048)
  url!: string;
}
