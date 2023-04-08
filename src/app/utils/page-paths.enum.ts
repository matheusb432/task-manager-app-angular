export enum Pages {
  Home = 'home',
  Teams = 'teams',
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
  teams: `/${Pages.Teams}`,
  teamsCreate: `/${Pages.Teams}/${PageStates.Create}`,
  teamsDetails: `/${Pages.Teams}/${PageStates.Details}`,
});
