"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceService = void 0;
const common_1 = require("@nestjs/common");
let BalanceService = class BalanceService {
    async getAccount(tx, accountId) {
        const account = await tx.account.findUnique({ where: { id: accountId } });
        if (!account) {
            throw new common_1.NotFoundException(`Compte ${accountId} introuvable`);
        }
        return account;
    }
    async verifyFunds(tx, accountId, amount) {
        const account = await this.getAccount(tx, accountId);
        if (Number(account.balance) < amount) {
            throw new common_1.BadRequestException('Solde insuffisant');
        }
        return account;
    }
    async applyDelta(tx, accountId, amount, direction) {
        const updated = await tx.account.update({
            where: { id: accountId },
            data: {
                balance: direction === 'CREDIT' ? { increment: amount } : { decrement: amount },
                version: { increment: 1 },
            },
        });
        return updated;
    }
};
exports.BalanceService = BalanceService;
exports.BalanceService = BalanceService = __decorate([
    (0, common_1.Injectable)()
], BalanceService);
//# sourceMappingURL=balance.service.js.map