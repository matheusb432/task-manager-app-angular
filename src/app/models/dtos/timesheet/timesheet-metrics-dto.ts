export class TimesheetMetricsDto {
  id?: number;
  date?: string;
  totalTasks?: number;
  workedHours?: string;
  averageRating?: number;
}

export interface TimesheetMetrics {
  id: number;
  date: string;
  totalTasks: number;
  workedHours: number;
  averageRating: number;
}

export interface TimesheetMetricsStore {
  byDate: Record<string, TimesheetMetrics | undefined>;
  dates: string[];
}
