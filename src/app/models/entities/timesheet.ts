import { AddMap } from 'mapper-ts/lib-esm';
import { TaskItem } from './task-item';
import { TimesheetNote } from './timesheet-note';

export class Timesheet {
  id?: number;
  date?: string;
  userId?: number;
  finished?: boolean;
  @AddMap(TimesheetNote)
  timesheetNotes?: TimesheetNote[];
  @AddMap(TaskItem)
  taskItems?: TaskItem[];
}
