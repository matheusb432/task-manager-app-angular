import { Routes } from '@angular/router';
import { ProfilesComponent } from './profiles/profiles.component';
import { PageStates } from 'src/app/util';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { canDeactivateForm } from 'src/app/guards/form.guard';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfilesComponent,
    children: [
      {
        path: PageStates.Create,
        component: CreateProfileComponent,
        canDeactivate: [canDeactivateForm],
      },
      {
        path: PageStates.Details,
        component: ProfileDetailsComponent,
        canDeactivate: [canDeactivateForm],
      },
    ],
  },
];
