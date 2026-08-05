import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Transactions (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const testEmail = `txn-test-${Date.now()}@unionbanque.ci`;
  let accessToken: string;
  let userId: string;
  let accountAId: string;
  let accountBId: string;

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
        firstName: 'Txn',
        lastName: 'Tester',
      });

    accessToken = registerRes.body.accessToken;
    userId = registerRes.body.user.id;

    const accountA = await prisma.account.create({
      data: { accountNumber: `TEST-A-${Date.now()}`, userId, balance: 1000 },
    });
    const accountB = await prisma.account.create({
      data: { accountNumber: `TEST-B-${Date.now()}`, userId, balance: 0 },
    });
    accountAId = accountA.id;
    accountBId = accountB.id;
  });

  afterAll(async () => {
    await prisma.ledgerEntry.deleteMany({ where: { accountId: { in: [accountAId, accountBId] } } });
    await prisma.transaction.deleteMany({
      where: { OR: [{ sourceAccountId: accountAId }, { destinationAccountId: accountBId }] },
    });
    await prisma.account.deleteMany({ where: { id: { in: [accountAId, accountBId] } } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await app.close();
  });

  describe('POST /transactions/deposit', () => {
    it('accepte un dépôt valide', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/deposit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ accountId: accountAId, amount: 500 });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('COMPLETED');
      expect(res.body.type).toBe('DEPOSIT');
    });

    it('rejette un montant négatif', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/deposit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ accountId: accountAId, amount: -50 });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /transactions/withdraw', () => {
    it('accepte un retrait valide', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/withdraw')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ accountId: accountAId, amount: 200 });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('COMPLETED');
    });

    it('rejette un retrait supérieur au solde', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/withdraw')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ accountId: accountAId, amount: 999999 });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Solde insuffisant');
    });
  });

  describe('POST /transactions/transfer', () => {
    it('effectue un virement valide entre deux comptes', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/transfer')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ sourceAccountId: accountAId, destinationAccountId: accountBId, amount: 100 });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('COMPLETED');

      const destAccount = await prisma.account.findUnique({ where: { id: accountBId } });
      expect(Number(destAccount?.balance)).toBe(100);
    });

    it('rejette un virement vers un compte inexistant', async () => {
      const res = await request(app.getHttpServer())
        .post('/transactions/transfer')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          sourceAccountId: accountAId,
          destinationAccountId: '00000000-0000-0000-0000-000000000000',
          amount: 50,
        });

      expect(res.status).toBe(404);
    });

    it('rejette un virement avec solde insuffisant et ne modifie aucun compte (rollback)', async () => {
      const before = await prisma.account.findUnique({ where: { id: accountAId } });

      const res = await request(app.getHttpServer())
        .post('/transactions/transfer')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ sourceAccountId: accountAId, destinationAccountId: accountBId, amount: 999999 });

      expect(res.status).toBe(400);

      const after = await prisma.account.findUnique({ where: { id: accountAId } });
      expect(Number(after?.balance)).toBe(Number(before?.balance));
    });
  });
});
