import { UserRoleDto } from './user-role-dto';

export interface UserAuthGet {
  id: number;
  userName: string;
  name: string;
  email: string;
  userRoles: UserRoleDto[];
}
