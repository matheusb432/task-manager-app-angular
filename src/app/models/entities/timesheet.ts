import { AddMap } from 'mapper-ts/lib-esm';
import { TaskItem } from './task-item';
import { TimesheetNote } from './timesheet-note';
import { TableItem } from '../types';
import { TableItemConfig } from '../configs';
import { ArrayUtil } from 'src/app/util';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TimePipe } from 'src/app/pipes';

export class Timesheet implements TableItem {
  id?: number;
  date?: string;
  userId?: number;
  finished?: boolean;
  @AddMap(TimesheetNote)
  notes?: TimesheetNote[];
  @AddMap(TaskItem)
  tasks?: TaskItem[];

  get totalTasks(): number {
    return this.tasks?.length ?? 0;
  }

  get totalHours(): number {
    return ArrayUtil.sumNumberProp(this.tasks, 'time');
  }

  get averageRating(): number {
    if (!this.totalTasks) return 0;

    const sum = ArrayUtil.sumNumberProp(this.tasks, 'rating');

    return sum / this.totalTasks;
  }

  static tableItems = (): TableItemConfig<Timesheet>[] => [
    { header: '#', key: 'id' },
    { header: 'Date', key: 'date', pipe: DatePipe },
    { header: 'Finished', key: 'finished' },
    { header: 'Total Tasks', key: 'totalTasks', disabledOrderBy: true },
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
