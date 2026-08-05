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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const create_deposit_dto_1 = require("./dto/create-deposit.dto");
const create_withdraw_dto_1 = require("./dto/create-withdraw.dto");
const create_transfer_dto_1 = require("./dto/create-transfer.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TransactionsController = class TransactionsController {
    transactionsService;
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    deposit(dto) {
        return this.transactionsService.deposit(dto);
    }
    withdraw(dto) {
        return this.transactionsService.withdraw(dto);
    }
    transfer(dto) {
        return this.transactionsService.transfer(dto);
    }
    findByAccount(accountId) {
        return this.transactionsService.findByAccount(accountId);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)('deposit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deposit_dto_1.CreateDepositDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "deposit", null);
__decorate([
    (0, common_1.Post)('withdraw'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_withdraw_dto_1.CreateWithdrawDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "withdraw", null);
__decorate([
    (0, common_1.Post)('transfer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transfer_dto_1.CreateTransferDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "transfer", null);
__decorate([
    (0, common_1.Get)('account/:accountId'),
    __param(0, (0, common_1.Param)('accountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findByAccount", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map