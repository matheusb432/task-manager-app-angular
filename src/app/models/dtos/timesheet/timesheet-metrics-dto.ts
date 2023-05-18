export class TimesheetMetricsDto {
  id?: number;
  date?: string;
  totalTasks?: number;
  workedHours?: string;
  averageRating?: number;
}

export interface TimesheetMetricsStore {
  byDate: Record<string, TimesheetMetricsDto | undefined>;
  dates: string[];
}
