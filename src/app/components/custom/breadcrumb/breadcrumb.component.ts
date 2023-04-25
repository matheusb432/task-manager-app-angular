import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { Crumb } from 'src/app/models/configs';
import { PageService } from 'src/app/services';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { Icons } from 'src/app/utils';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  get crumbs(): Crumb[] {
    return this.service.crumbs;
  }

  Icons = Icons;

  constructor(
    private service: BreadcrumbService,
    private pageService: PageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.setByUrl(this.pageService.getPathWithoutParams());
    this.router.events
      .pipe(
        filter((ev) => ev instanceof NavigationEnd),
        tap(() => this.service.setByUrl(this.pageService.getPathWithoutParams()))
      )
      .subscribe();
  }
}
