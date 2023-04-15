import { AddMap } from 'mapper-ts/lib-esm';
import { TaskItem } from './task-item';
import { TimesheetNote } from './timesheet-note';

export class Timesheet {
  id?: number;
  date?: string;
  userId?: number;
  finished?: boolean;
  timesheetNotes?: TimesheetNote[];
  @AddMap(TaskItem)
  taskItems?: TaskItem[];
}
