import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'src/app/models/configs';

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
    },
    {
      title: 'Profiles',
      content: 'Create and edit your productivity profiles',
    },
    {
      title: 'Metrics',
      content: 'Your weekly productivity metrics',
    },
  ];

  constructor(private router: Router) {}

  isLandingPage(): boolean {
    return this.router.url === '/';
  }
}
