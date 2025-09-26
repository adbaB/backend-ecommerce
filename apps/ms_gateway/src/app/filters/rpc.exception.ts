

import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionResponse } from './interfaces/exception.response';

@Catch()
export class ExceptionFilter implements ExceptionFilter  {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception);
    const error = exception
    
    if (this.isExceptionResponse(error)) {
        response.status(error.error.code).json({
            status: error.status,
            message: error.error.message,
            timestamp: error.timestamp,
        });
    } else {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
        });
    }
  }


  private isExceptionResponse(error: any): error is ExceptionResponse {
    return (
        error &&
        typeof error === 'object' &&
        'error' in error &&
        typeof error.error === 'object' &&
        'code' in error.error &&
        'message' in error.error &&
        'status' in error &&
        'timestamp' in error
    );
}
}
