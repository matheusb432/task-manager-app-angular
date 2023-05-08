import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Crumb } from 'src/app/models';
import { PageService } from 'src/app/services';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { Icons } from 'src/app/util';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit {

  crumbs$!: Observable<Crumb[]>;

  Icons = Icons;

  constructor(
    private service: BreadcrumbService,
    private pageService: PageService,
    private router: Router
  ) {
    this.crumbs$ = this.service.crumbs$;
  }

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
