import { Injectable } from '@angular/core';
import {
  ApiRequest,
  PaginatedResult,
  PostReturn,
  Timesheet,
  TimesheetPostDto,
  TimesheetPutDto,
} from 'src/app/models';
import { LoadingService } from '../loading.service';
import { ApiEndpoints, ElementIds, QueryUtil } from 'src/app/util';
import { ApiService } from './api.service';
import { PaginationOptions } from 'src/app/models/configs/pagination-options';

@Injectable({
  providedIn: 'root',
})
export class TimesheetApiService {
  private url = QueryUtil.buildApiUrl(ApiEndpoints.Timesheets);

  constructor(private api: ApiService) {}

  async getById(id: number): Promise<Timesheet> {
    const res = await this.api.getById<Timesheet>({
      ...ApiRequest.getById<Timesheet>(this.url, Timesheet, id),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.TimesheetForm) },
    });

    return res;
  }

  async getPaginated(options: PaginationOptions): Promise<PaginatedResult<Timesheet>> {
    const queryUrl = QueryUtil.buildPaginatedODataQuery(this.url, options);

    const res = await this.api.getPaginated<Timesheet>({
      ...ApiRequest.get<Timesheet>(queryUrl, Timesheet),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.TimesheetTable) },
    });

    return res;
  }

  insert = async (item: Timesheet): Promise<PostReturn> =>
    this.api.insert({
      ...ApiRequest.post(this.url, item, TimesheetPostDto),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.TimesheetSubmit) },
    });

  duplicate = async (item: Timesheet): Promise<PostReturn> => this.insert(item);

  update = async (item: Partial<Timesheet>): Promise<void> =>
    this.api.update({
      ...ApiRequest.put(this.url, item.id ?? 0, item, TimesheetPutDto),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.TimesheetSubmit) },
    });

  remove = async (id: number): Promise<void> =>
    this.api.remove({
      ...ApiRequest.delete(this.url, id),
      customData: { loadings: LoadingService.createManyFromId(ElementIds.TimesheetDelete) },
    });
}
