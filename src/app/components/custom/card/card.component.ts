import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Card } from 'src/app/models';

@Component({
  selector: 'app-card [card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() card!: Card;
}
