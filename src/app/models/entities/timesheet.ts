import { AddMap } from 'mapper-ts/lib-esm';
import { TaskItem } from './task-item';
import { TimesheetNote } from './timesheet-note';
import { TableItem } from '../types';
import { TableItemConfig } from '../configs';
import { ArrayUtilsService } from 'src/app/helpers';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TimePipe } from 'src/app/pipes';

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
    return ArrayUtilsService.sumNumberProp(this.taskItems, 'time');
  }

  get averageRating(): number {
    if (!this.totalTaskItems) return 0;

    const sum = ArrayUtilsService.sumNumberProp(this.taskItems, 'rating');

    return sum / this.totalTaskItems;
  }

  static tableItems = (): TableItemConfig<Timesheet>[] => [
    { header: '#', key: 'id' },
    { header: 'Date', key: 'date', pipe: DatePipe },
    { header: 'Finished', key: 'finished' },
    { header: 'Total Tasks', key: 'totalTaskItems', disabledOrderBy: true },
    { header: 'Hours', key: 'totalHours', disabledOrderBy: true, pipe: TimePipe },
    {
      header: 'Rating',
      key: 'averageRating',
      disabledOrderBy: true,
      pipe: DecimalPipe,
      pipeArgs: ['1.1-2'],
    },
  ];
}
