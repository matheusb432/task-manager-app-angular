import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavItem } from 'src/app/models';
import { Icons, Pages } from 'src/app/util';

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
      icon: Icons.Home,
    },
    {
      id: 'Timesheets',
      label: 'Timesheets',
      link: Pages.Timesheets,
      icon: Icons.CalendarToday,
    },
    {
      id: 'Profiles',
      label: 'Profiles',
      link: Pages.Profiles,
      icon: Icons.Favorite,
    },
  ];
  hovering = false;

  Icons = Icons;
}
