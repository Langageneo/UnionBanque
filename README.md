# 🏦 UnionBanque

> Modern Banking Management System built with Next.js, NestJS, Prisma, PostgreSQL & Docker.

## 📖 Présentation

UnionBanque est une plateforme bancaire de démonstration développée pour reproduire le fonctionnement d'une banque moderne dans un environnement sécurisé de développement.

L'objectif n'est pas de se connecter aux réseaux bancaires réels mais de proposer une application qui se comporte comme une véritable banque :

- authentification sécurisée
- gestion des clients
- comptes bancaires
- historique des opérations
- dépôts
- retraits
- virements
- journal comptable (Ledger)
- audit
- gestion des rôles
- architecture modulaire

Cette application est destinée à la démonstration, à l'apprentissage de l'architecture bancaire moderne et à la présentation auprès de clients.

---

# Architecture

```
UnionBanque
│
├── frontend
│     Next.js 16
│     TypeScript
│     TailwindCSS
│
├── backend
│     NestJS
│     Prisma ORM
│     PostgreSQL
│
└── Docker
```

---

# Stack Technique

## Frontend

- Next.js 16
- React
- TypeScript
- TailwindCSS
- App Router

## Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- RBAC
- EventEmitter2
- class-validator
- bcrypt
- Docker

---

# Fonctionnalités

## Authentification

- Login
- JWT Access Token
- Refresh Token
- Password Hashing
- Roles
  - ADMIN
  - EMPLOYEE
  - CUSTOMER

---

## Gestion des clients

- Création client
- Consultation
- Suppression
- Comptes multiples

---

## Comptes bancaires

- Création de compte
- Solde
- Devise
- Historique
- Versioning

---

## Transactions

- Dépôt
- Retrait
- Virement
- Validation métier
- Historique complet

---

## Ledger bancaire

Chaque opération est enregistrée dans un Grand Livre Comptable (Ledger).

Le système conserve :

- Transaction
- LedgerEntry
- AuditLog

Les mouvements sont immuables afin de garantir la traçabilité.

---

## Audit

Chaque opération importante peut être auditée.

- Correlation ID
- Audit Logs
- Event Driven Architecture

---

## Sécurité

- JWT
- Guards
- Roles
- DTO Validation
- class-validator
- ValidationPipe
- Redaction des tokens dans les logs
- Idempotency Keys
- Correlation ID

---

# Architecture événementielle

Le backend utilise EventEmitter2.

Événements disponibles :

- TransactionCompleted
- FundsDeposited
- TransferCompleted
- TransactionFailed
- TransactionReversed

La V1 ne possède pas encore de listeners.

Cette architecture permet d'ajouter facilement :

- Email
- SMS
- Notifications
- Webhooks
- Kafka
- RabbitMQ

sans modifier la logique métier.

---

# Technologies utilisées

- Next.js
- NestJS
- Prisma
- PostgreSQL
- Docker
- JWT
- bcrypt
- TypeScript
- TailwindCSS
- EventEmitter2

---

# Base de données

Le projet utilise PostgreSQL avec Prisma ORM.

Principales entités :

- User
- Account
- Transaction
- LedgerEntry
- AuditLog
- IdempotencyKey

---

# Lancer le projet

## Backend

```bash
cd backend

npm install

npx prisma migrate dev

npm run start:dev
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# État du projet

### Backend

- ✅ Authentification
- ✅ Comptes
- ✅ Transactions
- ✅ Ledger
- ✅ Audit
- ✅ Validation
- ✅ JWT
- ✅ RBAC

### Frontend

- 🚧 Tableau de bord
- 🚧 Interface bancaire
- 🚧 Historique
- 🚧 Gestion des comptes
- 🚧 Gestion des clients

---

# Objectif

Ce projet démontre la conception d'une architecture bancaire moderne inspirée des systèmes de Core Banking.

Il est conçu pour :

- démonstration client
- apprentissage
- architecture logicielle
- portfolio
- expérimentation

Il ne constitue pas une banque réelle et n'est pas connecté aux infrastructures financières ou aux réseaux interbancaires.

---

# Auteur

**Parfait Guiri**

Développeur Full Stack

GitHub :

https://github.com/Langageneo

---

# Licence

MIT






