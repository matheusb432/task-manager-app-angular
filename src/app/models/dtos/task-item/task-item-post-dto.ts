import { AddMap, IgnoreMap } from 'mapper-ts/lib-esm';
import { TaskItemNotePostDto } from './task-item-note-post-dto';

@IgnoreMap('id')
export class TaskItemPostDto {
  title?: string;
  time?: number;
  rating?: number;
  importance?: number;
  timesheetId?: number;
  @AddMap(TaskItemNotePostDto)
  taskItemNotes?: TaskItemNotePostDto[];
}
