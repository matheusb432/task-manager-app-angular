import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { BehaviorSubject, Observable } from 'rxjs';
import { PostReturn, Profile, ProfileType } from 'src/app/models';
import { ProfileFormGroup, getProfileForm } from '../components/profile/profile-form';
import { PaginationOptions } from '../models/configs/pagination-options';
import { TimePipe } from '../pipes';
import { Constants, DetailsTypes, ElementIds, FormUtil, StringUtil, paths } from '../util';
import { ProfileApiService } from './api';
import { LoadingService } from './loading.service';
import { ProfileTypeService } from './profile-type.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private item$ = new BehaviorSubject<Profile | undefined>(undefined);
  private types$ = new BehaviorSubject<ProfileType[]>([]);
  private _listItems$ = new BehaviorSubject<Profile[]>([]);
  private _total$ = new BehaviorSubject(0);
  private _lastOptions$ = new BehaviorSubject<PaginationOptions>(PaginationOptions.default());

  get listItems$(): Observable<Profile[]> {
    return this._listItems$.asObservable();
  }

  get total$(): Observable<number> {
    return this._total$.asObservable();
  }

  get lastOptions$(): Observable<PaginationOptions> {
    return this._lastOptions$.asObservable();
  }

  typeOptions$ = this.types$.pipe(map((types) => ProfileTypeService.toOptions(types)));

  constructor(
    private api: ProfileApiService,
    private profileTypeService: ProfileTypeService,
    private ts: ToastService,
    private router: Router
  ) {}

  update = async (id: string | null | undefined, fg: ProfileFormGroup): Promise<void> => {
    if (id == null) {
      this.ts.error("Error while updating profile, couldn't fetch ID!");
      return;
    }

    const item = ProfileFormGroup.toEntity(fg.value);

    await this.api.update({ id: +id, ...item });

    this.ts.success('Profile updated successfully!');

    await this.loadListItems();
  };

  insert = async (fg: ProfileFormGroup): Promise<PostReturn> => {
    const item = ProfileFormGroup.toEntity(fg.value);

    const res = await this.api.insert(item);

    this.ts.success('Profile created successfully!');

    await this.loadListItems();

    return res;
  };

  duplicate = async (fg: ProfileFormGroup): Promise<PostReturn> => {
    const item = ProfileFormGroup.toEntity(fg.value);

    const res = await this.api.duplicate(item);

    this.ts.success('Profile duplicated successfully');

    await this.loadListItems();

    return res;
  };

  private removeFromMemory = (id: number): void => {
    const item = this.item$.getValue();
    if (item?.id === id) this.item$.next(undefined);

    const listItems = this._listItems$.getValue();

    if (!listItems.some((x) => x.id === id)) return;

    const filteredListItems = listItems.filter((x) => x.id !== id);
    this._listItems$.next(filteredListItems);
    this._total$.next(this._total$.getValue() - 1);

    if (filteredListItems.length === 0) {
      this.decrementPage();

      this.loadListItems();
    }
  };

  private decrementPage = (): void => {
    const lastOptions = this._lastOptions$.getValue();
    if (!lastOptions?.page) return;

    this._lastOptions$.next({ ...lastOptions, page: lastOptions.page - 1 });
  };

  getItemsPerPage = (): number => {
    return this._lastOptions$.getValue()?.itemsPerPage ?? Constants.DefaultItemsPerPage;
  };

  deleteItem = async (id: string | number | null | undefined): Promise<void> => {
    if (!id) {
      this.ts.error("Couldn't fetch ID!");

      return;
    }
    const parsedId = +id;

    await this.api.remove(parsedId);
    this.removeFromMemory(parsedId);

    this.ts.success('Profile deleted successfully!');

    this.goToList();
  };

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

  async loadListItems(options?: PaginationOptions): Promise<void> {
    if (options == null) {
      options = this._lastOptions$.getValue() ?? PaginationOptions.default();
    } else {
      this._lastOptions$.next(options);
    }

    const res = await this.api.getPaginated(options);

    this._listItems$.next(res.items);
    this._total$.next(res.total);
  }

  async loadItem(id: string | null | undefined): Promise<Profile | null> {
    if (!id) {
      this.ts.error("Couldn't fetch ID!");

      return null;
    }

    const parsedId = +id;
    const item = this.item$.getValue();

    if (item?.id === parsedId) return item;

    const res = await this.api.getById(parsedId);

    this.item$.next(res);

    if (res == null) this.ts.error("Couldn't fetch data!");

    return res;
  }

  loadProfileTypes = async (): Promise<void> => {
    if (StringUtil.notEmpty(this.types$.getValue())) return;

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

  goToList = () => this.router.navigateByUrl(paths.profiles);
  goToCreate = () => this.router.navigateByUrl(paths.profilesCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.profilesDetails], { queryParams: { id, type } });
  };
}
