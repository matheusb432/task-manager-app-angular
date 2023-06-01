import { Injectable } from '@angular/core';

import { ODataOptions } from 'src/app/helpers/odata';
import { ApiRequest, PaginatedResult, PostReturn, RequestData, Role, User } from 'src/app/models';
import { UserPostDto } from 'src/app/models/dtos/user/user-post-dto';
import { UserPutDto } from 'src/app/models/dtos/user/user-put-dto';
import { FormApiService } from 'src/app/services/interfaces';
import { ApiEndpoints, ElementIds, QueryUtil } from 'src/app/util';
import { PaginationOptions } from '../../../models/configs/pagination-options';
import { ApiService } from '../../../services/api/api.service';
import { LoadingService } from '../../../services/loading.service';
import { MyProfileFormValue } from '../components/my-profile-form/my-profile-form-group';

@Injectable({
  providedIn: 'root',
})
export class SettingsApiService {
  private myProfileUrl = QueryUtil.buildApiUrl(ApiEndpoints.MyProfile);

  constructor(private api: ApiService) {}

  updateMyProfile = async (item: MyProfileFormValue & { id: number }): Promise<void> =>
    this.api.update({
      ...ApiRequest.put(this.myProfileUrl, item.id, item),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.MyProfileSubmit) },
    });
}
