import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { ElementIds } from 'src/app/utils';
import { us } from '../../helpers';
import { PaginationOptions } from '../../helpers/pagination-options';
import { ApiRequest, User, PaginatedResult } from 'src/app/models';
import { LoadingService } from '../loading.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private url = `${environment.apiUrl}/users`;

  constructor(private api: ApiService) {}

  async getByEmail(email: string): Promise<User> {
    const queryUrl = us.buildODataQuery(this.url, { filter: { email } });

    return this.api.get<User>({
      ...ApiRequest.get<User>(queryUrl, User),
      mapFn: (res: User[]) => res?.[0],
      customData: {
        loadings: LoadingService.createManyFromIds([ElementIds.UserForm, ElementIds.HeaderUser]),
      },
    }) as Promise<User>;
  }

  async getById(id: number): Promise<User> {
    return this.api.getById<User>({
      ...ApiRequest.getById<User>(this.url, User, id),
      customData: {
        loadings: LoadingService.createManyFromIds([ElementIds.UserForm, ElementIds.HeaderUser]),
      },
    });
  }

  async getPaginated(options: PaginationOptions): Promise<PaginatedResult<User>> {
    const queryUrl = us.buildPaginatedODataQuery(this.url, options);

    return this.api.getPaginated<User>({
      ...ApiRequest.get<User>(queryUrl, User),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.UserTable) },
    });
  }
}
