import { Injectable } from '@angular/core';

import { ApiEndpoints, ElementIds, QueryUtil } from 'src/app/util';
import {
  ApiRequest,
  PaginatedResult,
  PaginationOptions,
  PostReturn,
  Profile,
  ProfilePostDto,
  ProfilePutDto,
} from 'src/app/models';
import { LoadingService } from 'src/app/services';
import { FormApiService } from 'src/app/services/interfaces';
import { ApiService } from 'src/app/services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService implements FormApiService<Profile> {
  private url = QueryUtil.buildApiUrl(ApiEndpoints.Profiles);

  constructor(private api: ApiService) {}

  async getById(id: number): Promise<Profile> {
    const res = await this.api.getById<Profile>({
      ...ApiRequest.getById<Profile>(this.url, Profile, id),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.ProfileForm) },
    });

    return res;
  }

  async getPaginated(options: PaginationOptions): Promise<PaginatedResult<Profile>> {
    const queryUrl = QueryUtil.buildPaginatedODataQuery(this.url, options);

    const res = await this.api.getPaginated<Profile>({
      ...ApiRequest.get<Profile>(queryUrl, Profile),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.ProfileTable) },
    });

    return res;
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