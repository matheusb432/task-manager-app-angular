import { NavItem } from 'src/app/models';
import { Pages, paths } from './pages';
import { Icons } from './icons.enum';
import { UserRoles } from './user-roles.enum';

export const defaultNavItems: NavItem[] = [
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
  {
    id: 'Tasks',
    label: 'Preset Tasks',
    link: paths.presetTaskItems,
    icon: Icons.Assignment,
  },
  {
    id: 'Metrics',
    label: 'Metrics',
    link: Pages.Metrics,
    icon: Icons.BarChart,
  },
  {
    id: 'Users',
    label: 'Users',
    link: Pages.Users,
    icon: Icons.AccountCircle,
    roles: [UserRoles.Admin],
  },
];

export const userNavItems: NavItem[] = [
  {
    id: 'MyProfile',
    label: 'My Profile',
    link: paths.myProfile,
    icon: Icons.Settings,
  },
];
