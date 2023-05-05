import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageStates } from 'src/app/util';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { canDeactivateForm } from 'src/app/guards/form.guard';

const routes: Routes = [
  {
    path: '',
    component: ProfilesComponent,
    children: [
      {
        path: PageStates.Create,
        component: CreateProfileComponent,
        canDeactivate: [canDeactivateForm]
      },
      {
        path: PageStates.Details,
        component: ProfileDetailsComponent,
        canDeactivate: [canDeactivateForm]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
