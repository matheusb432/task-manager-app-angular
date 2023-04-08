import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  getParam = (param: string) => this.getUrlTree().queryParams[param];

  getUrlTree = () => this.router.parseUrl(this.router.url);

  getParams = () => this.getUrlTree().queryParams;

  getUrlWithoutParams = () =>
    this.getUrlTree()
      .root.children['primary'].segments.map((it) => it.path)
      .join('/');
}
