import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { ProfileFormGroup } from '../components/profile';
import { ApiRequest } from '../models/configs/api-request';
import { ProfilePostDto, ProfilePutDto } from '../models/dtos/profile';
import { Profile } from '../models/entities';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private url = `${environment.apiUrl}/profiles`;

  constructor(private api: ApiService, private router: Router) {}

  async getItem(id: number): Promise<Profile[]> {
    return this.api.getById<Profile>(ApiRequest.getById<Profile>(this.url, Profile, id)) as Promise<
      Profile[]
    >;
  }

  async getItems(): Promise<Profile[]> {
    return this.api.getAll<Profile>(ApiRequest.getAll<Profile>(this.url, Profile)) as Promise<
      Profile[]
    >;
  }

  // TODO in mapping, convert timeTarget's "15:35" to "1535", or "03:30" to "330" and such
  insert = async (ct: Profile): Promise<any> =>
    this.api.insert(ApiRequest.post(this.url, ct, ProfilePostDto));

  update = async (ct: Profile): Promise<any> =>
    this.api.update(ApiRequest.put(this.url, ct.id ?? 0, ct, ProfilePutDto));

  remove = async (id: number): Promise<any> => this.api.remove(ApiRequest.delete(this.url, id));

  convertToForm(
    fg: ProfileFormGroup,
    // TODO test & clean
    // { name, timeTarget, tasksTarget, priority, profileTypeId }: Profile
    item: Profile
  ) {
    // return {
    //   name: [name, [Validators.required, Validators.maxLength(50)]],
    //   description: [description, [Validators.required, Validators.maxLength(200)]],
    //   badge,
    //   primary: [primary, [Validators.required, Validators.maxLength(10)]],
    //   secondary: [secondary, [Validators.required, Validators.maxLength(10)]],
    // };
    // fg.name.setValue(name);
    // fg.timeTarget.setValue(timeTarget);
    // fg.tasksTarget.setValue(tasksTarget);
    // fg.priority.setValue(priority);
    // fg.profileTypeId.setValue(profileTypeId);

    const keys = ProfileFormGroup.getFormKeys();
    for (const key of keys) fg[key].setValue(item[key]);
  }
}
