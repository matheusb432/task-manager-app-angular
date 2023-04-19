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
import { PostReturn } from '../models/types';
import { DetailsTypes, paths } from '../utils';
import { ApiService } from './api.service';
import { ProfileTypeService } from './profile-type.service';
import { ToastService } from './toast.service';
import { AbstractControl } from '@angular/forms';

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

  insert = async (ct: Profile): Promise<PostReturn> =>
    this.api.insert(ApiRequest.post(this.url, this.mapProps(ct), ProfilePostDto));

  update = async (ct: Profile): Promise<void> =>
    this.api.update(ApiRequest.put(this.url, ct.id ?? 0, this.mapProps(ct), ProfilePutDto));

  remove = async (id: number): Promise<void> => this.api.remove(ApiRequest.delete(this.url, id));

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

    if (this.item == null) this.ts.error("Couldn't fetch data!");

    return this.item;
  }

  loadProfileTypes = async (): Promise<void> => {
    if (this.types?.length > 0) return;

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
