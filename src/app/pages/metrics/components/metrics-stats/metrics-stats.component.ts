import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesheetAverageMetrics } from 'src/app/models';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { Icons } from 'src/app/util';

@Component({
  selector: 'app-metrics-stats',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './metrics-stats.component.html',
  styleUrls: ['./metrics-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsStatsComponent {
  @Input({ required: true }) avgMetrics!: TimesheetAverageMetrics | null;

  Icons = Icons;
}
