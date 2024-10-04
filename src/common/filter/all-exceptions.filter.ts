import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.message
        : 'An unexpected error occurred';

    // Xử lý chi tiết lỗi từ BadRequestException (validation errors)
    if (exception instanceof BadRequestException) {
      const errorResponse = exception.getResponse() as any;
      if (typeof errorResponse === 'object' && errorResponse.message) {
        // Nếu là lỗi validation, message chứa chi tiết các trường không hợp lệ
        message = errorResponse.message;
      }
    }
    console.log(message);

    // Trả về phản hồi lỗi với thông tin chi tiết
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
