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
    // TODO Remove auth links
    {
      id: 'Login',
      label: 'Login',
      link: Pages.Login,
    },
    {
      id: 'Signup',
      label: 'Signup',
      link: Pages.Signup,
    },
  ]
}
