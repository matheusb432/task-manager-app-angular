import { Injectable } from '@angular/core';
import { Crumb } from '../models/configs';
import { crumbDefaults } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private _crumbs: Crumb[] = [];

  get crumbs(): Crumb[] {
    return this._crumbs;
  }

  private set crumbs(value: Crumb[]) {
    this._crumbs = value;
  }

  set(crumbs: Crumb[]): void {
    this.crumbs = crumbs;
  }

  setByUrl(url: string): void {
    const crumbs = (crumbDefaults as { [url: string]: Crumb[] })[url];

    this.set(crumbs ?? []);
  }
}
