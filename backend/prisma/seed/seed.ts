import { PrismaClient, Role, KycStatus, ClientStatus, AccountStatus, AccountType, Currency } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Client Standard — Vanessa Ciuraru
  const vanessaPassword = await bcrypt.hash('Vanessa2026', 10);
  const vanessa = await prisma.user.upsert({
    where: { email: 'vanessa.ciuraru@unionbanque.fr' },
    update: {},
    create: {
      email: 'vanessa.ciuraru@unionbanque.fr',
      password: vanessaPassword,
      firstName: 'Vanessa',
      lastName: 'Ciuraru',
      role: Role.CLIENT,
      phone: '+33 6 45 12 78 93',
      addressLine: '18 rue des Jardins',
      city: 'Paris',
      country: 'France',
      advisorName: 'Marc Dubois',
      kycStatus: KycStatus.VERIFIED,
      clientStatus: ClientStatus.ACTIVE,
    },
  });

  await prisma.account.upsert({
    where: { accountNumber: 'FR76 3000 1007 9412 3456 7890 185' },
    update: {},
    create: {
      accountNumber: 'FR76 3000 1007 9412 3456 7890 185',
      userId: vanessa.id,
      currency: Currency.EUR,
      accountType: AccountType.CHECKING,
      status: AccountStatus.ACTIVE,
      balance: 18450.25,
      overdraftLimit: 5000,
    },
  });

  // 2. Client sous vérification KYC — Alberto Ciuraru
  const albertoPassword = await bcrypt.hash('Alberto2026', 10);
  const alberto = await prisma.user.upsert({
    where: { email: 'alberto.ciuraru@unionbanque.fr' },
    update: {},
    create: {
      email: 'alberto.ciuraru@unionbanque.fr',
      password: albertoPassword,
      firstName: 'Alberto',
      lastName: 'Ciuraru',
      role: Role.CLIENT,
      phone: '+33 6 78 23 45 61',
      addressLine: '5 avenue Victor Hugo',
      city: 'Lyon',
      country: 'France',
      advisorName: 'Claire Petit',
      kycStatus: KycStatus.PENDING,
      clientStatus: ClientStatus.ACTIVE,
    },
  });

  await prisma.account.upsert({
    where: { accountNumber: 'FR76 3000 2004 5678 1234 5678 291' },
    update: {},
    create: {
      accountNumber: 'FR76 3000 2004 5678 1234 5678 291',
      userId: alberto.id,
      currency: Currency.EUR,
      accountType: AccountType.CHECKING,
      status: AccountStatus.KYC_REVIEW,
      statusReason:
        'Compte sous vérification KYC. Un justificatif de domicile de moins de 3 mois est requis pour lever la restriction. Référence : KYC-2026-00452.',
      balance: 1800.0,
    },
  });

  // 3. Administrateur bancaire
  const adminPassword = await bcrypt.hash('Superviseur2026', 10);
  await prisma.user.upsert({
    where: { email: 'admin@unionbanque.fr' },
    update: {},
    create: {
      email: 'admin@unionbanque.fr',
      password: adminPassword,
      firstName: 'Isabelle',
      lastName: 'Rousseau',
      role: Role.ADMIN,
      clientStatus: ClientStatus.ACTIVE,
      kycStatus: KycStatus.VERIFIED,
    },
  });

  console.log('Seed terminé avec succès.');
  console.log('---');
  console.log('Vanessa Ciuraru (client actif) : vanessa.ciuraru@unionbanque.fr / Vanessa2026');
  console.log('Alberto Ciuraru (KYC en cours) : alberto.ciuraru@unionbanque.fr / Alberto2026');
  console.log('Isabelle Rousseau (admin)      : admin@unionbanque.fr / Superviseur2026');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
