export class TimesheetMetricsDto {
  id?: number;
  date?: string;
  totalTasks?: number;
  workedHours?: string;
  averageRating?: number;
}

export interface TimesheetMetricsDictionary {
  byDate: Record<string, TimesheetMetricsDto>;
}
