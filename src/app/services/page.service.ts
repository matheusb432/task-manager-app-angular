import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormItem, PageData } from '../models';
import { DetailsTypes } from '../utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TypedForm } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  getParam = (param: string) => this.getUrlTree().queryParams[param];

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
      .root.children['primary'].segments.map((it) => it.path)
      .join('/');
}
