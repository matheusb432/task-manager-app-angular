import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';
import { Profile, ProfileType } from 'src/app/models';
import { ProfileFormGroup, getProfileForm } from '../components/profile/profile-form';
import { PaginationOptions } from '../models/configs/pagination-options';
import { TimePipe } from '../pipes';
import { DetailsTypes, ElementIds, FormUtil, paths } from '../util';
import { ProfileApiService } from './api';
import { FormService } from './base/form.service';
import { LoadingService } from './loading.service';
import { ProfileTypeService } from './profile-type.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends FormService<Profile> {
  private types$ = new BehaviorSubject<ProfileType[]>([]);

  typeOptions$ = this.types$.pipe(map((types) => ProfileTypeService.toOptions(types)));

  constructor(
    protected override api: ProfileApiService,
    protected override ts: ToastService,
    private router: Router,
    private profileTypeService: ProfileTypeService
  ) {
    super(ts, api);
    this.setToastMessages();
  }

  loadListData = async (): Promise<void> => {
    await this.loadListItems(PaginationOptions.default());
  };

  loadCreateData = async () => {
    await this.loadProfileTypes();
  };

  loadEditData = async (id: string | null | undefined): Promise<Profile | null> => {
    await this.loadCreateData();
    return this.loadItem(id);
  };

  loadProfileTypes = async (): Promise<void> => {
    const res = await this.profileTypeService.getItems({
      loadings: LoadingService.createManyFromId(ElementIds.ProfileFormType),
    });

    this.types$.next(res);
  };

  convertToForm(item: Profile): ProfileFormGroup {
    const newFg = ProfileFormGroup.from(getProfileForm());

    FormUtil.setFormFromItem(newFg, item, ProfileFormGroup.getFormKeys());

    newFg.controls.timeTarget.setValue(TimePipe.formatTimeHhMm(item.timeTarget));

    return newFg;
  }

  toEntity(fg: ProfileFormGroup): Profile {
    return ProfileFormGroup.toEntity(fg.value);
  }

  private setToastMessages = () => {
    this.toastMessages = {
      ...this.toastMessages,
      noItem: "Couldn't fetch profile!",
      createSuccess: 'Profile created successfully!',
      updateSuccess: 'Profile updated successfully!',
      updateIdError: "Couldn't update profile, couldn't fetch ID!",
      deleteSuccess: 'Profile deleted successfully!',
      duplicateSuccess: 'Profile duplicated successfully!',
    };
  };

  goToList = () => this.router.navigateByUrl(paths.profiles);
  goToCreate = () => this.router.navigateByUrl(paths.profilesCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.profilesDetails], { queryParams: { id, type } });
  };
}
