import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { ProfileFormGroup } from '../components/profile';
import { ApiRequest } from '../models/configs/api-request';
import { ProfilePostDto, ProfilePutDto } from '../models/dtos/profile';
import { Profile } from '../models/entities';
import { ApiService } from './api.service';
import { DetailsTypes, Pages, paths } from '../utils';
import { HttpParams } from '@angular/common/http';
import { profileForm } from '../helpers/validations';
import { us } from '../helpers';
import { ProfileType } from '../models/entities/profile-type';
import { ProfileTypeService } from './profile-type.service';
import { ToastService } from './toast.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private url = `${environment.apiUrl}/profiles`;

  item?: Profile;
  private _types: ProfileType[] = [];

  private _typesSet = new BehaviorSubject<void>(undefined);

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
    return this.api.getAll<Profile>(ApiRequest.getAll<Profile>(this.url, Profile)) as Promise<
      Profile[]
    >;
  }

  insert = async (ct: Profile): Promise<any> =>
    this.api.insert(ApiRequest.post(this.url, this.mapProps(ct), ProfilePostDto));

  update = async (ct: Profile): Promise<any> =>
    this.api.update(ApiRequest.put(this.url, ct.id ?? 0, this.mapProps(ct), ProfilePutDto));

  remove = async (id: number): Promise<any> => this.api.remove(ApiRequest.delete(this.url, id));

  loadCreateData = async () => {
    await this.loadProfileTypes();
  };

  loadEditData = async (id: string | null | undefined): Promise<Profile | null> => {
    await this.loadProfileTypes();
    return this.loadItem(id);
  };

  async loadItem(id: string | null | undefined): Promise<Profile | null> {
    if (!id) {
      this.ts.error("Couldn't fetch ID!");

      return null;
    }
    this.item = await this.getItem(+id);

    if (!this.item) {
      this.ts.error("Couldn't fetch data!");

      return null;
    }

    return this.item;
  }

  // TODO only load if types is empty?
  loadProfileTypes = async () => {
    try {
      this.types = await this.profileTypeService.getItems();
    } catch (ex) {
      this.ts.error('Error loading profile types');
    }
  };

  private mapProps = (item: Profile): Profile => {
    const mapped = us.deepClone(item);

    mapped.timeTarget = us.timeToNumber(mapped.timeTarget as string);
    // TODO eventually remove, should be automatically set from API
    mapped.userId = 1;

    return mapped;
  };

  convertToForm(fg: ProfileFormGroup, item: Profile): void {
    const keys = ProfileFormGroup.getFormKeys();
    for (const key of keys) fg.get(key)!.setValue(item[key]);
  }

  goToList = () => this.router.navigateByUrl(paths.profiles);
  goToCreate = () => this.router.navigateByUrl(paths.profilesCreate);
  goToDetails = async (id: number, type: DetailsTypes) => {
    this.router.navigate([paths.profilesDetails], { queryParams: { id, type } });
  };
}
