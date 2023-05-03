import { DaysOfWeek } from './days-of-week.enum';

export interface DateValues {
  date: string;
  day: string;
  dayOfWeek: DaysOfWeek | '';
}
