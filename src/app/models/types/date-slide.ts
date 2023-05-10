import { TimesheetMetricsDto } from '../dtos';
import { DateValues } from './date-values';

export interface DateSlide extends DateValues {
  id: string;
  selected?: boolean;
  firstOfMonth?: boolean;
  metrics?: TimesheetMetricsDto;
}
