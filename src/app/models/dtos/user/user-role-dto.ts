import { RoleDto } from './role-dto';

export interface UserRoleDto {
  id: number;
  userId: number;
  roleId: number;
  role: RoleDto;
}
