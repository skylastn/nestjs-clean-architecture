import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class FailedResponseInterceptor implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let stack: string | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || message;
      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    // Ambil file dan line dari stack
    let fileLine: string | undefined = undefined;
    if (stack) {
      const lines = stack.split('\n');
      if (lines.length > 1) {
        const match = lines[1].match(/\((.*):(\d+):(\d+)\)/);
        if (match) {
          fileLine = `${match[1]}:${match[2]}:${match[3]}`;
        }
      }
    }
    var result: { status: boolean; message: string; error?: string } = {
      status: false,
      message: message,
    };
    if (process.env.NODE_ENV != 'production') {
      result.error = fileLine;
    }
    return response.status(status).json(result);
  }
}
