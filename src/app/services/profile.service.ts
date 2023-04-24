import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { AbstractControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProfileFormGroup } from '../components/profile';
import { us } from '../helpers';
import { PaginationOptions } from '../helpers/pagination-options';
import { Profile } from '../models/entities';
import { ProfileType } from '../models/entities/profile-type';
import { PostReturn } from '../models/types';
import { Constants, DetailsTypes, ElementIds, paths } from '../utils';
import { ProfileApiService } from './api';
import { ProfileTypeService } from './profile-type.service';
import { ToastService } from './toast.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private item?: Profile;

  private _types: ProfileType[] = [];
  private _listItems: Profile[] = [];
  private _total = 0;

  private _typesSet = new BehaviorSubject<void>(undefined);

  private _lastOptions?: PaginationOptions;

  typeOptions$ = this._typesSet.pipe(map(() => ProfileTypeService.toOptions(this.types)));

  get types(): ProfileType[] {
    return this._types;
  }

  private set types(value: ProfileType[]) {
    this._types = value;

    this._typesSet.next();
  }

  get listItems(): Profile[] {
    return this._listItems;
  }

  private set listItems(value: Profile[]) {
    this._listItems = value;
  }

  get total(): number {
    return this._total;
  }

  private set total(value: number) {
    this._total = value;
  }

  get itemsPerPage(): number {
    return this._lastOptions?.itemsPerPage ?? Constants.DefaultItemsPerPage;
  }

  get currentPage(): number {
    return this._lastOptions?.page ?? 1;
  }

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
    if (this.item?.id === id) this.item = undefined;

    if (!this.listItems?.some((x) => x.id === id)) return;

    this.listItems = this.listItems.filter((x) => x.id !== id);
    this.total--;

    if (this.listItems.length === 0) {
      if (this._lastOptions?.page) this._lastOptions.page--;

      this.loadListItems();
    }
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
    await this.loadProfileTypes();
    return this.loadItem(id);
  };

  async loadListItems(options?: PaginationOptions): Promise<void> {
    if (options == null) {
      options = this._lastOptions ?? PaginationOptions.default();
    } else {
      this._lastOptions = options;
    }

    const res = await this.api.getPaginated(options);

    this.total = res.total;
    this.listItems = res.items;
  }

  async loadItem(id: string | null | undefined): Promise<Profile | null> {
    if (!id) {
      this.ts.error("Couldn't fetch ID!");

      return null;
    }

    const parsedId = +id;

    if (this.item?.id === parsedId) return us.deepClone(this.item);

    this.item = await this.api.getById(parsedId);

    if (this.item == null) this.ts.error("Couldn't fetch data!");

    return us.deepClone(this.item);
  }

  loadProfileTypes = async (): Promise<void> => {
    if (us.notEmpty(this.types)) return;

    this.types = await this.profileTypeService.getItems({
      loading: LoadingService.createLoading(ElementIds.ProfileFormType),
    });
  };

  convertToForm(fg: ProfileFormGroup, item: Profile): void {
    const keys = ProfileFormGroup.getFormKeys();
    for (const key of keys) {
      const control = fg.get(key) as AbstractControl<unknown>;

      if (control == null) continue;

      control.setValue(item[key] == null ? '' : item[key]);
    }
  }

  goToList = () => this.router.navigateByUrl(paths.profiles);
  goToCreate = () => this.router.navigateByUrl(paths.profilesCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.profilesDetails], { queryParams: { id, type } });
  };
}
