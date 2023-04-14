import { Pages } from 'src/app/utils';
import { Component } from '@angular/core';
import { NavItem } from 'src/app/models/configs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems: NavItem[] = [
    {
      label: 'Home',
      link: Pages.Home,
    },
    {
      label: 'Timesheets',
      link: Pages.Timesheets,
    },
    {
      label: 'Profiles',
      link: Pages.Profiles,
    },
    {
      label: 'Metrics',
      link: Pages.Metrics,
    },
  ]
}
