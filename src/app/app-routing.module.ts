import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Pages } from './utils/page-paths.enum';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: Pages.Home,
    data: {
      breadcrumb: 'Home',
    },
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: Pages.Timesheets,
    data: {
      breadcrumb: 'Timesheets',
    },
    loadChildren: () => import('./pages/timesheet/timesheet.module').then((m) => m.TimesheetModule),
  },
  {
    path: Pages.Profiles,
    data: {
      breadcrumb: 'Profiles',
    },
    loadChildren: () => import('./pages/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: Pages.Metrics,
    data: {
      breadcrumb: 'Metrics',
    },
    loadChildren: () => import('./pages/metrics/metrics.module').then((m) => m.MetricsModule),
  },
  // TODO implement 404 page
  {
    path: '**',
    redirectTo: 'home',
    // redirectTo: 'not-found',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
