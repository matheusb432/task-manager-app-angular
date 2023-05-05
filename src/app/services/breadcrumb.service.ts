import { Injectable } from '@angular/core';
import { Crumb } from 'src/app/models';
import { crumbDefaults, paths } from '../util';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private _crumbs$ = new BehaviorSubject<Crumb[]>([]);

  get crumbs$() {
    return this._crumbs$.asObservable().pipe(tap(console.log));
  }

  // get crumbs(): Crumb[] {
  //   return this._crumbs;
  // }

  // private set crumbs(value: Crumb[]) {
  //   this._crumbs = value;
  // }

  set(crumbs: Crumb[]): void {
    // this.crumbs = crumbs;
    this._crumbs$.next(crumbs);
  }

  setByUrl(url: string): void {
    const crumbs = (crumbDefaults as { [url: string]: Crumb[] })[url];

    this.set(crumbs ?? crumbDefaults[paths.home]);
  }
}
