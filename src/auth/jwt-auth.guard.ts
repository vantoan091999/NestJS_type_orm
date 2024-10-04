// src/auth/jwt-auth.guard.ts
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // Gọi phương thức canActivate từ AuthGuard để xác thực
    const isAuthenticated = (await super.canActivate(context)) as boolean;

    // Nếu không có vai trò yêu cầu, chỉ cần trả về true
    if (!roles) {
      return isAuthenticated;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Lấy thông tin người dùng đã xác thực
    if (!isAuthenticated || !user || !roles.includes(user.role)) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập vào tài nguyên này',
      );
    }

    return true;
  }
}
