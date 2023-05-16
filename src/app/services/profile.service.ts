import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { BehaviorSubject, Subject, from } from 'rxjs';
import { Profile, ProfileType } from 'src/app/models';
import { ProfileFormGroup, getProfileForm } from '../components/profile/profile-form';
import { PaginationOptions } from '../models/configs/pagination-options';
import { TimePipe } from '../pipes';
import { DetailsTypes, ElementIds, FormUtil, PubSubUtil, paths } from '../util';
import { ProfileApiService } from './api';
import { FormService } from './base/form.service';
import { LoadingService } from './loading.service';
import { ProfileTypeService } from './profile-type.service';
import { ToastService } from './toast.service';
import { ProfileUtil } from '../util/profile.util';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends FormService<Profile> implements OnDestroy {
  private destroyed$ = new Subject<boolean>();
  private types$ = new BehaviorSubject<ProfileType[]>([]);
  private _weekdayProfile$ = new BehaviorSubject<Profile | null>(null);
  private _weekendProfile$ = new BehaviorSubject<Profile | null>(null);
  private _holidayProfile$ = new BehaviorSubject<Profile | null>(null);

  get weekdayProfile$() {
    return this._weekdayProfile$.asObservable();
  }

  get weekendProfile$() {
    return this._weekendProfile$.asObservable();
  }

  get holidayProfile$() {
    return this._holidayProfile$.asObservable();
  }

  typeOptions$ = this.types$.pipe(map((types) => ProfileTypeService.toOptions(types)));

  constructor(
    protected override api: ProfileApiService,
    protected override ts: ToastService,
    private router: Router,
    private profileTypeService: ProfileTypeService
  ) {
    super(ts, api);
    this.setToastMessages();
    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  initSubs() {
    this.listItems$
      .pipe(
        takeUntil(this.destroyed$),
        tap((profiles) => {
          this.setActiveProfiles(profiles);
        }),
        switchMap((profiles) => profiles),
        filter((profile) => ProfileUtil.isCustomProfile(profile.profileType?.type)),
        tap((profile) => {
          // TODO set active date ranges on slides/timesheets?
          console.warn(profile);
        })
      )
      .subscribe();
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

    FormUtil.setFormFromItem(newFg, item);

    newFg.controls.timeTarget.setValue(TimePipe.formatTimeHhMm(item.timeTarget));

    return newFg;
  }

  toJson(fg: ProfileFormGroup): Profile {
    return ProfileFormGroup.toJson(fg);
  }

  goToList = () => this.router.navigateByUrl(paths.profiles);
  goToCreate = () => this.router.navigateByUrl(paths.profilesCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.profilesDetails], { queryParams: { id, type } });
  };

  private setActiveProfiles = (profiles: Profile[]) => {
    this._weekdayProfile$.next(ProfileUtil.getActiveWeekdayProfile(profiles));
    this._weekendProfile$.next(ProfileUtil.getActiveWeekendProfile(profiles));
    this._holidayProfile$.next(ProfileUtil.getActiveHolidayProfile(profiles));
  };

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
}
