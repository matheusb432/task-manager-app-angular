import { Routes } from '@angular/router';
import { ProfilesComponent } from './profiles/profiles.component';
import { PageStates, Pages } from 'src/app/util';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { canDeactivateForm } from 'src/app/guards/form.guard';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { CreatePresetTaskItemComponent } from './create-preset-task-item/create-preset-task-item.component';
import { PresetTaskItemDetailsComponent } from './preset-task-item-details/preset-task-item-details.component';
import { PresetTaskItemsComponent } from './preset-task-items/preset-task-items.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfilesComponent,
    children: [
      // {
      //   path: Pages.PresetTaskItems,
      //   component: CreatePresetTaskItemComponent,
      //   canDeactivate: [canDeactivateForm],
      // },
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
  // TODO implement
  {
    path: Pages.PresetTaskItems,
    component: PresetTaskItemsComponent,
    children: [
      {
        path: PageStates.Create,
        component: CreatePresetTaskItemComponent,
        canDeactivate: [canDeactivateForm],
      },
      {
        path: PageStates.Details,
        component: PresetTaskItemDetailsComponent,
        canDeactivate: [canDeactivateForm],
      },
    ],
  },
];
