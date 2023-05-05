import { AddMap } from 'mapper-ts/lib-esm';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { TableItemConfig } from '../configs';
import { TableItem } from '../types';
import { ProfilePresetTaskItem } from './profile-preset-task-item';
import { ProfileType } from './profile-type';

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
    { header: 'Name', key: 'name' },
    { header: 'Type', key: ['profileType', 'name'], },
    { header: 'Time Target', key: 'timeTarget', pipe: TimePipe },
    { header: 'Tasks Target', key: 'tasksTarget' },
    { header: 'Priority', key: 'priority' },
  ];
}
