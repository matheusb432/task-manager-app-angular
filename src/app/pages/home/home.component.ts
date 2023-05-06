import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'src/app/models';
import { ModalService } from 'src/app/services/modal.service';
import { homeCards, successModalData } from 'src/app/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  cards: Card[] = homeCards;

  constructor(private modalService: ModalService) {}

  openFeedbackModal = () => this.modalService.feedback(successModalData());
}
