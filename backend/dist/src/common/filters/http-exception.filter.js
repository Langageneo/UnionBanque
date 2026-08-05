"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = exception instanceof common_1.HttpException ? exception.getResponse() : null;
        let message = 'Erreur interne du serveur';
        let code = 'INTERNAL_ERROR';
        if (exceptionResponse && typeof exceptionResponse === 'object') {
            const body = exceptionResponse;
            message = body.message ?? message;
            code = body.error ?? this.statusToCode(status);
        }
        else if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
            code = this.statusToCode(status);
        }
        const correlationId = request.headers['x-correlation-id'] ?? (0, crypto_1.randomUUID)();
        response.status(status).json({
            code,
            message,
            correlationId,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
    statusToCode(status) {
        const map = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            409: 'CONFLICT',
            500: 'INTERNAL_ERROR',
        };
        return map[status] ?? 'ERROR';
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map