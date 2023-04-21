import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ProfileFormGroup } from '../components/profile';
import { us } from '../helpers';
import { ApiRequest } from '../models/configs/api-request';
import { ProfilePostDto, ProfilePutDto } from '../models/dtos/profile';
import { Profile } from '../models/entities';
import { ProfileType } from '../models/entities/profile-type';
import { PaginatedResult, PostReturn } from '../models/types';
import { DetailsTypes, paths } from '../utils';
import { ApiService } from './api.service';
import { ProfileTypeService } from './profile-type.service';
import { ToastService } from './toast.service';
import { AbstractControl } from '@angular/forms';
import { ODataOptions } from '../helpers/odata';
import { PaginationOptions } from '../helpers/pagination-options';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private url = `${environment.apiUrl}/profiles`;

  // TODO remove?
  item?: Profile;

  private _types: ProfileType[] = [];
  private _listItems: Profile[] = [];
  private _total = 0;

  private _typesSet = new BehaviorSubject<void>(undefined);
  private _listItemsSet = new BehaviorSubject<void>(undefined);
  private _totalSet = new BehaviorSubject<number>(0);

  get types(): ProfileType[] {
    return this._types;
  }

  private set types(value: ProfileType[]) {
    this._types = value;

    this._typesSet.next();
  }

  get typesSet$(): Observable<void> {
    return this._typesSet.asObservable();
  }

  get listItems(): Profile[] {
    return this._listItems;
  }

  // TODO research on different ways to encapsulate rxjs observables
  private set listItems(value: Profile[]) {
    this._listItems = value;

    this._listItemsSet.next();
  }

  get listItemsSet$(): Observable<void> {
    return this._listItemsSet.asObservable();
  }

  get total(): number {
    return this._total;
  }

  private set total(value: number) {
    this._total = value;

    this._totalSet.next(value);
  }

  get totalSet$(): Observable<number> {
    return this._totalSet.asObservable();
  }

  constructor(
    private api: ApiService,
    private profileTypeService: ProfileTypeService,
    private ts: ToastService,
    private router: Router
  ) {}

  async getItem(id: number): Promise<Profile> {
    return this.api.getById<Profile>(ApiRequest.getById<Profile>(this.url, Profile, id));
  }

  async getItems(): Promise<Profile[]> {
    return this.api.get<Profile>(ApiRequest.get<Profile>(this.url, Profile));
  }

  async getPaginated(options: PaginationOptions): Promise<PaginatedResult<Profile>> {
    const queryUrl = us.buildPaginatedODataQuery(this.url, options);

    return this.api.getPaginated<Profile>(ApiRequest.get<Profile>(queryUrl, Profile));
  }

  insert = async (ct: Profile): Promise<PostReturn> =>
    this.api.insert(ApiRequest.post(this.url, this.mapProps(ct), ProfilePostDto));

  duplicate = async (ct: Profile): Promise<PostReturn> => this.insert(ct);

  update = async (ct: Profile): Promise<void> =>
    this.api.update(ApiRequest.put(this.url, ct.id ?? 0, this.mapProps(ct), ProfilePutDto));

  remove = async (id: number): Promise<void> => this.api.remove(ApiRequest.delete(this.url, id));

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

  async loadListItems(options: PaginationOptions): Promise<void> {
    const res = await this.getPaginated(options);

    this.total = res.total;
    this.listItems = res.items;
  }

  async loadItem(id: string | null | undefined): Promise<Profile | null> {
    if (!id) {
      this.ts.error("Couldn't fetch ID!");

      return null;
    }
    this.item = await this.getItem(+id);

    if (this.item == null) this.ts.error("Couldn't fetch data!");

    return this.item;
  }

  loadProfileTypes = async (): Promise<void> => {
    if (us.hasItems(this.types)) return;

    this.types = await this.profileTypeService.getItems();
  };

  private mapProps = (item: Profile): Profile => {
    const mapped = us.deepClone(item);

    // TODO eventually remove, should be automatically set from API
    mapped.userId = 1;

    return mapped;
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
