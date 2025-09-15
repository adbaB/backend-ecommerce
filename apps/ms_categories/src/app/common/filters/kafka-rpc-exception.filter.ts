import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';
import { throwError } from 'rxjs';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { KafkaResponse } from '../kafka-reponse.interface';

@Catch()
export class KafkaRpcExceptionFilter extends BaseRpcExceptionFilter {
  override catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const data = ctx.getData();
    
    let errorResponse: KafkaResponse<null>;
    
    // Manejar diferentes tipos de errores
    if (exception instanceof ValidationError || (Array.isArray(exception) && exception[0] instanceof ValidationError)) {
      errorResponse = this.handleValidationError(exception);
    } else if (exception instanceof EntityNotFoundError) {
      errorResponse = this.handleEntityNotFoundError(exception);
    } else if (exception instanceof QueryFailedError) {
      errorResponse = this.handleQueryFailedError(exception);
    } else if (exception instanceof RpcException) {
      // Si ya es una RpcException, extraemos la información
      const errorData = exception.getError();
      errorResponse = this.handleRpcException(errorData);
    } else {
      errorResponse = this.handleGenericError(exception);
    }
    
    // Incluir correlationId si está disponible
    if (data && data.correlationId) {
      errorResponse.correlationId = data.correlationId;
    }
    
    // Lanzar una nueva RpcException con la respuesta formateada
    return throwError(() => new RpcException(errorResponse));
  }

  private handleValidationError(exception: ValidationError | ValidationError[]): KafkaResponse<null> {
    const errors = Array.isArray(exception) ? exception : [exception];
    const formattedErrors = errors.map(error => ({
      property: error.property,
      constraints: error.constraints,
    }));

    return {
      status: 'error',
      error: {
        code: 'VALIDATION_ERROR',
        message: 'validation error',
        details: formattedErrors,
      },
      timestamp: new Date(),
    };
  }

  private handleEntityNotFoundError(exception: EntityNotFoundError): KafkaResponse<null> {
    return {
      status: 'error',
      error: {
        code: 'NOT_FOUND',
        message: 'resource not found',
        details: exception.message,
      },
      timestamp: new Date(),
    };
  }

  private handleQueryFailedError(exception: QueryFailedError): KafkaResponse<null> {
    // Errores de base de datos (duplicados, etc.)
    const message = exception.driverError.message || exception.message;
    
    return {
      status: 'error',
      error: {
        code: 'DATABASE_ERROR',
        message: 'error in the database',
        details: message,
      },
      timestamp: new Date(),
    };
  }

  private handleRpcException(errorData: any): KafkaResponse<null> {
    // Si errorData ya tiene la estructura de KafkaResponse, devolvemos directamente
    if (errorData && typeof errorData === 'object' && 'status' in errorData && 'error' in errorData) {
      return errorData;
    }
    
    // Si es un string u otro tipo de objeto, lo convertimos
    return {
      status: 'error',
      error: {
        code: 'RPC_ERROR',
        message: typeof errorData === 'string' ? errorData : 'Error in communication',
        details: errorData,
      },
      timestamp: new Date(),
    };
  }

  private handleGenericError(exception: any): KafkaResponse<null> {
    return {
      status: 'error',
      error: {
        code: exception.code || 'INTERNAL_ERROR',
        message: exception.message || 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? exception.stack : undefined,
      },
      timestamp: new Date(),
    };
  }
}