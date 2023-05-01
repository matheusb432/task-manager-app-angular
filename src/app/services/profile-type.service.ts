import { Injectable } from '@angular/core';
import { us } from '../helpers';
import { ApiRequest, SelectOption } from '../models/configs';
import { ProfileType } from '../models/entities/profile-type';
import { RequestData } from '../models/types';
import { ApiEndpoints } from '../utils';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileTypeService {
  private url = us.buildApiUrl(ApiEndpoints.ProfileTypes);

  constructor(private api: ApiService) {}

  async getItem(id: number): Promise<ProfileType> {
    return this.api.getById<ProfileType>(
      ApiRequest.getById<ProfileType>(this.url, ProfileType, id)
    );
  }

  async getItems(customData?: RequestData): Promise<ProfileType[]> {
    return this.api.getOData<ProfileType>({
      ...ApiRequest.get<ProfileType>(this.url, ProfileType),
      customData,
    });
  }

  static toOptions(items: ProfileType[]): SelectOption<number>[] {
    return items.map(({ id, name, dateRangeEnd, dateRangeStart }, index) => ({
      value: id ?? index,
      label: `${name}${this.getDatesSuffix(dateRangeStart, dateRangeEnd)}`,
    }));
  }

  private static getDatesSuffix(
    dateRangeStart: Date | undefined,
    dateRangeEnd: Date | undefined
  ): string {
    const hasDates = !!dateRangeStart && !!dateRangeEnd;

    return hasDates
      ? ' (' + us.formatDate(dateRangeStart) + ' - ' + us.formatDate(dateRangeEnd) + ')'
      : '';
  }
}
