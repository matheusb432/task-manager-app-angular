import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesComponent } from './profiles/profiles.component';
import { SharedModule } from 'src/app/shared';
import { ProfileRoutingModule } from './profile-routing.module';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { CrudPageModule } from 'src/app/shared/crud-page.module';
import { ProfileFormComponent, ProfileListComponent } from 'src/app/components/profile';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CrudPageModule,
    ProfileRoutingModule,
    ProfilesComponent,
    CreateProfileComponent,
    ProfileDetailsComponent,
    ProfileFormComponent,
    ProfileListComponent,
  ],
})
export class ProfileModule {}
