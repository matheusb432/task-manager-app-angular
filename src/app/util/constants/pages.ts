export enum Pages {
  Home = 'home',
  Timesheets = 'timesheets',
  Profiles = 'profiles',
  Metrics = 'metrics',
  NotFound = 'not-found',
  Auth = 'auth',
  Login = 'login',
  Signup = 'signup',
}

export enum PageStates {
  Create = 'create',
  Details = 'details',
}

export enum DetailsTypes {
  View = 'view',
  Edit = 'edit',
  Duplicate = 'duplicate',
}

export const paths = Object.freeze({
  home: `/${Pages.Home}`,
  notFound: `/${Pages.NotFound}`,
  login: `/auth/${Pages.Login}`,
  signup: `/auth/${Pages.Signup}`,
  timesheets: `/${Pages.Timesheets}`,
  timesheetsCreate: `/${Pages.Timesheets}/${PageStates.Create}`,
  timesheetsDetails: `/${Pages.Timesheets}/${PageStates.Details}`,
  profiles: `/${Pages.Profiles}`,
  profilesCreate: `/${Pages.Profiles}/${PageStates.Create}`,
  profilesDetails: `/${Pages.Profiles}/${PageStates.Details}`,
  metrics: `/${Pages.Metrics}`,
});
