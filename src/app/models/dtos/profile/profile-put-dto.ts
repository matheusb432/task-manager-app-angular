import { AddMap } from 'mapper-ts/lib-esm';
import { ProfilePresetTaskItemPutDto } from './profile-preset-task-item-put-dto';
import { ProfileTypePutDto } from './profile-type-put-dto';

export class ProfilePutDto {
  id?: number;
  name?: string;
  timeTarget?: number;
  tasksTarget?: number;
  priority?: number;
  profileTypeId?: number;
  @AddMap(ProfileTypePutDto)
  profileType?: ProfileTypePutDto;
  @AddMap(ProfilePresetTaskItemPutDto)
  profilePresetTaskItems?: ProfilePresetTaskItemPutDto[];
}
