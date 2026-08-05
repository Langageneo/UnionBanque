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
exports.IdempotencyService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let IdempotencyService = class IdempotencyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    hashPayload(payload) {
        return (0, crypto_1.createHash)('sha256').update(JSON.stringify(payload)).digest('hex');
    }
    async checkOrCreate(key, payload) {
        const requestHash = this.hashPayload(payload);
        const found = await this.prisma.idempotencyKey.findUnique({ where: { key } });
        if (found) {
            if (found.requestHash !== requestHash) {
                throw new common_1.ConflictException('Cette clé d\'idempotence a déjà été utilisée avec des paramètres différents');
            }
            return {
                existing: true,
                responseBody: found.responseBody,
                idempotencyKeyId: found.id,
            };
        }
        const created = await this.prisma.idempotencyKey.create({
            data: {
                key,
                requestHash,
                status: 'PROCESSING',
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
            },
        });
        return { existing: false, idempotencyKeyId: created.id };
    }
    async complete(idempotencyKeyId, responseStatus, responseBody) {
        return this.prisma.idempotencyKey.update({
            where: { id: idempotencyKeyId },
            data: { status: 'COMPLETED', responseStatus, responseBody: responseBody },
        });
    }
};
exports.IdempotencyService = IdempotencyService;
exports.IdempotencyService = IdempotencyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IdempotencyService);
//# sourceMappingURL=idempotency.service.js.map