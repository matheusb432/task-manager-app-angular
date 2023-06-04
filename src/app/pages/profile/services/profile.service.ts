import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, share, switchMap, takeUntil, tap } from 'rxjs/operators';

import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { ActiveProfileIds, Profile, ProfileIdsStore, ProfileType } from 'src/app/models';
import { ProfileFormGroup } from '../components/profile-form';
import { ProfileFormValue } from '../components/profile-form/profile-form-group';
import { PaginationOptions } from '../../../models/configs/pagination-options';
import { TimePipe } from '../../../pipes';
import { DetailsTypes, ElementIds, PubSubUtil, paths } from '../../../util';
import { ProfileUtil } from '../../../util/profile.util';
import { AppService } from '../../../services/app.service';
import { FormService } from '../../../services/base/form.service';
import { LoadingService } from '../../../services/loading.service';
import { ProfileTypeService } from './profile-type.service';
import { ProfileApiService } from './profile-api.service';
import { PresetTaskItemService } from './preset-task-item.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends FormService<Profile> implements OnDestroy {
  private taskService = inject(PresetTaskItemService);
  private app = inject(AppService);
  private router = inject(Router);
  private profileTypeService = inject(ProfileTypeService);

  private readonly initialActiveProfileIds = {
    weekday: null,
    weekend: null,
    holiday: null,
    customDateRanges: [],
  };

  private destroyed$ = new Subject<boolean>();
  private types$ = new BehaviorSubject<ProfileType[]>([]);

  private _activeProfileIds$ = new BehaviorSubject<ActiveProfileIds>(this.initialActiveProfileIds);
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

  constructor(protected override api: ProfileApiService) {
    super(api);
    this.setToastMessages();
    this.initSubs();
  }

  ngOnDestroy(): void {
    PubSubUtil.completeDestroy(this.destroyed$);
  }

  private initSubs() {
    this.app.clearSessionState$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this._item$.next(undefined);
      this._listItems$.next([]);
      this._activeProfileIds$.next(this.initialActiveProfileIds);
      this._profileIdsStore$.next(ProfileUtil.getInitialProfileIdsStore());
    });

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
    const promises: Promise<void>[] = [];

    promises.push(this.taskService.loadTasks());
    promises.push(this.loadProfileTypes());

    await Promise.all(promises);
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

  convertToFormValue(item: Profile): Partial<ProfileFormValue> {
    return {
      ...item,
      timeTarget: TimePipe.formatTimeHhMm(item.timeTarget),
    };
  }

  toJson(fg: ProfileFormGroup): Profile {
    return ProfileFormGroup.toJson(fg);
  }

  goToList = () => this.router.navigateByUrl(paths.profiles);
  goToCreate = () => this.router.navigateByUrl(paths.profilesCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.profilesDetails], { queryParams: { id, type } });
  };

  /**
   * @description Builds an observable stream from a given date in 'yyyy-MM-dd' format
   */
  byDate$(date: string): Observable<Profile | null> {
    return this.profileIdsStore$.pipe(
      map((m) => m.byDate[date]),
      switchMap((id) => this.itemByIdFromCache$(id)),
      share()
    );
  }

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
