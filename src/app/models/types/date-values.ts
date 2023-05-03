import { DaysOfWeek } from './days-of-week.enum';

export interface DateValues {
  date: string;
  day: string;
  month: string;
  year: number;
  dayOfWeek: DaysOfWeek | '';
}
