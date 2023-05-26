import { NavItem } from 'src/app/models';
import { Pages } from './pages';
import { Icons } from './icons.enum';

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
    id: 'Metrics',
    label: 'Metrics',
    link: Pages.Metrics,
    icon: Icons.BarChart,
  },
];
