import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesComponent } from './profiles/profiles.component';
import { PageModule } from 'src/app/shared';
import { ProfileRoutingModule } from './profile-routing.module';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ProfileListComponent } from 'src/app/components/profile/profile-list/profile-list.component';
import { ProfileFormComponent } from 'src/app/components/profile/profile-form/profile-form.component';
import { CrudPageModule } from 'src/app/shared/crud-page.module';



@NgModule({
  declarations: [
    ProfilesComponent,
    CreateProfileComponent,
    ProfileDetailsComponent,
    ProfileFormComponent,
    ProfileListComponent,
  ],
  imports: [
    CommonModule,
    PageModule,
    CrudPageModule,
    ProfileRoutingModule,
  ]
})
export class ProfileModule { }
