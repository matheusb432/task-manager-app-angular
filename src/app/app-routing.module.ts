import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Pages } from './utils/pages';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: Pages.Home,
    pathMatch: 'full',
  },
  {
    path: Pages.Home,
    component: HomeComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/authentication/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: Pages.Timesheets,
    loadChildren: () => import('./pages/timesheet/timesheet.module').then((m) => m.TimesheetModule),
  },
  {
    path: Pages.Profiles,
    loadChildren: () => import('./pages/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: Pages.Metrics,
    loadChildren: () => import('./pages/metrics/metrics.module').then((m) => m.MetricsModule),
  },
  {
    path: Pages.NotFound,
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: Pages.NotFound,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
