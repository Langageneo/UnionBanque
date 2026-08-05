"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcrypt"));
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const vanessaPassword = await bcrypt.hash('Vanessa2026', 10);
    const vanessa = await prisma.user.upsert({
        where: { email: 'vanessa.ciuraru@unionbanque.fr' },
        update: {},
        create: {
            email: 'vanessa.ciuraru@unionbanque.fr',
            password: vanessaPassword,
            firstName: 'Vanessa',
            lastName: 'Ciuraru',
            role: client_1.Role.CLIENT,
            phone: '+33 6 45 12 78 93',
            addressLine: '18 rue des Jardins',
            city: 'Paris',
            country: 'France',
            advisorName: 'Marc Dubois',
            kycStatus: client_1.KycStatus.VERIFIED,
            clientStatus: client_1.ClientStatus.ACTIVE,
        },
    });
    await prisma.account.upsert({
        where: { accountNumber: 'FR76 3000 1007 9412 3456 7890 185' },
        update: {},
        create: {
            accountNumber: 'FR76 3000 1007 9412 3456 7890 185',
            userId: vanessa.id,
            currency: client_1.Currency.EUR,
            accountType: client_1.AccountType.CHECKING,
            status: client_1.AccountStatus.ACTIVE,
            balance: 18450.25,
            overdraftLimit: 5000,
        },
    });
    const albertoPassword = await bcrypt.hash('Alberto2026', 10);
    const alberto = await prisma.user.upsert({
        where: { email: 'alberto.ciuraru@unionbanque.fr' },
        update: {},
        create: {
            email: 'alberto.ciuraru@unionbanque.fr',
            password: albertoPassword,
            firstName: 'Alberto',
            lastName: 'Ciuraru',
            role: client_1.Role.CLIENT,
            phone: '+33 6 78 23 45 61',
            addressLine: '5 avenue Victor Hugo',
            city: 'Lyon',
            country: 'France',
            advisorName: 'Claire Petit',
            kycStatus: client_1.KycStatus.PENDING,
            clientStatus: client_1.ClientStatus.ACTIVE,
        },
    });
    await prisma.account.upsert({
        where: { accountNumber: 'FR76 3000 2004 5678 1234 5678 291' },
        update: {},
        create: {
            accountNumber: 'FR76 3000 2004 5678 1234 5678 291',
            userId: alberto.id,
            currency: client_1.Currency.EUR,
            accountType: client_1.AccountType.CHECKING,
            status: client_1.AccountStatus.KYC_REVIEW,
            statusReason: 'Compte sous vérification KYC. Un justificatif de domicile de moins de 3 mois est requis pour lever la restriction. Référence : KYC-2026-00452.',
            balance: 1800.0,
        },
    });
    const adminPassword = await bcrypt.hash('Superviseur2026', 10);
    await prisma.user.upsert({
        where: { email: 'admin@unionbanque.fr' },
        update: {},
        create: {
            email: 'admin@unionbanque.fr',
            password: adminPassword,
            firstName: 'Isabelle',
            lastName: 'Rousseau',
            role: client_1.Role.ADMIN,
            clientStatus: client_1.ClientStatus.ACTIVE,
            kycStatus: client_1.KycStatus.VERIFIED,
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
//# sourceMappingURL=seed.js.map