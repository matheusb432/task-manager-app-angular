import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { paths } from 'src/app/utils/page-paths.enum';
import { environment } from 'src/environments/environment';

import { ApiRequest } from '../models/configs/api-request';
import { ClubTeamPostDto, ClubTeamPutDto } from '../models/dtos';
import { ClubTeam } from '../models/entities/club-team';
import { FormItem } from '../models/types';
import { DetailsTypes } from './../utils/page-paths.enum';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ClubTeamService {
  private url = `${environment.apiUrl}/club-teams`;

  constructor(private api: ApiService, private router: Router) {}

  async getTeam(id: number): Promise<any> {
    return this.api.getById<ClubTeam>(ApiRequest.getById<ClubTeam>(this.url, ClubTeam, id));
  }

  async getTeams(): Promise<any> {
    return this.api.getAll<ClubTeam>(ApiRequest.getAll<ClubTeam>(this.url, ClubTeam));
  }

  insert = async (ct: ClubTeam): Promise<any> =>
    this.api.insert(ApiRequest.post(this.url, ct, ClubTeamPostDto));

  update = async (ct: ClubTeam): Promise<any> =>
    this.api.update(ApiRequest.put(this.url, ct.id ?? 0, ct, ClubTeamPutDto));

  remove = async (id: number): Promise<any> => this.api.remove(ApiRequest.delete(this.url, id));

  convertTeamToForm({ name, description, badge, primary, secondary }: ClubTeam): FormItem {
    return {
      name: [name, [Validators.required, Validators.maxLength(50)]],
      description: [description, [Validators.required, Validators.maxLength(200)]],
      badge,
      primary: [primary, [Validators.required, Validators.maxLength(10)]],
      secondary: [secondary, [Validators.required, Validators.maxLength(10)]],
    };
  }
}
