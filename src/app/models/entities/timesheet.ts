import { AddMap } from 'mapper-ts/lib-esm';
import { TaskItem } from './task-item';
import { TimesheetNote } from './timesheet-note';
import { TableItem } from '../types';
import { TableItemConfig } from '../configs';
import { ArrayUtilsService } from 'src/app/helpers';

export class Timesheet implements TableItem {
  id?: number;
  date?: string;
  userId?: number;
  finished?: boolean;
  @AddMap(TimesheetNote)
  timesheetNotes?: TimesheetNote[];
  @AddMap(TaskItem)
  taskItems?: TaskItem[];

  get totalTaskItems(): number {
    return this.taskItems?.length ?? 0;
  }

  get totalHours(): number {
    // TODO test
    return ArrayUtilsService.sumNumberProp(this.taskItems, 'time');
    // return this.taskItems?.reduce((prev,curr)=> prev.time + curr.time) ?? 0;
  }

  // TODO test
  get averageRating(): number {
    const sum = ArrayUtilsService.sumNumberProp(this.taskItems, 'rating');

    return sum / this.totalTaskItems;
  }

  static tableItems = (): TableItemConfig<Timesheet>[] => [
    { header: '#', key: 'id' },
    { header: 'Date', key: 'date' },
    { header: 'Finished', key: 'finished' },
  ];
}
