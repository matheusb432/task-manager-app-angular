import { Component } from '@angular/core';
import { BreadcrumbService } from './services/breadcrumb.service';
import { Icons, paths } from './utils';
import { Crumb } from './models/configs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-template';

  crumbs: Crumb[] = [
    {
      label: 'Home',
      url: paths.home,
      icon: Icons.Home,
    },
    {
      label: 'Profiles',
      url: paths.profiles,
      icon: Icons.Favorite,
    },
    {
      label: 'Metrics',
      url: paths.metrics,
    },
    {
      label: 'Users',
      url: paths.metrics,
      icon: Icons.AccountCircle,
    },
    {
      label: 'Big Tester',
      url: paths.metrics,
      icon: Icons.Receipt,
    },
  ]

  // TODO remove
  constructor(private crumber: BreadcrumbService) {
    this.crumber.set(this.crumbs);
  }

}
