// Esta prueba integra rutas/controllers, pero sustituye JWT y base de datos para mantenerse aislada.
jest.mock('../src/auth/admin-auth.guard', () => {
  const { UnauthorizedException } = jest.requireActual('@nestjs/common');
  return {
    AdminAuthGuard: class TestAdminAuthGuard {
      canActivate(context: { switchToHttp: () => { getRequest: () => { cookies?: Record<string, string> } } }) {
        if (!context.switchToHttp().getRequest().cookies?.admin_session) throw new UnauthorizedException();
        return true;
      }
    },
  };
});
jest.mock('../src/auth/auth.service', () => ({ AuthService: class AuthService {} }));
jest.mock('@nestjs/config', () => ({ ConfigService: class ConfigService {} }));

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser = require('cookie-parser');
import supertest = require('supertest');
import { ConfigService } from '@nestjs/config';
import { AuthController } from '../src/auth/auth.controller';
import { AdminAuthGuard } from '../src/auth/admin-auth.guard';
import { AuthService } from '../src/auth/auth.service';
import { CabinsController } from '../src/cabins/cabins.controller';
import { CabinsService } from '../src/cabins/cabins.service';
import { CloudinaryController } from '../src/cloudinary/cloudinary.controller';
import { CloudinaryService } from '../src/cloudinary/cloudinary.service';
import { MediaController } from '../src/media/media.controller';
import { MediaService } from '../src/media/media.service';
import { ReviewsController } from '../src/reviews/reviews.controller';
import { ReviewsService } from '../src/reviews/reviews.service';

describe('API module controllers (e2e)', () => {
  let app: INestApplication;
  // Los tipos de SuperTest de este entorno no incluyen la dependencia transitiva de superagent.
  const request = supertest as unknown as (server: unknown) => any;
  const authService = {
    login: jest.fn().mockResolvedValue({ id: 'admin-1', email: 'admin@example.com', token: 'valid-token' }),
    getAuthenticatedAdmin: jest.fn().mockResolvedValue({ id: 'admin-1', email: 'admin@example.com' }),
  };
  const cabinsService = {
    findAll: jest.fn().mockResolvedValue([{ id: 'cabana-1', nombre: 'Abba' }]),
    create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
    update: jest.fn().mockImplementation((_id, dto) => Promise.resolve(dto)),
    remove: jest.fn().mockResolvedValue(undefined),
  };
  const mediaService = {
    get: jest.fn().mockResolvedValue({ imagenesHero: [], imagenesGaleria: [] }),
    update: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
  };
  const reviewsService = {
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
    remove: jest.fn().mockImplementation((id) => Promise.resolve({ deletedId: id })),
  };
  const cloudinaryService = {
    upload: jest.fn().mockResolvedValue('https://res.cloudinary.com/demo/image/upload/sample.jpg'),
    delete: jest.fn().mockResolvedValue(true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController, CabinsController, MediaController, ReviewsController, CloudinaryController],
      providers: [
        AdminAuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: ConfigService, useValue: { get: () => 'test' } },
        { provide: CabinsService, useValue: cabinsService },
        { provide: MediaService, useValue: mediaService },
        { provide: ReviewsService, useValue: reviewsService },
        { provide: CloudinaryService, useValue: cloudinaryService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => app.close());

  it('sirve el catálogo, los medios y las reseñas en rutas públicas', async () => {
    await request(app.getHttpServer()).get('/api/cabins').expect(200).expect((response: { body: { data: unknown } }) => {
      expect(response.body.data).toEqual([{ id: 'cabana-1', nombre: 'Abba' }]);
    });
    await request(app.getHttpServer()).get('/api/media').expect(200);
    await request(app.getHttpServer()).get('/api/reviews').expect(200).expect([]);
  });

  it('bloquea las escrituras administrativas sin una sesión válida', async () => {
    await request(app.getHttpServer()).post('/api/cabins').send({}).expect(401);
    await request(app.getHttpServer()).put('/api/media').send({ imagenesHero: [] }).expect(401);
    await request(app.getHttpServer()).post('/api/cloudinary/images').send({ image: 'data:image/png;base64,AA==', folder: 'hero' }).expect(401);
    await request(app.getHttpServer()).delete('/api/reviews/review-1').expect(401);
  });

  it('permite actualizar medios y subir una imagen solo con cookie administrativa', async () => {
    await request(app.getHttpServer()).put('/api/media').set('Cookie', 'admin_session=valid-token').send({ imagenesHero: [] }).expect(200);
    await request(app.getHttpServer()).post('/api/cloudinary/images').set('Cookie', 'admin_session=valid-token')
      .send({ image: 'data:image/png;base64,AA==', folder: 'hero' }).expect(201);
  });

  it('acepta la ciudad opcional y rechaza campos extra al crear reseñas', async () => {
    await request(app.getHttpServer()).post('/api/reviews').send({
      guestName: 'Visitante', email: 'visitante@example.com', rating: 5, cabinId: 'cabana-1',
      comment: 'Una experiencia muy agradable en la montaña.', travelType: 'En Pareja',
    }).expect(201);
    await request(app.getHttpServer()).post('/api/reviews').send({
      guestName: 'Visitante', email: 'visitante@example.com', rating: 5, cabinId: 'cabana-1',
      comment: 'Una experiencia muy agradable en la montaña.', travelType: 'En Pareja', isVerified: true,
    }).expect(400);
  });
});
