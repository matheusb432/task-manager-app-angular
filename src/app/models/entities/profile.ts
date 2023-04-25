import { AddMap } from 'mapper-ts/lib-esm';
import { ProfilePresetTaskItem } from './profile-preset-task-item';
import { ProfileType } from './profile-type';
import { TableItem } from '../types';
import { TableItemConfig } from '../configs';

export class Profile implements TableItem {
  id?: number;
  name?: string;
  timeTarget?: string;
  tasksTarget?: number;
  priority?: number;
  userId?: number;
  profileTypeId?: number;
  @AddMap(ProfileType)
  profileType?: ProfileType;
  @AddMap(ProfilePresetTaskItem)
  profilePresetTaskItems?: ProfilePresetTaskItem[];

  static tableItems = (): TableItemConfig<Profile>[] => [
    { header: '#', key: 'id' },
    { header: 'name', key: 'name' },
    { header: 'Time Target', key: 'timeTarget' },
    { header: 'Tasks Target', key: 'tasksTarget' },
    { header: 'Priority', key: 'priority' },
  ];
}
