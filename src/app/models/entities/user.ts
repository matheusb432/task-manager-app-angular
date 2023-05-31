import { UserRole } from './user-role';
import { AddMap } from 'mapper-ts/lib-esm';
import { PresetTaskItem } from './preset-task-item';
import { Profile } from './profile';
import { TableItemConfig } from '../configs';

export class User {
  id?: number;
  name?: string;
  email?: string;
  userName?: string;
  @AddMap(Profile)
  profiles?: Profile[];
  @AddMap(PresetTaskItem)
  presetTaskItems?: PresetTaskItem[];
  @AddMap(UserRole)
  userRoles?: UserRole[];

  static tableItems = (): TableItemConfig<User>[] => [
    { header: '#', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Username', key: 'userName' },
  ];
}
