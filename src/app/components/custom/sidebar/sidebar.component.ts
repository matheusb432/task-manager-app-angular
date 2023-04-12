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
      link: '/home',
    },
    {
      label: 'Timesheets',
      link: '/timesheets',
    },
    {
      label: 'Profiles',
      link: '/profiles',
    },
  ]
}
