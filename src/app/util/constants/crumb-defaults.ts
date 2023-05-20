import { Crumb } from 'src/app/models';
import { Icons } from './icons.enum';
import { paths } from './pages';

const homeCrumbs: Crumb[] = [
  {
    label: 'Home',
    url: paths.home,
    icon: Icons.Home,
  },
];

const profileCrumbs: Crumb[] = [
  ...homeCrumbs,
  {
    label: 'Profiles',
    url: paths.profiles,
    icon: Icons.Favorite,
  },
];

const profileCreateCrumbs: Crumb[] = [
  ...profileCrumbs,
  {
    label: 'Create',
    url: paths.profilesCreate,
    icon: Icons.Add,
  },
];

const profileDetailsCrumbs: Crumb[] = [
  ...profileCrumbs,
  {
    label: 'Details',
    url: paths.profilesDetails,
    icon: Icons.PageView,
  },
];

const timesheetCrumbs: Crumb[] = [
  ...homeCrumbs,
  {
    label: 'Timesheets',
    url: paths.timesheets,
    icon: Icons.CalendarToday,
  },
];

const timesheetCreateCrumbs: Crumb[] = [
  ...timesheetCrumbs,
  {
    label: 'Create',
    url: paths.timesheetsCreate,
    icon: Icons.Add,
  },
];

const timesheetDetailsCrumbs: Crumb[] = [
  ...timesheetCrumbs,
  {
    label: 'Details',
    url: paths.timesheetsDetails,
    icon: Icons.PageView,
  },
];

const metricCrumbs: Crumb[] = [
  ...homeCrumbs,
  {
    label: 'Metrics',
    url: paths.metrics,
    icon: Icons.BarChart,
  },
];

export const crumbDefaults = {
  [paths.home]: homeCrumbs,
  [paths.profiles]: profileCrumbs,
  [paths.profilesCreate]: profileCreateCrumbs,
  [paths.profilesDetails]: profileDetailsCrumbs,
  [paths.timesheets]: timesheetCrumbs,
  [paths.timesheetsCreate]: timesheetCreateCrumbs,
  [paths.timesheetsDetails]: timesheetDetailsCrumbs,
  [paths.metrics]: metricCrumbs,
};
