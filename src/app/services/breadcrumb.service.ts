import { AddMap } from 'mapper-ts/lib-esm';
import { Injectable } from '@angular/core';
import { Crumb } from '../models/configs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private _crumbs: Crumb[] = [];

  get crumbs(): Crumb[] {
    return this._crumbs;
  }

  private set crumbs(value: Crumb[]) {
    this._crumbs = value;
  }


  add(crumb: Crumb): void {
    this.crumbs.push(crumb);
  }

  remove(crumb: Crumb): void {
    this.crumbs = this.crumbs.filter(b => b !== crumb);
  }

  set(crumbs: Crumb[]): void {
    this.crumbs = crumbs;
  }

  clear(): void {
    this.crumbs = [];
  }
}
