import { Pages } from './pages';

const homeCards = [
  {
    id: 'cCardTimesheet',
    title: 'Timesheets',
    content: 'Your registered timesheets',
    url: Pages.Timesheets,
    image: {
      src: '/assets/img/timesheets.jpg',
      priority: true,
      width: 278,
      height: 152,
    },
  },
  {
    id: 'cCardProfile',
    title: 'Profiles',
    content: 'Create and edit your productivity profiles',
    url: Pages.Profiles,
    image: {
      src: '/assets/img/profiles.jpg',
      priority: true,
      width: 278,
      height: 152,
    },
  },
];

export { homeCards };
