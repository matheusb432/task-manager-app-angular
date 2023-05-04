import { AddMap } from 'mapper-ts/lib-esm';
import { TaskItemNotePutDto } from './task-item-note-put-dto';

export class TaskItemPutDto {
  id?: number;
  title?: string;
  time?: number;
  rating?: number;
  importance?: number;
  timesheetId?: number;
  @AddMap(TaskItemNotePutDto)
  taskItemNotes?: TaskItemNotePutDto[];
}
