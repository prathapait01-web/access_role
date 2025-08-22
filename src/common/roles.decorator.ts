import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './roles.enum';
import { RolesGuard } from './roles.guard';
 
export const ROLES_KEY = 'roles';
 
export function Auth(...role: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, role.length ? role : null),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}
