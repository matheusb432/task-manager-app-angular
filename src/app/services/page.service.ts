import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageData } from '../models';
import { DetailsTypes, Pages } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  goToHome = () => this.router.navigate([Pages.Home]);

  getParam = (param: string) => this.getUrlTree().queryParams[param];

  getQueryParamsObservable() {
    return this.activatedRoute.queryParams;
  }

  getDetailsUrlParams(): PageData {
    return {
      id: this.getParam('id'),
      type: this.getParam('type') as DetailsTypes,
    };
  }

  getUrlTree = () => this.router.parseUrl(this.router.url);

  getParams = () => this.getUrlTree().queryParams;

  getUrlWithoutParams = () =>
    this.getUrlTree()
      .root.children['primary']?.segments?.map((it) => it.path)
      .join('/');

  getPathWithoutParams = () => '/' + this.getUrlWithoutParams();

  buildDetailsUrl = (url: string, id: number, type: DetailsTypes) => `${url}?id=${id}&type=${type}`;
}
