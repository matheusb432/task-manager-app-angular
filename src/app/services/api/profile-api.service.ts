import { Injectable } from '@angular/core';

import { ApiEndpoints, ElementIds } from 'src/app/utils';
import { us } from '../../helpers';
import { PaginationOptions } from '../../helpers/pagination-options';
import { ApiRequest } from '../../models/configs/api-request';
import { ProfilePostDto, ProfilePutDto } from '../../models/dtos/profile';
import { Profile } from '../../models/entities';
import { PaginatedResult, PostReturn } from '../../models/types';
import { LoadingService } from '../loading.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  private url = us.buildApiUrl(ApiEndpoints.Profiles);

  constructor(private api: ApiService) {}

  async getById(id: number): Promise<Profile> {
    const res = await this.api.getById<Profile>({
      ...ApiRequest.getById<Profile>(this.url, Profile, id),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.ProfileForm) },
    });

    return this.mapGet(res);
  }

  async getPaginated(options: PaginationOptions): Promise<PaginatedResult<Profile>> {
    const queryUrl = us.buildPaginatedODataQuery(this.url, options);

    const res = await this.api.getPaginated<Profile>({
      ...ApiRequest.get<Profile>(queryUrl, Profile),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.ProfileTable) },
    });

    res.items = res.items.map(this.mapGet);

    return res;
  }

  private mapGet(profile: Profile): Profile {
    if (!profile || typeof profile.timeTarget === 'string') return profile;

    profile.timeTarget = us.numberToTime(parseInt(profile.timeTarget ?? '0'));

    return profile;
  }

  insert = async (item: Profile): Promise<PostReturn> =>
    this.api.insert({
      ...ApiRequest.post(this.url, item, ProfilePostDto),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.ProfileSubmit) },
    });

  duplicate = async (item: Profile): Promise<PostReturn> => this.insert(item);

  update = async (item: Profile): Promise<void> =>
    this.api.update({
      ...ApiRequest.put(this.url, item.id ?? 0, item, ProfilePutDto),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.ProfileSubmit) },
    });

  remove = async (id: number): Promise<void> =>
    this.api.remove({
      ...ApiRequest.delete(this.url, id),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.ProfileDelete) },
    });
}
