import { TimePipe } from 'src/app/pipes';
import { TableItemConfig } from '../configs';
import { TableItem } from '../types';

export class PresetTaskItem implements TableItem {
  id?: number;
  title?: string;
  time?: number;
  importance?: number;
  comment?: string;
  userId?: number;

  static tableItems = (): TableItemConfig<PresetTaskItem>[] => [
    {
      header: 'Title',
      key: 'title',
      styles: {
        minWidth: '160px',
      },
    },
    { header: 'Time', key: 'time', pipe: TimePipe },
    { header: 'Importance', key: 'importance' },
  ];
}
