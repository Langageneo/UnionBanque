import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const testEmail = `auth-test-${Date.now()}@unionbanque.ci`;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.account.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('crée un nouvel utilisateur et renvoie des tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail,
          password: 'Test1234!',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.status).toBe(201);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(res.body.user.password).toBeUndefined();

      userId = res.body.user.id;
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('rejette un email déjà utilisé', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail,
          password: 'Test1234!',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /auth/login', () => {
    it('connecte avec les bons identifiants', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testEmail, password: 'Test1234!' });

      expect(res.status).toBe(201);
      expect(res.body.accessToken).toBeDefined();
    });

    it('rejette un mauvais mot de passe', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testEmail, password: 'WrongPassword' });

      expect(res.status).toBe(401);
    });
  });

  describe('Protection des routes', () => {
    it('rejette une requête sans token', async () => {
      const res = await request(app.getHttpServer()).get('/accounts');
      expect(res.status).toBe(401);
    });

    it('accepte une requête avec token valide', async () => {
      const res = await request(app.getHttpServer())
        .get('/accounts')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('POST /auth/refresh', () => {
    it('génère de nouveaux tokens avec un refresh token valide', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken });

      expect(res.status).toBe(201);
      expect(res.body.accessToken).toBeDefined();
    });
  });

  describe('POST /auth/logout', () => {
    it('déconnecte avec succès', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(201);
    });
  });
});
