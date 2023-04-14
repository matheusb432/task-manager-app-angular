import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricsRoutingModule } from './metrics-routing.module';
import { PageModule } from 'src/app/shared';

@NgModule({
  declarations: [MetricsComponent],
  imports: [CommonModule, PageModule, MetricsRoutingModule,],
})
export class MetricsModule {}
