import { Component, OnInit } from '@angular/core';
import { Crumb } from 'src/app/models/configs';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { Icons } from 'src/app/utils';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  get crumbs(): Crumb[] {
    return this.service.crumbs;
  }

  Icons = Icons;

  constructor(private service: BreadcrumbService) {}
}
