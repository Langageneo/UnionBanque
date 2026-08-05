"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AccountsService = class AccountsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateAccountNumber() {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(1000 + Math.random() * 9000);
        return `UB${timestamp}${random}`;
    }
    async create(userId, currency) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        return this.prisma.account.create({
            data: {
                accountNumber: this.generateAccountNumber(),
                userId,
                currency: currency ?? client_1.Currency.EUR,
            },
        });
    }
    async findAll() {
        return this.prisma.account.findMany({
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
        });
    }
    async findOne(id) {
        const account = await this.prisma.account.findUnique({
            where: { id },
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
        });
        if (!account) {
            throw new common_1.NotFoundException('Compte introuvable');
        }
        return account;
    }
    async findByUser(userId) {
        return this.prisma.account.findMany({ where: { userId } });
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map