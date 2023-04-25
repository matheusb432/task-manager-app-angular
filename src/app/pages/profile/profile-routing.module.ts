import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageStates } from 'src/app/utils';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ProfilesComponent } from './profiles/profiles.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilesComponent,
    children: [
      {
        path: PageStates.Create,
        component: CreateProfileComponent,
      },
      {
        path: PageStates.Details,
        component: ProfileDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
