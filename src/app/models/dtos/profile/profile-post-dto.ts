import { AddMap, IgnoreMap } from 'mapper-ts/lib-esm';
import { PresetTaskItemPostDto } from '../task-item';

@IgnoreMap('id')
export class ProfilePostDto {
  timeTarget?: number;
  tasksTarget?: number;
  priority?: number;
  userId?: number;
  profileTypeId?: number;
  @AddMap(PresetTaskItemPostDto)
  presetTaskItems?: PresetTaskItemPostDto[];
}
