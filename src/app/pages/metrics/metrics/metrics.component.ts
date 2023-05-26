import { Component } from '@angular/core';
import { TitleComponent } from '../../../components/custom/title/title.component';
import { PageLayoutComponent } from '../../../components/layout/page-layout/page-layout.component';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent, TitleComponent],
})
export class MetricsComponent {}
