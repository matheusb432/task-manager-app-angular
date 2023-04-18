import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'src/app/models/configs';
import { Pages } from 'src/app/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  {
  cards: Card[] = [
    {
      title: 'Timesheets',
      content: 'Your registered timesheets',
      imgUrl: '/assets/img/timesheets.png',
      url: Pages.Timesheets,

    },
    {
      title: 'Profiles',
      content: 'Create and edit your productivity profiles',
      imgUrl: '/assets/img/profiles.png',
      url: Pages.Profiles
    },
    {
      title: 'Metrics',
      content: 'Your weekly productivity metrics',
      imgUrl: '/assets/img/metrics.png',
      url: Pages.Metrics
    },
  ];

  constructor(private router: Router) {}

  isLandingPage(): boolean {
    return this.router.url === '/';
  }
}
