import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { RoleEnum } from "../entities/enum/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if(!requiredRoles) {
        return true;
      }
      const { user } = context.switchToHttp().getRequest();

      return requiredRoles.some((role) => user.roles.some(e => e.roleLabel === role));
  }
}