import { AddMap } from 'mapper-ts/lib-esm';
import { TaskItemNote } from './task-item-note';

export class TaskItem {
  id?: number;
  title?: string;
  time?: number;
  rating?: any;
  importance?: number;
  timesheetId?: number;
  @AddMap(TaskItemNote)
  taskItemNotes?: TaskItemNote[];
}
