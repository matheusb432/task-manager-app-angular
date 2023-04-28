import { AddMap } from 'mapper-ts/lib-esm';
import { PresetTaskItem } from './preset-task-item';
import { Profile } from './profile';

export class User {
  id?: number;
  name?: string;
  email?: string;
  @AddMap(Profile)
  profiles?: Profile[];
  @AddMap(PresetTaskItem)
  presetTaskItems?: PresetTaskItem[];
}
