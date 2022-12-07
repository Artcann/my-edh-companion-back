import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "../entities/enum/role.enum";


export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);