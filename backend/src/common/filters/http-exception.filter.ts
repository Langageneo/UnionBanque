import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string | string[] = 'Erreur interne du serveur';
    let code = 'INTERNAL_ERROR';

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const body = exceptionResponse as Record<string, unknown>;
      message = (body.message as string | string[]) ?? message;
      code = (body.error as string) ?? this.statusToCode(status);
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      code = this.statusToCode(status);
    }

    const correlationId =
      (request.headers['x-correlation-id'] as string) ?? randomUUID();

    response.status(status).json({
      code,
      message,
      correlationId,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      500: 'INTERNAL_ERROR',
    };
    return map[status] ?? 'ERROR';
  }
}
