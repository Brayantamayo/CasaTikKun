import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateReviewDto } from './create-review.dto';

describe('CreateReviewDto', () => {
  const validPayload = {
    guestName: 'Visitante',
    email: 'visitante@example.com',
    rating: 5,
    cabinId: 'cabana-valida',
    comment: 'Una experiencia muy agradable en la montaña.',
    travelType: 'En Pareja',
  };

  it('acepta una reseña sin ciudad, porque ese campo es opcional', async () => {
    const dto = plainToInstance(CreateReviewDto, validPayload);
    await expect(validate(dto, { whitelist: true, forbidNonWhitelisted: true })).resolves.toHaveLength(0);
  });

  it('rechaza propiedades no declaradas en el contrato público', async () => {
    const dto = plainToInstance(CreateReviewDto, { ...validPayload, isVerified: true });
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    expect(errors.some((error) => error.property === 'isVerified')).toBe(true);
  });
});
