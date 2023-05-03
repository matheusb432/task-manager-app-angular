import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { Card } from 'src/app/models/configs';
import { DateSlide } from 'src/app/models/types';
import { DatesCarouselService } from 'src/app/services/dates-carousel.service';
import { ModalService } from 'src/app/services/modal.service';
import { Pages, successModalData } from 'src/app/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  {
  cards: Card[] = [
    {
      id: 'cCardTimesheet',
      title: 'Timesheets',
      content: 'Your registered timesheets',
      imgUrl: '/assets/img/timesheets.png',
      url: Pages.Timesheets,
    },
    {
      id: 'cCardProfile',
      title: 'Profiles',
      content: 'Create and edit your productivity profiles',
      imgUrl: '/assets/img/profiles.png',
      url: Pages.Profiles,
    },
    {
      id: 'cCardMetric',
      title: 'Metrics',
      content: 'Your weekly productivity metrics',
      imgUrl: '/assets/img/metrics.png',
      url: Pages.Metrics,
    },
  ];

  slides$: Observable<DateSlide[]> = of([]);

  constructor(
    private router: Router,
    private modalService: ModalService,
    private datesCarouselService: DatesCarouselService
  ) {}

  ngOnInit(): void {
    this.slides$ = this.datesCarouselService.getSlides();
  }

  isLandingPage(): boolean {
    return this.router.url === '/';
  }

  openFeedbackModal = () => this.modalService.feedback(successModalData());
}
