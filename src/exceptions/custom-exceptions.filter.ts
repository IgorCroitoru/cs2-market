import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { CustomError } from './CustomError';

// @Catch(UnauthorizedException)
// export class CustomUnauthorizedExceptionFilter implements ExceptionFilter {
//   catch(exception: UnauthorizedException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
    
//     response
//       .status(401)
//       .json({
//         statusCode: 401,
//         path: request.url,
//         message: 'Unauthorized access',
//       });
//   }
// }


@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse() : { message: 'Internal server error' };

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}


@Catch()
export class BotExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let eresult;

    if (exception instanceof CustomError) {
      status = exception.statusCode;
      message = exception.message;
      eresult = exception.eresult;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = (exceptionResponse as any).message || exceptionResponse;
    }
    else if(CustomError.typeOf(exception)){
      status = exception.statusCode,
      message = exception.message
      eresult = exception.eresult
    }
    

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      eresult
    });
  }
}

export class ValidationException extends HttpException {
  constructor(message: string) {
      super(message, HttpStatus.BAD_REQUEST);
  }
}