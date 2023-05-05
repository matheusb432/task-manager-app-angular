import { Icons, Pages } from 'src/app/util';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavItem } from 'src/app/models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  navItems: NavItem[] = [
    {
      id: 'Home',
      label: 'Home',
      link: Pages.Home,
    },
    {
      id: 'Timesheets',
      label: 'Timesheets',
      link: Pages.Timesheets,
    },
    {
      id: 'Profiles',
      label: 'Profiles',
      link: Pages.Profiles,
    },
    {
      id: 'Metrics',
      label: 'Metrics',
      link: Pages.Metrics,
    },
  ];

  Icons = Icons;

  checkRender(): boolean {
    console.log('checkRender sidebar');
    return true;
  }
}
