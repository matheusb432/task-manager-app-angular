import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricsRoutingModule } from './metrics-routing.module';
import { SharedModule } from 'src/app/shared';

@NgModule({
  imports: [CommonModule, SharedModule, MetricsRoutingModule, MetricsComponent],
})
export class MetricsModule {}
