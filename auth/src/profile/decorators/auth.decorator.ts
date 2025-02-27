import { applyDecorators, UseGuards } from "@nestjs/common";
import { ERole } from "../enums/role.enum";
import { JwtGuard } from "../guards/jwt.guard";
import { RolesGuard } from "../guards/roles.guard";
import { AllowRoles } from "./roles.decorator";

/**
 * Apply authentication decorators
 * @param roles array of roles
 * @returns
 */
export function Auth(...roles: ERole[]) {
  return applyDecorators(
    UseGuards(JwtGuard, RolesGuard),
    AllowRoles(...roles),
  );
}
