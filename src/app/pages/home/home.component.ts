import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'src/app/models';
import { ModalService } from 'src/app/services/modal.service';
import { Pages, homeCards, successModalData } from 'src/app/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  cards: Card[] = homeCards;

  constructor(private router: Router, private modalService: ModalService) {}

  isLandingPage(): boolean {
    return this.router.url === '/';
  }

  openFeedbackModal = () => this.modalService.feedback(successModalData());
}
