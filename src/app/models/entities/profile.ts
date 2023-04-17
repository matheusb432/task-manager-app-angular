import { AddMap } from 'mapper-ts/lib-esm';
import { ProfilePresetTaskItem } from './profile-preset-task-item';
import { ProfileType } from './profile-type';

export class Profile {
  id?: number;
  name?: string;
  timeTarget?: number | string;
  tasksTarget?: number;
  priority?: number;
  userId?: number;
  profileTypeId?: number;
  @AddMap(ProfileType)
  profileType?: ProfileType;
  @AddMap(ProfilePresetTaskItem)
  profilePresetTaskItems?: ProfilePresetTaskItem[];
}
