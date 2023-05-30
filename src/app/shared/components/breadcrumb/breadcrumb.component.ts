import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Crumb } from 'src/app/models';
import { PageService } from 'src/app/services';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { Icons } from 'src/app/util';
import { IconComponent } from '../icon/icon.component';
import { NgFor, NgClass, NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, NgClass, RouterLink, NgIf, IconComponent, AsyncPipe],
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
