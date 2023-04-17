import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { ProfileType } from '../models/entities/profile-type';
import { ApiRequest, SelectOption } from '../models/configs';
import { us } from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class ProfileTypeService {
  private url = `${environment.apiUrl}/profiles/types`;

  constructor(private api: ApiService) {}

  async getItem(id: number): Promise<ProfileType> {
    return this.api.getById<ProfileType>(
      ApiRequest.getById<ProfileType>(this.url, ProfileType, id)
    );
  }

  async getItems(): Promise<ProfileType[]> {
    return this.api.getAll<ProfileType>(
      ApiRequest.getAll<ProfileType>(this.url, ProfileType)
    ) as Promise<ProfileType[]>;
  }

  static toOptions(items: ProfileType[]): SelectOption[] {
    return items.map(({ id, name, dateRangeEnd, dateRangeStart }) => {
      const hasDates = dateRangeStart && dateRangeEnd;
      const dateSuffix =
        ' (' + us.formatDate(dateRangeStart!) + ' - ' + us.formatDate(dateRangeEnd!) + ')';

      return {
        value: id,
        label: `${name}${hasDates ? dateSuffix : ''}`,
      };
    });
  }
}
