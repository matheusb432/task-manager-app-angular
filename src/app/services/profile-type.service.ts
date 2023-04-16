import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { ProfileType } from '../models/entities/profile-type';
import { ApiRequest } from '../models/configs';

@Injectable({
  providedIn: 'root',
})
export class ProfileTypeService {
  private url = `${environment.apiUrl}/profiles/types`;

  constructor(private api: ApiService) {}

  async getItem(id: number): Promise<ProfileType[]> {
    return this.api.getById<ProfileType>(
      ApiRequest.getById<ProfileType>(this.url, ProfileType, id)
    ) as Promise<ProfileType[]>;
  }

  async getItems(): Promise<ProfileType[]> {
    return this.api.getAll<ProfileType>(
      ApiRequest.getAll<ProfileType>(this.url, ProfileType)
    ) as Promise<ProfileType[]>;
  }
}
