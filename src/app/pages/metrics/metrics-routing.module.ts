import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetricsComponent } from './metrics/metrics.component';

const routes: Routes = [{ path: '', component: MetricsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetricsRoutingModule {}
