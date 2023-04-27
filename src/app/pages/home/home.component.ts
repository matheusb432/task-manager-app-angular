import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'src/app/models/configs';
import { LocalStorageService } from 'src/app/services';
import { StoreService, STORE_SERVICE } from 'src/app/services/base';
import { ModalService } from 'src/app/services/modal.service';
import { Pages, StoreKeys, successModalData } from 'src/app/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
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

  constructor(private router: Router, private modalService: ModalService, @Inject(STORE_SERVICE) private store: StoreService) {
    // TODO remove
    console.log(this.store.store({ key: StoreKeys.AccessToken,value: 'test' }));
  }

  isLandingPage(): boolean {
    return this.router.url === '/';
  }

  openFeedbackModal = () => this.modalService.feedback(successModalData());
}
