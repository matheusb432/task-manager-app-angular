import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Pages, paths } from './util';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { canActivateAuth, canActivateAuthPage } from './guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: Pages.Home,
    pathMatch: 'full',
  },
  {
    path: Pages.Auth,
    redirectTo: `${Pages.Auth}/${Pages.Login}`,
    pathMatch: 'full',
  },
  {
    path: Pages.Home,
    component: HomeComponent,
    canActivate: [() => canActivateAuth()],
  },
  {
    path: Pages.Auth,
    loadChildren: () =>
      import('./pages/authentication/authentication.module').then((m) => m.AuthenticationModule),
    canActivateChild: [() => canActivateAuthPage()],
  },
  {
    path: Pages.Timesheets,
    loadChildren: () => import('./pages/timesheet/timesheet.module').then((m) => m.TimesheetModule),
    canActivate: [() => canActivateAuth()],
  },
  {
    path: Pages.Profiles,
    loadChildren: () => import('./pages/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [() => canActivateAuth()],
  },
  {
    path: Pages.NotFound,
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: paths.notFound,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
