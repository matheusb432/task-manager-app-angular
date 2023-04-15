import { PresetTaskItem } from './preset-task-item';
import { Profile } from './profile';

export class User {
  id?: number;
  name?: string;
  email?: string;
  profiles?: Profile[];
  presetTaskItems?: PresetTaskItem[];
}
