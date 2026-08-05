import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Accounts (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const testEmail = `accounts-test-${Date.now()}@unionbanque.ci`;
  let accessToken: string;
  let userId: string;
  let accountId: string;

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

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: testEmail,
        password: 'Test1234!',
        firstName: 'Accounts',
        lastName: 'Tester',
      });

    accessToken = registerRes.body.accessToken;
    userId = registerRes.body.user.id;
  });

  afterAll(async () => {
    await prisma.account.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  describe('POST /accounts', () => {
    it('crée un compte avec la devise EUR par défaut', async () => {
      const res = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ userId });

      expect(res.status).toBe(201);
      expect(res.body.currency).toBe('EUR');
      expect(res.body.balance).toBe('0');
      expect(res.body.accountNumber).toMatch(/^UB/);

      accountId = res.body.id;
    });

    it('crée un compte avec une devise explicite (USD)', async () => {
      const res = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ userId, currency: 'USD' });

      expect(res.status).toBe(201);
      expect(res.body.currency).toBe('USD');
    });

    it('rejette la création pour un utilisateur inexistant', async () => {
      const res = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ userId: '00000000-0000-0000-0000-000000000000' });

      expect(res.status).toBe(404);
    });

    it('rejette sans authentification', async () => {
      const res = await request(app.getHttpServer())
        .post('/accounts')
        .send({ userId });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /accounts/:id', () => {
    it('récupère un compte existant avec les infos utilisateur', async () => {
      const res = await request(app.getHttpServer())
        .get(`/accounts/${accountId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(accountId);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
    });

    it('renvoie 404 pour un compte inexistant', async () => {
      const res = await request(app.getHttpServer())
        .get('/accounts/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /accounts/user/:userId', () => {
    it('liste tous les comptes d\'un utilisateur', async () => {
      const res = await request(app.getHttpServer())
        .get(`/accounts/user/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });
});
