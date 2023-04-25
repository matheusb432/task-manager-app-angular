import { Crumb } from '../models/configs';
import { Icons } from './icons.enum';
import { paths } from './page-paths.enum';

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

const metricCrumbs: Crumb[] = [
  ...homeCrumbs,
  {
    label: 'Metrics',
    url: paths.metrics,
    icon: Icons.PageView,
  },
];

export const crumbDefaults = {
  [paths.home]: homeCrumbs,
  [paths.profiles]: profileCrumbs,
  [paths.profilesCreate]: profileCreateCrumbs,
  [paths.profilesDetails]: profileDetailsCrumbs,
  [paths.timesheets]: timesheetCrumbs,
  [paths.metrics]: metricCrumbs,
};
