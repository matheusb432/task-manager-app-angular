import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { us } from '../helpers';
import { ApiRequest, SelectOption } from '../models/configs';
import { ProfileType } from '../models/entities/profile-type';
import { ApiService } from './api/api.service';

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
    return this.api.get<ProfileType>(ApiRequest.get<ProfileType>(this.url, ProfileType)) as Promise<
      ProfileType[]
    >;
  }

  static toOptions(items: ProfileType[]): SelectOption<number>[] {
    return items.map(({ id, name, dateRangeEnd, dateRangeStart }, index) => {
      const hasDates = !!dateRangeStart && !!dateRangeEnd;
      const dateSuffix = hasDates
        ? ' (' + us.formatDate(dateRangeStart) + ' - ' + us.formatDate(dateRangeEnd) + ')'
        : '';

      return {
        value: id ?? index,
        label: `${name}${dateSuffix}`,
      };
    });
  }
}
