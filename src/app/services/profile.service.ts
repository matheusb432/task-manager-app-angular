import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { BehaviorSubject, Subject, from } from 'rxjs';
import { ActiveProfileIds, ProfileIdsStore, Profile, ProfileType } from 'src/app/models';
import { ProfileFormGroup, getProfileForm } from '../components/profile/profile-form';
import { PaginationOptions } from '../models/configs/pagination-options';
import { TimePipe } from '../pipes';
import { DetailsTypes, ElementIds, FormUtil, PubSubUtil, paths } from '../util';
import { ProfileUtil } from '../util/profile.util';
import { ProfileApiService } from './api';
import { AppService } from './app.service';
import { FormService } from './base/form.service';
import { LoadingService } from './loading.service';
import { ProfileTypeService } from './profile-type.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends FormService<Profile> implements OnDestroy {
  private destroyed$ = new Subject<boolean>();
  private types$ = new BehaviorSubject<ProfileType[]>([]);

  private _activeProfileIds$ = new BehaviorSubject<ActiveProfileIds>({
    weekday: null,
    weekend: null,
    holiday: null,
    customDateRanges: [],
  });
  private _profileIdsStore$ = new BehaviorSubject<ProfileIdsStore>(
    ProfileUtil.getInitialProfileIdsStore()
  );

  get weekdayProfileId$() {
    return this._activeProfileIds$.pipe(map((ids) => ids.weekday));
  }

  get weekendProfileId$() {
    return this._activeProfileIds$.pipe(map((ids) => ids.weekend));
  }

  get holidayProfileId$() {
    return this._activeProfileIds$.pipe(map((ids) => ids.holiday));
  }

  get profileIdsStore$() {
    return this._profileIdsStore$.asObservable();
  }

  typeOptions$ = this.types$.pipe(map((types) => ProfileTypeService.toOptions(types)));

  constructor(
    protected override api: ProfileApiService,
    protected override ts: ToastService,
    private app: AppService,
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
        switchMap((profiles) => {
          this.setActiveProfileIds(profiles);

          return from(this._activeProfileIds$.pipe(takeUntil(this.destroyed$)));
        }),
        tap((activeProfileIds) => {
          this.setProfileIdsStore(activeProfileIds);
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

  private setProfileIdsStore = (activeProfileIds: ActiveProfileIds) => {
    const range = this.app.getDateRangeOrDefault();

    const store = ProfileUtil.buildProfileIdsStore(activeProfileIds, range);

    this._profileIdsStore$.next(store);
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

  private setActiveProfileIds = (profiles: Profile[]) => {
    const baseProfiles = profiles.filter(
      (profile) => !ProfileUtil.isCustomProfile(profile.profileType?.type)
    );
    const customProfiles = profiles.filter((profile) =>
      ProfileUtil.isCustomProfile(profile.profileType?.type)
    );

    const weekdayProfile = ProfileUtil.getActiveWeekdayProfile(baseProfiles);
    const weekendProfile = ProfileUtil.getActiveWeekendProfile(baseProfiles);
    const holidayProfile = ProfileUtil.getActiveHolidayProfile(baseProfiles);
    const customDateRanges = ProfileUtil.getCustomProfileDateRanges(customProfiles);

    this._activeProfileIds$.next({
      weekday: weekdayProfile?.id ?? null,
      weekend: weekendProfile?.id ?? null,
      holiday: holidayProfile?.id ?? null,
      customDateRanges,
    });
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
