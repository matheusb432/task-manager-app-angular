import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'src/app/models';
import { homeCards } from 'src/app/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  cards: Card[] = homeCards;
}
