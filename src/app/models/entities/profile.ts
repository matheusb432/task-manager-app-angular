import { AddMap } from 'mapper-ts/lib-esm';
import { ProfilePresetTaskItem } from './profile-preset-task-item';
import { ProfileType } from './profile-type';
import { TableItem } from '../types';

export class Profile implements TableItem {
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

  static tableKeys = (): (keyof Profile)[] => [
    'id',
    'name',
    'timeTarget',
    'tasksTarget',
    'priority',
  ];

  static tableHeaders = () => ['#', 'name', 'Time Target', 'Tasks Target', 'Priority'];
}
