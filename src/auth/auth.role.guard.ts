import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/user/roles.decorator';
import { UserRole } from 'src/user/user.role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }
      const { user } = context.switchToHttp().getRequest();
      if (!requiredRoles.includes(user.role))
        throw new UnauthorizedException('You dont have a rights to do that!');
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }
}
